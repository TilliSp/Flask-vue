import sqlite3
import re

conn = sqlite3.connect('flsite.db')
cursor = conn.cursor()
#cursor.execute("SELECT * FROM users WHERE email='maya_1999@mail.ru'")
cursor.execute("SELECT * FROM users")
#cursor.execute("DROP TABLE users;")
#conn.execute('''CREATE TABLE IF NOT EXISTS users
#	(id	INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
#	username	VARCHAR(32) UNIQUE,
#	psw	VARCHAR(32),
#    created     DATE
#	);''')
#cursor.execute("SELECT date('now');")
res = cursor.fetchall()
print(res)

conn.commit()

conn.close()

def check(var):
    res=re.sub(r'[^0-9a-zA-Z]', r'', var)
    return res

r = check('========================================1fdgdfh-=-=-=')
print(r)

