import sqlite3
import os
from flask import Flask, render_template, request, g, flash, abort, redirect, url_for, make_response
from FDataBase import FDataBase
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
import datetime
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from UserLogin import UserLogin
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
app.config.update(dict(DATABASE=os.path.join(app.root_path,'flsite.db')))
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
    return UserLogin().fromDB(user_id, dbase)

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
    """Установление соединения с БД перед выполнением запроса"""
    global dbase
    db = get_db()
    dbase = FDataBase(db)

@app.after_request
def after_request(response):
    print('after_request')
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:8080')
    response.headers.add('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
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
                flash('Ошибка добавления статьи', category = 'error')
            else:
                flash('Статья добавлена успешно', category='success')
        else:
            flash('Ошибка добавления статьи', category='error')

    return render_template('add_post.html', menu = dbase.getMenu(), title="Добавление статьи")


@app.route("/post/<alias>")
@login_required
def showPost(alias):
    title, post = dbase.getPost(alias)
    if not title:
        abort(404)

    return render_template('post.html', menu=dbase.getMenu(), title=title, post=post)

@app.route("/login", methods=["POST", "GET"])
def login():
    #db = connect_db()
    #cursor = db.cursor()
    #cursor.execute("""INSERT INTO USERS (name, email,psw, time) VALUES ('admin','admin', '21232f297a57a5a743894a0e4a801fc3', 60);""")
    print("test log")

    formEmail = request.form['email']
    formPassword = request.form['psw']
    user = dbase.getUserByEmail(formEmail)
    print("test  before user", user, user and check_password_hash(user['psw'], formPassword))
    if user and check_password_hash(user['psw'], formPassword):
        print("test  before user if __ ", user)
        userlogin = UserLogin().create(user)
        login_user(userlogin, remember=False)
        print("test  here user", user)
        # return user #redirect(request.args.get("next") or url_for("profile"))

        flash("Неверная пара логин/пароль", "error")

        print("test  after log user: ", user['id'])

        expires = datetime.timedelta(days=1)
        access_token = create_access_token(identity=str(user['id']), expires_delta=expires)

        print("test  access_token: ", access_token)

        return {"access_token": access_token, "id":  str(user['id'])}, 200 #render_template("login.html", menu=dbase.getMenu(), title="Авторизация", form=form)
    return {"error": 'Email or password invalid'}, 401

@app.route("/register", methods=["POST", "GET"])
def register():
    # form = RegisterForm()
    formEmail = request.form['email']
    formPassword = request.form['psw']
    #if form.validate_on_submit():test log
    print("test log register", formEmail, formPassword)
    hash = generate_password_hash(formPassword)
    print("test log register hash ", hash)
    res = dbase.addUser('testName', formEmail, hash)
    print("test log res", res)
    if res:
        flash("Вы успешно зарегистрированы", "success")
        return {"ok": True}, 200
    else:
        flash("Ошибка при добавлении в БД", "error")

    return {"error": 'Email or password invalid'}, 401


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Вы вышли из аккаунта", "success")
    return redirect(url_for('login'))

@app.route('/profile')
@login_required
def profile():
    return render_template("profile.html", menu=dbase.getMenu(), title="Профиль")


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
