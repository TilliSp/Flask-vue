import time
import math
import re

from datetime import date

from flask import url_for
import MySQLdb as db

class FDataBase:
    def __init__(self, app):
        try:
            self.__db = db.connect(host=app.config['MYSQL_HOST'],port=3306,user=app.config['MYSQL_USER'],passwd=app.config['MYSQL_PASSWORD'], autocommit=True)
            self.__db.autocommit(True)
            self.__db.select_db(app.config['MYSQL_DB'])
        except Exception as e:
            print("DB init fail %s " % str(e))

    def fetchone(self, sql, vars):
        print(sql)
        try:
            _cur = self.__db.cursor()
            _cur.execute(sql, vars)
            res = _cur.fetchone()
            if res:
                field_name = [field[0] for field in _cur.description]
                _cur.close()
                return dict(zip(field_name, res))
        except (db.Error, db.Warning) as e:
            print("Ошибка получения данных из БД " + str(e))

        return False
    def check(self, var):
        res = self.re.sub(r'[^0-9a-zA-Z]', r'', var)
        return res

    def addUser(self, username, hpsw):
        if(self.fetchone("SELECT * FROM users WHERE username = %s LIMIT 1",[username])):
            return False
        self.commit("INSERT INTO users(username, psw, created) VALUES(%s, %s, NOW())", [username, hpsw])
        return True

    def getUser(self, user_id):
        return self.fetchone("SELECT * FROM users WHERE id = %s LIMIT 1",[user_id])

    def getUserByUsername(self, username):
        return self.fetchone("SELECT * FROM users WHERE username = %s LIMIT 1", [username])

    def saveToken(self, access_token, user_id):
        return self.commit("UPDATE users SET token = %s WHERE id = %s", [access_token, user_id])
    def commit(self,method, payload):
        try:
            _cur = self.__db.cursor()
            _cur.execute(method, payload)
            # self.__db.commit()
            # _cur.close()
            return True
        except (db.Error, db.Warning) as e:
            print("Ошибка добавления токена в БД: " + str(e))
            return False
    def getToken(self, user_id):
        return self.fetchone("SELECT token FROM users WHERE id = %s LIMIT 1", [user_id])

    def validationToken(self, token):
        return self.fetchone("SELECT id FROM users WHERE token = %s LIMIT 1", [token])

    def passwordCh(self, username, hpsw):
        return self.commit("UPDATE users SET psw = %s WHERE username = %s", (hpsw, username))