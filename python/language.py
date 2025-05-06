import sys
# import ply.yacc as yacc
# import ply.lex as lex
import mysql.connector


try:
    print("Python script started")
    print("Arg1:", sys.argv[1])

    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="yfcnz212006",
        database="gasstation",
    )

    myCursor = mydb.cursor()

    myCursor.execute("SELECT * FROM user")

    myResult = myCursor.fetchall()

    for x in myResult:
        print(x)


    print("Python script ended")
except Exception as e:
    print("Error in Python script:", e)