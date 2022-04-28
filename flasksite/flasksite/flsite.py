import sqlite3
import os
from flask import Flask, render_template, request, g, flash, abort, redirect, url_for, make_response
from sqlalchemy.dialects.sqlite import json

from FDataBase import FDataBase
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
import datetime
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from UserLogin import userLogin
from forms import LoginForm, RegisterForm
from admin.admin import admin

from flask_cors import CORS

# конфигурация
DATABASE = '/tmp/flsite.db'
DEBUG = True
SECRET_KEY = 'fdgfh78@#5?>gfhf89dx,v06k'
MAX_CONTENT_LENGTH = 1024 * 1024

app = Flask(__name__)
app.config.from_object(__name__)
app.config.update(dict(DATABASE=os.path.join(app.root_path, 'flsite.db')))
jwt = JWTManager(app)

app.register_blueprint(admin, url_prefix='/admin')

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = "Авторизуйтесь для доступа к закрытым страницам"
login_manager.login_message_category = "success"
CORS(app)


@login_manager.user_loader
def load_user(user_id):
    print("load_user")
    return userLogin().fromDB(user_id, dbase)


def connect_db():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn


def create_db():
    """Вспомогательная функция для создания таблиц БД"""
    db = connect_db()
    with app.open_resource('sq_db.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()
    db.close()


def get_db():
    '''Соединение с БД, если оно еще не установлено'''
    if not hasattr(g, 'link_db'):
        g.link_db = connect_db()
    return g.link_db


dbase = None


@app.before_request
def before_request():
    if request.method == "POST":
        if request.json:
            global dbase
            db = get_db()
            dbase = FDataBase(db)
        else:
            return {"error": 'cannot parse body'}, 500



@app.after_request
def after_request(response):
    print('after_request')
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:8080')
    response.headers.add('Access-Control-Allow-Headers',
                         'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS, HEAD')

    response.headers.add('Access-Control-Allow-Credentials', 'true')

    # res.header('Access-Control-Allow-Origin', '*');
    # res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
    # res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    return response


@app.teardown_appcontext
def close_db(error):
    '''Закрываем соединение с БД, если оно было установлено'''
    if hasattr(g, 'link_db'):
        g.link_db.close()


@app.route("/")
def index():
    print('test check_flask')
    return render_template('index.html', menu=dbase.getMenu(), posts=dbase.getPostsAnonce())


@app.route("/add_post", methods=["POST", "GET"])
def addPost():
    if request.method == "POST":
        if len(request.form['name']) > 4 and len(request.form['post']) > 10:
            res = dbase.addPost(request.form['name'], request.form['post'], request.form['url'])
            if not res:
                flash('Ошибка добавления статьи', category='error')
            else:
                flash('Статья добавлена успешно', category='success')
        else:
            flash('Ошибка добавления статьи', category='error')

    return render_template('add_post.html', menu=dbase.getMenu(), title="Добавление статьи")


@app.route("/post/<alias>")
@login_required
def showPost(alias):
    title, post = dbase.getPost(alias)
    if not title:
        abort(404)

    return render_template('post.html', menu=dbase.getMenu(), title=title, post=post)


@app.route("/login", methods=["POST"])
def login():
    if 'username' in request.json and 'password' in request.json:
        user_data = request.json
        user = dbase.getUserByUsername(user_data['username'])
        print("test  before user", user, user and check_password_hash(user['psw'], user_data['password']))
        if user and check_password_hash(user['psw'], user_data['password']):
            print("test  before user if __ ", user)
            userlogin = userLogin().create(user)
            login_user(userlogin, remember=False)
            print("test  here user", user)
            print("test  here user TYPE", type(user))
            # return user #redirect(request.args.get("next") or url_for("profile"))

            flash("Неверная пара логин/пароль", "error")

            print("test  after log user: ", user['id'])

            expires = datetime.timedelta(days=1)
            access_token = create_access_token(identity=str(user['id']), expires_delta=expires)[0:32]
            tokenCheckSave = dbase.saveToken(access_token, user['id'])
            print(tokenCheckSave)
            print("длина токена: ", len(access_token))
            print("test  access_token: ", access_token)
            print(type(access_token))

            return {"access_token": access_token, "id": str(user['id']), "role": (user['role']), "username": (
            user['username'])}, 200
        return {"error": 'Email or password invalid'}, 401
    return {"error": 'cannot found required fields'}, 401


@app.route("/register", methods=["POST", "GET"])
def register():
    # form = RegisterForm()
    formEmail = request.form['username']
    formPassword = request.form['psw']
    # if form.validate_on_submit():test log
    print("test log register", formEmail, formPassword)
    hash = generate_password_hash(formPassword)
    print("test log register hash ", hash)
    res = dbase.addUser(formEmail, hash)
    print("test log res", res)
    if res:
        flash("Вы успешно зарегистрированы", "success")
        return {"ok": True}, 200
    else:
        flash("Ошибка при добавлении в БД", "error")

    return {"error": 'Email or password invalid'}, 401

@app.route("/passChange", methods=["POST", "GET"])
@login_required
def passwordChange():
    print('test pass')
    formUsername = request.form['username']
    formPasswordOld = request.form['passwordOld']
    formPasswordNew = request.form['password']
    user = dbase.getUserByUsername(formUsername)
    print('test pass before', formUsername, user['psw'], formPasswordOld, check_password_hash(user['psw'], formPasswordOld))
    if check_password_hash(user['psw'], formPasswordOld):
        dbase.passwordCh(formUsername, generate_password_hash(formPasswordNew))
        return  'OK', 200, print('test pass OK', user['psw'], formPasswordOld, check_password_hash(user['psw'], formPasswordOld))
    return 'NOT OK', 401, print('test pass NOT OK', user['psw'], formPasswordOld, check_password_hash(user['psw'], formPasswordOld))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Вы вышли из аккаунта", "success")
    return redirect(url_for('login'))


@app.route('/profile', methods=["POST", "GET"])
@login_required
def profile():
    formUsername = request.form['username']
    formToken = request.form['token']
    user = dbase.getUserByUsername(formUsername)
    tokendb = dbase.gettoken(formToken)
    if tokendb == user['token']:
        return True, print("token is ok"), {"access_token": user['token'], "id": str(user['id']), "role": (user['role']), "username": (
        user['username'])}
    return False, render_template("profile.html", menu=dbase.getMenu(), title="Профиль")


@app.route('/userava')
@login_required
def userava():
    img = current_user.getAvatar(app)
    if not img:
        return ""

    h = make_response(img)
    h.headers['Content-Type'] = 'image/png'
    return h


@app.route('/upload', methods=["POST", "GET"])
@login_required
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file and current_user.verifyExt(file.filename):
            try:
                img = file.read()
                res = dbase.updateUserAvatar(img, current_user.get_id())
                if not res:
                    flash("Ошибка обновления аватара", "error")
                flash("Аватар обновлен", "success")
            except FileNotFoundError as e:
                flash("Ошибка чтения файла", "error")
        else:
            flash("Ошибка обновления аватара", "error")

    return redirect(url_for('profile'))






if __name__ == "__main__":
    app.run(debug=True)
