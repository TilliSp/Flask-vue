import sqlite3

conn = sqlite3.connect('flsite.db')
cursor = conn.cursor()
cursor.execute("SELECT * FROM users WHERE email='maya_1999@mail.ru'")
#cursor.execute("SELECT * FROM users")
res = cursor.fetchall()
print(res)

conn.commit()

conn.close()