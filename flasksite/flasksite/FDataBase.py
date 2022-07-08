import time
import math
import re

from datetime import date

from flask import url_for
import MySQLdb as db

class FDataBase:
    def __init__(self, app):
        try:
            self.__db = db.connect(host=app.config['MYSQL_HOST'],port=3306,user=app.config['MYSQL_USER'],passwd=app.config['MYSQL_PASSWORD'])
            self.__db.autocommit(True)
            self.__db.select_db(app.config['MYSQL_DB'])
            self.__cur = self.__db.cursor()
        except Exception as e:
            print("DB init fail %s " % str(e))

    def fetchone(self, sql, vars):
        try:
            self.__cur.execute(sql, vars)
            res = self.__cur.fetchone()

            if res:
                field_name = [field[0] for field in self.__cur.description]
                return dict(zip(field_name, res))
        except (db.Error, db.Warning) as e:
            print("Ошибка получения данных из БД " + str(e))

        return False
    def check(self, var):
        res = self.re.sub(r'[^0-9a-zA-Z]', r'', var)
        return res


    def addPost(self, title, text, url):
        try:
            self.__cur.execute(f"SELECT COUNT() as `count` FROM posts WHERE url LIKE '{url}'")
            res = self.__cur.fetchone()
            if res['count'] > 0:
                print("Статья с таким url уже существует")
                return False

            base = url_for('static', filename='images_html')

            text = re.sub(r"(?P<tag><img\s+[^>]*src=)(?P<quote>[\"'])(?P<url>.+?)(?P=quote)>",
                          "\\g<tag>" + base + "/\\g<url>>",
                          text)

            tm = math.floor(time.time())
            self.__cur.execute("INSERT INTO posts VALUES(NULL, ?, ?, ?, ?)", (title, text, url, tm))
            self.__db.commit()
        except (db.Error, db.Warning) as e:
            print("Ошибка добавления статьи в БД " + str(e))
            return False

        return True

    def addUser(self, username, hpsw):
        if(self.fetchone("SELECT * FROM users WHERE username = %s LIMIT 1",[username])):
            return False
        try:
            self.__cur.execute("INSERT INTO users(username, psw, created) VALUES(%s, %s, NOW())", [username, hpsw])
            self.__db.commit()
        except (db.Error, db.Warning) as e:
            print("Ошибка добавления пользователя в БД " + str(e))
            return False

        return True

    def getUser(self, user_id):
        return self.fetchone("SELECT * FROM users WHERE id = %s LIMIT 1",[user_id])


    def getUserByUsername(self, username):
        return self.fetchone("SELECT * FROM users WHERE username = %s LIMIT 1", [username])

    def saveToken(self, access_token, user_id):
        try:
            self.__cur.execute("UPDATE users SET token = %s WHERE id = %s", [access_token, user_id])
            self.__db.commit()
        except (db.Error, db.Warning) as e:
            print("Ошибка добавления токена в БД: " + str(e))
            return False
        return True

    def getToken(self, user_id):
        return self.fetchone("SELECT token FROM users WHERE id = %s LIMIT 1", [user_id])

    def validationToken(self, token):
        return self.fetchone("SELECT id FROM users WHERE token = %s LIMIT 1", [token])

    def passwordCh(self, username, hpsw):
        try:
            self.__cur.execute("UPDATE users SET psw = %s WHERE username = %s", (hpsw, username))
            self.__db.commit()
        except (db.Error, db.Warning) as e:
            print("Ошибка замены пароля в БД: " + str(e))
            return False
        return True

    def getAllUsersAuth(self, user_id):
        try:
            self.__cur.execute(f"SELECT users, role FROM users")
            self.__db.commit()
        except (db.Error, db.Warning) as e:
            print("Ошибка вывода пользователей из БД: " + str(e))
            return False
        return True
