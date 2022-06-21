import json
import sqlite3
import re

from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

hash = generate_password_hash('admin1')
conn = sqlite3.connect('flsite.db')
cursor = conn.cursor()
#cursor.execute("SELECT id FROM users WHERE token = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1 LIMIT 1")
#cursor.execute("UPDATE users SET psw=? WHERE id=9", (hash))
#cursor.execute("DELETE FROM users WHERE id=11")
cursor.execute("SELECT * FROM users WHERE id=9")
#cursor.execute("ALTER TABLE users ADD role bit DEFAULT 0")
#conn.execute('''CREATE TABLE IF NOT EXISTS users
#	(id	INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
#	username	VARCHAR(32) UNIQUE,
#	psw	VARCHAR(32),
#    created     DATE
#	);''')
#cursor.execute("SELECT date('now');")
res = cursor.fetchall()
#access_token = create_access_token(identity=str(res['id']))
print(type(res))
print(res)
#print(access_token)

conn.commit()

conn.close()

def check(var):
    res=re.sub(r'[^0-9a-zA-Z]', r'', var)
    return res

r = check('========================================1fdgdfh-=-=-=')
print(r)


@app.route("/login", methods=["POST"])
def login():
    if 'username' in request.json and 'password' in request.json:
        user_data = request.json
        print("INPUT DATA ", user_data)
        user = dbase.getUserByUsername(user_data['username'])
        print("PSW DATA ", user)
        if user and check_password_hash(user['psw'], user_data['password']):
            print("test  here user TYPE", type(user['username']))

            flash("Неверная пара логин/пароль", "error")

            print("test  after log user: ", user['id'])

            access_token = generate_token()
            print(access_token)
            print(type(access_token))
            dbase.saveToken(access_token,user['id'])

            return {"access_token": access_token, "id": str(user['id']), "role": (user['role']), "username": (
                user['username'])}, 200
        return {"error": 'Email or password invalid'}, 401
    return {"error": 'cannot found required fields'}, 401


async def create_user_token(user_id: int):
    """ Создает токен для пользователя с указанным user_id """
    query = (
        tokens_table.insert()
        .values(expires=datetime.now() + timedelta(weeks=2), user_id=user_id)
        .returning(tokens_table.c.token, tokens_table.c.expires)
    )

    return await database.fetch_one(query)