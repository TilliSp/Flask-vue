import json
import sqlite3
import re

from werkzeug.security import generate_password_hash

hash = generate_password_hash('admin1')
conn = sqlite3.connect('flsite.db')
cursor = conn.cursor()
#cursor.execute("SELECT * FROM users WHERE id=9")
#cursor.execute("UPDATE users SET psw=? WHERE id=9", (hash))
cursor.execute("DELETE FROM users WHERE id=11")
cursor.execute("SELECT * FROM users")
#cursor.execute("ALTER TABLE users ADD role bit DEFAULT 0")
#conn.execute('''CREATE TABLE IF NOT EXISTS users
#	(id	INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
#	username	VARCHAR(32) UNIQUE,
#	psw	VARCHAR(32),
#    created     DATE
#	);''')
#cursor.execute("SELECT date('now');")
res = cursor.fetchall()

print(type(res))
print(res)

conn.commit()

conn.close()

def check(var):
    res=re.sub(r'[^0-9a-zA-Z]', r'', var)
    return res

r = check('========================================1fdgdfh-=-=-=')
print(r)

