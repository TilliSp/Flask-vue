import sqlite3
import os
import re
from os import walk
import platform
from flask import Flask, render_template, request, g,jsonify, flash, abort, redirect, url_for, make_response
from sqlalchemy.dialects.sqlite import json
from random import choice
from string import ascii_uppercase
from FDataBase import FDataBase
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
import datetime
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from UserLogin import userLogin
from admin.admin import admin
from flask_cors import CORS

# конфигурация
DATABASE = '/tmp/flsite.db'
DEBUG = True
SECRET_KEY = 'fdgfh78@#5?>gfhf89dx,v06k'
MAX_CONTENT_LENGTH = 1024 * 1024
wait_timeout = 300


app = Flask(__name__)
# jwt_test GWtJ310XJwinmvzZ  jwt_base
app.config.from_object(__name__)

dbase = None

app.config['MYSQL_HOST'] = '192.168.101.11'
app.config['MYSQL_USER'] = 'jwt_test'
app.config['MYSQL_PASSWORD'] = 'GWtJ310XJwinmvzZ'
app.config['MYSQL_DB'] = 'jwt_base'

concat_slash = '/'
if platform.system() == 'Windows':
    concat_slash = '\\'


app.config['NEURO_PATH'] = './photo/'

# apt install imagemagick
# convert $file -resize 256x256 $new_name


dbase = FDataBase(app)

jwt = JWTManager(app)

app.register_blueprint(admin, url_prefix='/admin')

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = "Авторизуйтесь для доступа к закрытым страницам"
login_manager.login_message_category = "success"
CORS(app)

def generate_token() -> object:
    # hash = sha256_crypt.hash("rand")
    return ''.join(choice(ascii_uppercase) for i in range(32))

@login_manager.user_loader
def load_user(user_id):
    print("load_user")
    return userLogin().fromDB(user_id, dbase)




# for example -> create file migrate.py [create sqlite database + shema]


@app.before_request
def before_request(isAuth=False):
    g.user = {'isAuth': False, 'id': False}
    if request.method == "POST":
        if request.json:
            global dbase
            if str(request.url_rule) not in ['/login', '/register']:
                print(str(request.url_rule))
                request_token = request.headers.get('Authorization')
                if request_token:
                    # Bearer 123123123123123123123
                    try:
                        request_token = request_token.split()[1]
                    except:
                        # токен пустой
                        return
                    print('token validation ',request_token)
                    if len(request_token) == 32:
                        response = dbase.validationToken(request_token)
                        print('token validation ', response)
                        if response and response['id']:
                            g.user['isAuth'] = True
                            g.user['id'] = response['id']
                            return
                        else:
                            return {'User is not Auth'}, 403
            else:
                print('YAY')
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


@app.route("/add_post", methods=["POST"])
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


@app.route("/view_folder", methods=["POST"])
def view_folder():
    if 'folder' in request.json:
        folder = request.json['folder']
    else:
        folder = '/'
    fullpath = app.config['NEURO_PATH'] + folder
    dirs = list()
    for (dirpath, dirnames, filenames) in walk(fullpath):
        for name in filenames:
            # FIXME filter only [] extensions. example ['png','jpg']
            # print('fullpath', fullpath)
            # print('dirpath',dirpath,'dirnames', dirnames, 'filenames',filenames[1])
            # ext = os.path.splitext(filenames[0])
            # print('ext', ext)
            # if ext == "jpg":
            dirs.append({'type': "file", 'name': name})
        for name in dirnames:
            dirs.append({'type':"dir",'name':name})
        break
    return jsonify({"data": dirs, "dir": folder}),200



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
        if user and check_password_hash(user['psw'], user_data['password']):
            flash("Неверная пара логин/пароль", "error")
            access_token = generate_token()
            dbase.saveToken(access_token,user['id'])
            return {"access_token": access_token, "id": str(user['id']), "role": (user['role']), "username": (
                user['username'])}, 200
        return {"error": 'Login or password invalid'}, 401
    return {"error": 'cannot found required fields'}, 403


@app.route("/register", methods=["POST"])
def register():
    if 'username' in request.json and 'password' in request.json:
        user_data = request.json
        hash = generate_password_hash(user_data['password'])
        res = dbase.addUser(user_data['username'], hash)
        if res:
            flash("Вы успешно зарегистрированы", "success")
            return {"ok": True}, 200
        else:
            flash("Ошибка при добавлении в БД", "error")

        return {"error": 'Login or password invalid'}, 401


@app.route("/passChange", methods=["POST", "GET"])
@login_required
def passwordChange():
    print('test pass')
    # formUsername = request.form['username']
    # formPasswordOld = request.form['passwordOld']
    # formPasswordNew = request.form['password']
    if 'username' in request.json and 'password' in request.json:  # id
        print('test pa5y6yss')
        user_data = request.json
        user = dbase.getUserByUsername(user_data['username'])
        print('test pass before', user_data['username'], user['psw'], user_data['passwordOld'],
              check_password_hash(user['psw'], user_data['passwordOld']))
        # if check_password_hash(user['psw'], user_data['passwordOld']):
        #     dbase.passwordCh(user_data['username'], generate_password_hash(user_data['password']))
        #     return  'OK', 200, print('test pass OK', user['psw'], user_data['passwordOld'], check_password_hash(user['psw'], user_data['passwordOld']))
        return 'NOT OK', 401, print('test pass NOT OK', user['psw'], user_data['passwordOld'],
                                    check_password_hash(user['psw'], user_data['passwordOld']))
    return {"error": 'cannot found required fields'}, 401, print('test thth')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Вы вышли из аккаунта", "success")
    return redirect(url_for('login'))


@app.route('/validation', methods=["POST"])
def validation():
    print("profile before ok")
    print("isAuth.user:", g.user['isAuth'], "id.user:", g.user['id'])
    if g.user['isAuth'] and g.user['id']:
        print("OK?")
        userInfo = dbase.getUser(g.user['id'])
        if userInfo:
            return {"userInfo": {"role": (userInfo['role']), "username": (userInfo['username']),
                                 "created": str(userInfo['created'])}},200
    return {"error": 'cannot found required fields'}, 401, print('test thth')


def admin():
    return True


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
