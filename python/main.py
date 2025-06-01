import ply.yacc as yacc
import ply.lex as lex
import mysql.connector
from datetime import date


varList = []
functions = {}
employeeGlobal = ''
stopProcessing = False

mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="yfcnz212006",
        database="gasstation",
    )

reserved = {
    "availability": "RESERVED_AVAILABILITY",
    "days": "RESERVED_DAYS",
    "hours": "RESERVED_HOURS",
    "service": "RESERVED_SERVICE",
    "name": "RESERVED_NAME",
    "description": "RESERVED_DESCRIPTION",
    "status": "RESERVED_STATUS",
    "employee": "RESERVED_EMPLOYEE",
    "client": "RESERVED_CLIENT",
    "unavailability": "RESERVED_UNAVAILABILITY",
    "set": "RESERVED_SET",
    "if": "RESERVED_IF",
    "reason": "RESERVED_REASON",
    "material": "RESERVED_MATERIAL",
    "def": "RESERVED_FUNCTION",
    "end_def": "RESERVED_END_OF_FUNCTION",
    "date": "RESERVED_DATE",
    "to": "RESERVED_TO",
    "query": "RESERVED_QUERY",
    "period": "RESERVED_PERIOD",
    "type": "RESERVED_TYPE",
    "filter": "RESERVED_FILTER",
    "services": "RESERVED_SERVICES"
}

tokens = ["STRING", "RBRACE", "LBRACE", "COMMA", "LPAREN", "RPAREN", "QUOTE", "SEMICOLON", "EQUALS", "AND",
          "OR", "COLON", "MINUS", "ASSIGN", "DATE", "TIME", "LSQRBRACE", "RSQRBRACE"] + list(reserved.values())

t_LSQRBRACE = r"\["
t_RSQRBRACE = r"\]"
t_LPAREN = r"\("
t_RPAREN = r"\)"
t_COMMA = r","
t_LBRACE = r"\{"
t_RBRACE = r"\}"
t_SEMICOLON = r"\;"
t_QUOTE = r"\""
t_COLON = r"\:"
t_EQUALS = r"\=\="
t_ASSIGN = r"\="
t_MINUS = r"\-"
t_AND = r"\&&"
t_OR = r"\|\|"


def t_DATE(t):
    r'[0-2][0-9][0-9][0-9]-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])'
    return t


def t_TIME(t):
    r'([0-1][0-9]|2[0-3]):[0-5][0-9]'
    return t


def t_STRING(t):
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    t.type = reserved.get(t.value, "STRING")
    return t


def t_newline(t):
    r"\n+"
    t.lexer.lineno += len(t.value)


t_ignore = " \t"
t_ignore_COMMENT = r'\#.*'


def t_error(t):
    print(
        "Character Unknown '%s'" % t.value[0],
        " on line %d" % t.lineno,
        " and column %d" % find_column(test_string, t),
    )
    t.lexer.skip(1)

def showError(msg, lineno):
    global stopProcessing
    if lineno == 0:
        print("Error : "+msg)    
    else :
        print("Error at line "+str(lineno)+": "+msg)
    stopProcessing = True

def find_column(input, token):
    line_start = input.rfind("\n", 0, token.lexpos) + 1
    return (token.lexpos - line_start) + 1


def p_start(p):
    """
    start : statement start
    | statement
    """


def p_statement(p):
    """
    statement : defRule
              | availabilityRule
              | unavailabilityRule
              | funcRunRule             
              | queryRule
              | setEmployee
              | var
              | error_sent
    """

def p_def(p):
    """
      defRule : RESERVED_FUNCTION funcName LPAREN RPAREN COLON funcExpr RESERVED_END_OF_FUNCTION
    """
    fname = p[2]
    fexpr = p[6]
    def run_func(funcName = fname,expr = fexpr):
            func_code_run(funcName,expr)
    functions[fname] = run_func

def p_def_error(p):
    """
      defRule : RESERVED_FUNCTION error LPAREN RPAREN COLON funcExpr RESERVED_END_OF_FUNCTION
    """
    showError("Invalid function declaration", p.lineno(1))

def p_funcName(p):
    """
      funcName : STRING
    """
    p[0] = p[1]

def p_funcRun(p):
    """
      funcRunRule : funcName LPAREN RPAREN SEMICOLON
    """
    fname = p[1]
    if fname in functions:
        functions[fname]()
    else :
        showError("Function "+str(fname)+" does not exist", p.lineno(2))


def func_code_run(funcName, expr):
    #print("run "+str(expr)+" function code")
    if expr != None:
        match expr[0]:
            case 'UNAV' : 
                run_unavailability((expr[1], expr[2]))
            case 'AV' :
                run_availability((expr[1], expr[2], expr[3], expr[4]))
            case _:
                showError("Operation "+str(expr[0])+" is not supported in function "+str(funcName))
    

def p_funcExpr(p):
    """
    funcExpr : unavailabilityRule
             | availabilityRule
    """
    p[0] = p[1]

def p_Unavailability(p):
    """
      unavailabilityRule : RESERVED_SET RESERVED_UNAVAILABILITY COLON \
                         RESERVED_DATE COLON dateRule COMMA\
                         RESERVED_REASON COLON sentence SEMICOLON
    """
    #print('unavailability rule work')
    dateRule = p[6]
    reason = p[10]
    p[0]=('UNAV', dateRule, reason)
    if isFuncDeclaration(p) == False :
        run_unavailability((dateRule, reason))

def p_Unavailability_error(p):
    """
      unavailabilityRule : RESERVED_SET  RESERVED_UNAVAILABILITY COLON error SEMICOLON
    """
    showError("Wrong use of Unavailability", p.lineno(1))

def run_unavailability(parm):
    global stopProcessing
    if stopProcessing:
        return
    # unavailability execution
    print (str(parm) + " unavailability code work")

def p_dates(p):
    """
     dateRule : DATE RESERVED_TO DATE
     """
    start_date = date.fromisoformat(p[1])
    end_date = date.fromisoformat(p[3])
    p[0] = (start_date, end_date)

def p_date(p):
    """
     dateRule : DATE
     """
    my_date = date.fromisoformat(p[1])
    p[0] = (my_date, None)

def p_set_employee(p):
    """
    setEmployee : RESERVED_EMPLOYEE COLON strWithQuotas SEMICOLON
    """  
    global employeeGlobal
    employeeGlobal = p[3]

def p_set_employee_error(p):
    """
    setEmployee : RESERVED_EMPLOYEE COLON error SEMICOLON
    """  
    showError("Wrong use of employee assignment", p.lineno(2))

def p_Availability(p):
    """
      availabilityRule : RESERVED_SET RESERVED_AVAILABILITY COLON \
                         RESERVED_DAYS COLON daysRule COMMA \
                         RESERVED_EMPLOYEE COLON strWithQuotas COMMA \
                         RESERVED_HOURS COLON TIME MINUS TIME SEMICOLON
                       | RESERVED_SET RESERVED_AVAILABILITY COLON \
                         RESERVED_DAYS COLON daysRule COMMA \
                         RESERVED_HOURS COLON TIME MINUS TIME SEMICOLON
    """
    #print('availability rule work')
    dateRule = ''
    employee = ''
    timeFrom = ''
    timeTo = ''
    plen = len(p)
    if len(p) == 18 :
        # days, employee, hours
        if p[4] == "days" and p[8] == "employee" and p[12] == "hours" :
            dateRule = p[6]  
            employee = p[10]  
            timeFrom = p[14]
            timeTo = p[16]
        else :
            showError("Wrong sequence of arguments in Availability function",p.lineno(1))
            raise SyntaxError
    elif len(p) == 14 :
            # days, hours
            if p[4] == "days" and p[8] == "hours" :
                dateRule = p[6]
                employee = ''
                timeFrom = p[10]
                timeTo = p[12]
            else :
                showError('Wrong sequence of arguments in Availability function', p.lineno(1))
                raise SyntaxError
    else :
        showError ('Wrong number of arguments in Availability function', p.lineno(1))
        raise SyntaxError

    p[0] = ('AV', employee, dateRule, timeFrom, timeTo)
    if isFuncDeclaration(p) == False :
        run_availability((employee, dateRule, timeFrom, timeTo))


def p_Availability_error(p):
    """
      availabilityRule : RESERVED_SET RESERVED_AVAILABILITY COLON error SEMICOLON
    """
    showError("Wrong use of Availability", p.lineno(1))

def isFuncDeclaration(p) :
    for stackItem in p.stack :
        if stackItem.type == "RESERVED_FUNCTION" :
            return True
    return False

def run_availability(parm):
    if stopProcessing:
        return
    if parm[0] == '' :
        parm = (employeeGlobal, parm[1], parm[2], parm[3])
    # availability execution
    print (str(parm) + " availability code work")

def p_days(p):
    """
    daysRule : STRING RESERVED_TO STRING
            | STRING
    """


def p_str(p):
    """
    sentence : STRING sentence
    """
    p[0] = p[1] + " " + p[2]

def p_word(p):
    """
    sentence : STRING
    """
    p[0] = p[1]

def p_strWithQuotas(p):
    """
    strWithQuotas : QUOTE STRING QUOTE
    """
    p[0] = p[2]

def p_arrEls(p):
    """
    arrEl : QUOTE sentence QUOTE COMMA arrEl
    """
    p[0] = p[2] + ' ' + p[5]

def p_arrEl(p):
    """
    arrEl : QUOTE sentence QUOTE
    """
    p[0] = p[2]

def p_arr(p):
    """
    arr : LSQRBRACE arrEl RSQRBRACE
    """
    p[0] = p[2].split()

def searchVar(varName, varValue):
    for i in varList:
        if (i[0] == varName):
            i[1] = varValue
            return
    varList.append([varName, varValue])
def p_var(p):
    """
    var : STRING ASSIGN arr SEMICOLON
    """
    searchVar(p[1],p[3])
def p_query(p):
    """
    queryRule : RESERVED_QUERY COLON \
            RESERVED_TYPE COLON RESERVED_SERVICES COMMA \
            RESERVED_PERIOD COLON dateRule COMMA \
            RESERVED_FILTER COLON RESERVED_TYPE EQUALS QUOTE sentence QUOTE SEMICOLON
    """
    if stopProcessing:
        return
    try:
        start_date, end_date = p[9]
        if not end_date:
            end_date = start_date

        myCursor = mydb.cursor(dictionary=True)

        myCursor.execute("""SELECT s.*, u.Name as customer_name , service.Name As service_name
                            FROM scheduleservice s
                            inner join Customer c on c.CustomerID = s.CustomerID
                            inner join User u on u.UserID = c.UserID
                            inner join service on service.ServiceID = s.ServiceID
                            where date >= '""" + str(start_date) + """' AND date <= '""" + str(end_date) + """' and
                                            service.Name = '""" + str(p[16]) + """';""")

        myResult = myCursor.fetchall()

        if(myResult):
            print("Query result:")
            for row in myResult:
                print("- " + str(row['Date']) + " : " + str(row['service_name']) + " for " + str(row['customer_name']))
        else:
            print('No result')

    except mysql.connector.Error as err:
        showError("SQL Error:" + err, p.lineno[1])

def p_query_error(p):
    """
    queryRule : RESERVED_QUERY COLON error SEMICOLON
    """
    showError("Wrong use of query", p.lineno(1))

def p_sentance_error(p):
    """
    error_sent : error SEMICOLON
    """
    showError("Syntax error", p.lineno(2))

def p_error(p):
    if not p:
        showError("Unexpected end of file", 0)

lexer = lex.lex()
parser = yacc.yacc()

#test_string = """set availability:
#                days: Monday to Friday;
#                hours: 08:00-12:00;
#
#                set unavailability:
#                date: 2025-04-10 to 2025-04-12;
#                reason: vacation;
#
#                query:
#                type: services;
#                period: 2025-01-01 to 2025-07-20;
#                filter: type == "Fuel Refill";
#                
#                query:
#                type: services;
#                period:  2025-01-01 to 2025-07-20;
#                filter: type == "Car Wash";
#                
#                employees_dayoff = ["John", "Anna", "Carlos"];
#                employees_dayoff = ["John"];
#                employees_dayoff = ["John", "Anna", "Carlos", "Anna", "Carlos"];
#                employees = ["John", "Anna", "Carlos"];
#                emp = ["John", "Anna", "Carlos"];
#                """

test_string = """def myfuncAV(): 
                    set availability: 
                        days: Monday to Friday,
                        hours: 08:00-12:00; 
                 end_def

                 def myfuncUNAV(): 
                    set unavailability:
                        date: 2025-01-01 to 2025-01-12,
                        reason: vacation;
                 end_def
                 employee: "angel123";
                 set unavailability:
                    date: 2025-04-10 to 2025-04-12,
                    reason: sickLeave;
                 employees_dayoff = ["John", "Anna", "Carlos"];
                 myfuncAV();
                 myfuncUNAV();
                """

parser.parse(test_string)

# print(varList)

