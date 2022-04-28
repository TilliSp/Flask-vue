import sqlite3
import time
import math
import re
from datetime import date

from flask import url_for


class FDataBase:
    def __init__(self, db):
        self.__db = db
        self.__cur = db.cursor()

    def getMenu(self):
        sql = '''SELECT * FROM mainmenu'''
        try:
            self.__cur.execute(sql)
            res = self.__cur.fetchall()
            if res: return res
        except:
            print("Ошибка чтения из БД")
        return []


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
        except sqlite3.Error as e:
            print("Ошибка добавления статьи в БД " + str(e))
            return False

        return True

    def getPost(self, alias):
        try:
            self.__cur.execute(f"SELECT title, text FROM posts WHERE url LIKE '{alias}' LIMIT 1")
            res = self.__cur.fetchone()
            if res:
                return res
        except sqlite3.Error as e:
            print("Ошибка получения статьи из БД " + str(e))

        return (False, False)

    def getPostsAnonce(self):
        try:
            self.__cur.execute(f"SELECT id, title, text, url FROM posts ORDER BY time DESC")
            res = self.__cur.fetchall()
            if res: return res
        except sqlite3.Error as e:
            print("Ошибка получения статьи из БД " + str(e))

        return []

    def addUser(self, username, hpsw):
        try:
            self.__cur.execute(f"SELECT * FROM users WHERE username = '{username}' LIMIT 1")
            res = self.__cur.fetchone()
            if res:
                print("Пользователь с таким username уже существует")
                return False

            self.__cur.execute("INSERT INTO users VALUES(NULL, ?, ?, datetime('now'), 0,0)", (username, hpsw))
            self.__db.commit()
        except sqlite3.Error as e:
            print("Ошибка добавления пользователя в БД " + str(e))
            return False

        return True

    def getUser(self, user_id):
        try:
            self.__cur.execute(f"SELECT * FROM users WHERE id = {user_id} LIMIT 1")
            res = self.__cur.fetchone()
            if not res:
                print("Пользователь не найден")
                return False

            return res
        except sqlite3.Error as e:
            print("Ошибка получения данных из БД " + str(e))

        return False


    def getUserByUsername(self, username):
        try:
            self.__cur.execute(f"SELECT * FROM users WHERE username = '{username}' LIMIT 1")
            res = self.__cur.fetchone()
            if not res:
                print("Пользователь не найден")
                return False

            return res
        except sqlite3.Error as e:
            print("Ошибка получения данных из БД " + str(e))

        return False

    def updateUserAvatar(self, avatar, user_id):
        if not avatar:
            return False

        try:
            binary = sqlite3.Binary(avatar)
            self.__cur.execute(f"UPDATE users SET avatar = ? WHERE id = ?", (binary, user_id))
            self.__db.commit()
        except sqlite3.Error as e:
            print("Ошибка обновления аватара в БД: " + str(e))
            return False
        return True


    def saveToken(self, access_token, user_id):
        try:
            self.__cur.execute("UPDATE users SET token = ? WHERE id = ?", (access_token, user_id))
            self.__db.commit()
        except sqlite3.Error as e:
            print("Ошибка добавления токена в БД: " + str(e))
            return False
        return True

    def getToken(self, user_id):
        try:
            self.__cur.execute(f"SELECT token FROM users WHERE id = ? LIMIT 1", (user_id))
            res = self.__cur.fetchone()
            if res:
                return res
        except sqlite3.Error as e:
            print("Ошибка получения токена из БД " + str(e))

    def validationToken(self,):
        try:
            self.__cur.execute()
            self.__db.commit()
        except sqlite3.Error as e:
            print("Ошибка проверки токена в БД: " + str(e))
            return False
        return True

    def passwordCh(self, username, hpsw):
        try:
            self.__cur.execute(f"UPDATE users SET psw = ? WHERE username = ?", (hpsw, username))
            self.__db.commit()
        except sqlite3.Error as e:
            print("Ошибка замены пароля в БД: " + str(e))
            return False
        return True
