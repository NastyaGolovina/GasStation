import sys
import ply.yacc as yacc
import ply.lex as lex
import mysql.connector
from datetime import datetime

varDict = {}
functions = {}
employeeGlobal = ''
dateGlobal = None

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
    # "name": "RESERVED_NAME",
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
    "services": "RESERVED_SERVICES",
    "sunday": "RESERVED_SUNDAY",
    "monday": "RESERVED_MONDAY",
    "tuesday": "RESERVED_TUESDAY",
    "wednesday": "RESERVED_WEDNESDAY",
    "thursday": "RESERVED_THURSDAY",
    "friday": "RESERVED_FRIDAY",
    "saturday": "RESERVED_SATURDAY",
    "duration": "RESERVED_DURATION",
    "priority": "RESERVED_PRIORITY",
    "high": "RESERVED_HIGH",
    "medium": "RESERVED_MEDIUM",
    "low": "RESERVED_LOW",
    "description": "RESERVED_DESCRIPTION",
    "true": "RESERVED_TRUE",
    "false": "RESERVED_FALSE",
    "scheduled_service": "RESERVED_SCHEDULED_SERVICE",
    "scheduled": "RESERVED_SCHEDULED",
    "processing": "RESERVED_PROCESSING",
    "completed": "RESERVED_COMPLETED",
    "material": "RESERVED_MATERIAL",
    "batch": "RESERVED_BATCH",
    "end_batch": "RESERVED_END_BATCH",
    "or": "RESERVED_OR",
    "and": "RESERVED_AND",
    "else": "RESERVED_ELSE",
    "for_employees": "RESERVED_FOR_EMPLOYEES"
}

tokens = ["STRING",  "COMMA", "LPAREN", "RPAREN", "QUOTE", "SEMICOLON", "EQUALS",
          "COLON", "MINUS", "ASSIGN", "DATE", "TIME", "TIME_DURATION", "LSQRBRACE", "RSQRBRACE"] + list(
    reserved.values())

t_LSQRBRACE = r"\["
t_RSQRBRACE = r"\]"
t_LPAREN = r"\("
t_RPAREN = r"\)"
t_COMMA = r","
# t_LBRACE = r"\{"
# t_RBRACE = r"\}"
t_SEMICOLON = r"\;"
t_QUOTE = r"\""
t_COLON = r"\:"
t_EQUALS = r"\=\="
t_ASSIGN = r"\="
t_MINUS = r"\-"
# t_AND = r"\&&"
# t_OR = r"\|\|"


def t_TIME_DURATION(t):
    r'([1-5]?[0-9]min)|([1-9]|1[0-9]|2[0-4])h'
    return t


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


def showError(msg, lineno=0):
    if lineno == 0:
        print("Error : " + msg)
    else:
        print("Error at line " + str(lineno) + ": " + msg)


def find_column(input, token):
    line_start = input.rfind("\n", 0, token.lexpos) + 1
    return (token.lexpos - line_start) + 1


# ----------------------------------------------------------------------------
# ----------------------- P A R S E R ----------------------------------------
# ----------------------------------------------------------------------------

# ---------------- Main flow rules
def p_start(p):
    """
    start : start statement
          | statement
    """
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[2]]


def p_statement(p):
    """
    statement : defRule
              | availabilityRule
              | unavailabilityRule
              | funcRunRule
              | queryRule
              | setEmployee
              | var
              | serviceRule
              | scheduledServiceRule
              | batchRule
              | setDate
              | setIF
    """
    if len(p[1]) > 0 and p[1][0] == 'ERROR':
        showError(p[1][1], p[1][2])
        p[0] = None
        p.parser.error = 1
    else:
        p[0] = p[1]


def p_statement_error(p):
    """
    statement : error SEMICOLON
    """
    showError("Bad statement", p.lineno(2))
    p[0] = None
    p.parser.error = 1


# -------------------- Define functions
def p_def(p):
    """
      defRule : RESERVED_FUNCTION funcName LPAREN RPAREN COLON funcExpr RESERVED_END_OF_FUNCTION
    """
    p[0] = ('DEF_FUNC', p[2], p[6])


def p_def_error(p):
    """
      defRule : RESERVED_FUNCTION error LPAREN RPAREN COLON funcExpr RESERVED_END_OF_FUNCTION
    """
    p[0] = ('ERROR', "Invalid function declaration", p.lineno(1))


def p_funcName(p):
    """
      funcName : STRING
    """
    p[0] = p[1]


def p_funcExpr(p):
    """
    funcExpr : unavailabilityRule
             | availabilityRule
             | serviceRule
             | scheduledServiceRule
    """
    p[0] = p[1]


# -------------------- Run functions
def p_funcRun(p):
    """
      funcRunRule : funcName LPAREN RPAREN SEMICOLON
    """
    p[0] = ('RUN_FUNC', p[1])


# -------------------- Unavailabilty
def p_Unavailability(p):
    """
      unavailabilityRule : RESERVED_SET RESERVED_UNAVAILABILITY COLON \
                           unavailAttrList SEMICOLON
    """
    p[0] = ('UNAV', p[4])


def p_Unavailability_error(p):
    """
      unavailabilityRule : RESERVED_SET RESERVED_UNAVAILABILITY COLON error SEMICOLON
    """
    p[0] = ('ERROR', "Wrong use of Unavailability", p.lineno(1))


def p_Unavailability_Attr_List(p):
    """
        unavailAttrList : unavailAttrEl
                      | unavailAttrEl COMMA unavailAttrList
    """
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[3]


def p_Unavailability_Attr_Element(p):
    """
        unavailAttrEl :  RESERVED_DATE COLON dateRule
                      |  RESERVED_REASON COLON sentenceWithQuotas
                      |  RESERVED_EMPLOYEE COLON sentenceWithQuotas
                      |  RESERVED_FOR_EMPLOYEES COLON STRING
    """
    p[0] = (p[1], p[3])


def p_dates(p):
    """
     dateRule : DATE RESERVED_TO DATE
     """
    start_date = datetime.fromisoformat(p[1])
    end_date = datetime.fromisoformat(p[3])
    p[0] = (start_date, end_date)


def p_date(p):
    """
     dateRule : DATE
     """
    my_date = datetime.fromisoformat(p[1])
    p[0] = (my_date, None)


# -------------------- Set employee
def p_set_employee(p):
    """
    setEmployee : RESERVED_EMPLOYEE COLON sentenceWithQuotas SEMICOLON
    """
    p[0] = ('SET_EMPL', p[3])


def p_set_employee_error(p):
    """
    setEmployee : RESERVED_EMPLOYEE COLON error SEMICOLON
    """
    p[0] = ('ERROR', "Wrong use of employee assignment", p.lineno(2))


# -------------------- Set date
def p_set_date(p):
    """
    setDate : RESERVED_DATE COLON DATE SEMICOLON
    """
    date_obj = datetime.fromisoformat(p[3])
    p[0] = ('SET_DATE', date_obj)


def p_set_date_error(p):
    """
    setDate : RESERVED_DATE COLON error SEMICOLON
    """
    p[0] = ('ERROR', "Wrong use of date assignment", p.lineno(2))


# -------------------- IF operator
def p_if_operator(p):
    """
    setIF : RESERVED_IF conditions COLON conditionResult
    """
    p[0] = ('IF', p[2], p[4])


def p_if_else_operator(p):
    """
    setIF : RESERVED_IF conditions COLON conditionResult \
            RESERVED_ELSE COLON conditionResult
    """
    p[0] = ('IF_ELSE', p[2], p[4], p[7])


def p_if_error(p):
    """
    setIF : RESERVED_IF error COLON conditionResult
    """
    p[0] = ('ERROR', "IF statement is incorrect", p.lineno(1))


def p_conditionResult(p):
    """
    conditionResult : unavailabilityRule
                    | availabilityRule
                    | serviceRule
                    | scheduledServiceRule
                    | setEmployee
                    | setDate
                    | queryRule
                    | funcRunRule
    """
    p[0] = p[1]


def p_conditions(p):
    """
        conditions : condition
                   | condition RESERVED_OR condition
                   | condition RESERVED_AND condition
    """
    if len(p) == 2:
        p[0] = p[1]
    else:
        p[0] = (p[2], p[1], p[3])


def p_condition(p):
    """
        condition : RESERVED_DATE EQUALS dayOfWeek
                  | RESERVED_EMPLOYEE EQUALS sentenceWithQuotas
    """
    p[0] = ('EQ', p[1], p[3])


# -------------------- Availability
def p_Availability(p):
    """
      availabilityRule : RESERVED_SET RESERVED_AVAILABILITY COLON \
                         availAttrList SEMICOLON
    """
    p[0] = ('AV', p[4])


def p_Availability_Attr_List(p):
    """
        availAttrList : availAttrEl
                      | availAttrEl COMMA availAttrList
    """
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[3]


def p_Availability_Attr_Element(p):
    """
        availAttrEl : RESERVED_DAYS COLON daysOfWeekRule
                    | RESERVED_HOURS COLON timeRule
                    | RESERVED_EMPLOYEE COLON sentenceWithQuotas
                    | RESERVED_FOR_EMPLOYEES COLON STRING
    """
    p[0] = (p[1], p[3])


def p_timeRange(p):
    """
      timeRule : TIME MINUS TIME
    """
    p[0] = (p[1], p[3])


def p_daysOfWeek(p):
    """
    daysOfWeekRule : dayOfWeek RESERVED_TO dayOfWeek
    """
    p[0] = (p[1], p[3])


def p_dayOfWeek(p):
    """
    dayOfWeek : RESERVED_SUNDAY
              | RESERVED_MONDAY
              | RESERVED_TUESDAY
              | RESERVED_WEDNESDAY
              | RESERVED_THURSDAY
              | RESERVED_FRIDAY
              | RESERVED_SATURDAY
    """
    p[0] = p[1]


def p_Availability_error(p):
    """
      availabilityRule : RESERVED_SET RESERVED_AVAILABILITY COLON error SEMICOLON
    """
    p[0] = ('ERROR', "Wrong use of Availability", p.lineno(1))


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


# def p_strWithQuotas(p):
#     """
#     strWithQuotas : QUOTE STRING QUOTE
#     """
#     p[0] = p[2]


def p_sentenceWithQuotas(p):
    """
    sentenceWithQuotas : QUOTE sentence QUOTE
    """
    p[0] = p[2]


# -------------------------- variables
def p_arrEls(p):
    """
    arrEl : QUOTE sentence QUOTE COMMA arrEl
    """
    p[0] = p[2] + ',' + p[5]


def p_arrEl(p):
    """
    arrEl : QUOTE sentence QUOTE
    """
    p[0] = p[2]


def p_arr(p):
    """
    arr : LSQRBRACE arrEl RSQRBRACE
    """
    p[0] = p[2].split(',')


def p_var(p):
    """
    var : STRING ASSIGN arr SEMICOLON
    """
    p[0] = ('VAR_ASSIGN', p[1], p[3])


# -------------------------- Query
def p_query(p):
    """
    queryRule : RESERVED_QUERY COLON queryAttrList SEMICOLON
    """
    p[0] = ('QUERY', p[3])


def p_Query_Attr_List(p):
    """
        queryAttrList : queryAttrEl
                      | queryAttrEl COMMA queryAttrList
    """
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[3]


def p_Query_Attr_Element(p):
    """
        queryAttrEl : RESERVED_TYPE COLON RESERVED_SERVICES
                    | RESERVED_PERIOD COLON dateRule
                    | RESERVED_FILTER COLON filterRule
    """
    p[0] = (p[1], p[3])


def p_Query_filter(p):
    """
        filterRule : RESERVED_TYPE EQUALS QUOTE sentence QUOTE
    """
    p[0] = (p[1], p[4])


def p_query_error(p):
    """
    queryRule : RESERVED_QUERY COLON error SEMICOLON
    """
    p[0] = ('ERROR', "Wrong use of query", p.lineno(1))


# ---------------- services
def p_Service(p):
    """
      serviceRule : RESERVED_SET RESERVED_SERVICE COLON \
                         serviceAttrList SEMICOLON
    """
    p[0] = ('SERVICE', p[4])


def p_Service_Attr_List(p):
    """
        serviceAttrList : serviceAttrEl
                        | serviceAttrEl COMMA serviceAttrList
    """
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[3]


def p_Service_Attr_Element(p):
    """
        serviceAttrEl : RESERVED_TYPE COLON sentenceWithQuotas
                      | RESERVED_DURATION COLON TIME_DURATION
                      | RESERVED_PRIORITY COLON priorityRule
                      | RESERVED_DESCRIPTION COLON sentenceWithQuotas
                      | RESERVED_STATUS COLON boolean
    """
    p[0] = (p[1], p[3])


def p_priority(p):
    """
    priorityRule : RESERVED_HIGH
                 | RESERVED_MEDIUM
                 | RESERVED_LOW
    """
    p[0] = p[1]


def p_Service_error(p):
    """
      serviceRule : RESERVED_SET RESERVED_SERVICE COLON error SEMICOLON
    """
    p[0] = ('ERROR', "Wrong use of Service", p.lineno(1))


def p_true_false(p):
    """
        boolean : RESERVED_TRUE
                | RESERVED_FALSE
    """
    p[0] = p[1]


# ------------------------------ Scheduled service
def p_Sheduled_Service(p):
    """
      scheduledServiceRule : RESERVED_SET RESERVED_SCHEDULED_SERVICE COLON \
                             scheduledServiceAttrList SEMICOLON
    """
    p[0] = ('SCH_SERVICE', p[4])


def p_Sheduled_Service_error(p):
    """
      scheduledServiceRule : RESERVED_SET RESERVED_SCHEDULED_SERVICE COLON error SEMICOLON
    """
    p[0] = ('ERROR', "Wrong use of Scheduled Service", p.lineno(1))


def p_Sheduled_Service_Attr_List(p):
    """
        scheduledServiceAttrList : scheduledServiceAttrEl
                                | scheduledServiceAttrEl COMMA scheduledServiceAttrList
    """
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[3]


def p_Sheduled_Service_Attr_Element(p):
    """
        scheduledServiceAttrEl  : RESERVED_SERVICE COLON sentenceWithQuotas
                                | RESERVED_CLIENT COLON sentenceWithQuotas
                                | RESERVED_DATE COLON DATE
                                | RESERVED_DESCRIPTION COLON sentenceWithQuotas
                                | RESERVED_EMPLOYEE COLON sentenceWithQuotas
                                | RESERVED_STATUS COLON scheduledServiceStatus
                                | RESERVED_MATERIAL COLON sentenceWithQuotas
    """
    p[0] = (p[1], p[3])


def p_sheduled_service_status(p):
    """
    scheduledServiceStatus : RESERVED_SCHEDULED
                           | RESERVED_PROCESSING
                           | RESERVED_COMPLETED
    """
    p[0] = p[1]


# ------------------------------ batch
def p_batch(p):
    """
      batchRule : RESERVED_BATCH COLON batchStatements RESERVED_END_BATCH
    """
    p[0] = ('BATCH', p[3])


def p_batch_error(p):
    """
      batchRule : RESERVED_BATCH COLON error RESERVED_END_BATCH
    """
    p[0] = ('ERROR', "Wrong use of batch", p.lineno(1))


def p_batch_statements(p):
    """
        batchStatements : batchStatement
                        | batchStatements batchStatement
    """
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[2]]


def p_batch_statement(p):
    """
    batchStatement  : availabilityRule
                    | unavailabilityRule
                    | funcRunRule
                    | queryRule
                    | setEmployee
                    | var
                    | serviceRule
                    | scheduledServiceRule
                    | setDate
                    | setIF
    """
    p[0] = p[1]


# ------------------------------ error

def p_error(p):
    if not p:
        showError("Unexpected end of file")


# -------------------------------------------------------------------------------------
# --------------------- I N T E R P R E T E R -------------------------------------
# -------------------------------------------------------------------------------------
def ineterpreter(prog):
    #    prg_len = len(prog)
    pos = 0
    while pos < len(prog):
        instr = prog[pos]

        oper = instr[0]

        if oper == 'AV':
            if run_availability(instr[1]) == -1:
                return
        elif oper == 'UNAV':
            if run_unavailability(instr[1]) == -1:
                return
        elif oper == 'SET_EMPL':
            if run_set_employee(instr[1]) == -1:
                return
        elif oper == 'DEF_FUNC':
            if run_def_func((instr[1], instr[2])) == -1:
                return
        elif oper == 'RUN_FUNC':
            if run_func(instr[1]) == -1:
                return
        elif oper == 'QUERY':
            if run_query(instr[1]) == -1:
                return
        elif oper == 'VAR_ASSIGN':
            if run_var_assign((instr[1], instr[2])) == -1:
                return
        elif oper == 'SERVICE':
            if run_service(instr[1]) == -1:
                return
        elif oper == 'SCH_SERVICE':
            if run_scheduled_service(instr[1]) == -1:
                return
        elif oper == 'BATCH':
            ineterpreter(instr[1])
        elif oper == 'SET_DATE':
            run_set_date(instr[1])
        elif oper == 'IF':
            if run_if(instr[1], instr[2], None) == -1:
                return
        elif oper == 'IF_ELSE':
            if run_if(instr[1], instr[2], instr[3]) == -1:
                return

        pos += 1


# ----------- Run if
def run_if(condition, true_statement, else_statement):
    if run_condition(condition[0], condition[1], condition[2]):
        ineterpreter([true_statement])
    else:
        if else_statement:
            ineterpreter([else_statement])


def run_condition(operation, operand1, operand2):
    if operation == 'EQ':
        if operand1 == 'date':
            if dateGlobal:
                dayOfWeek = dateGlobal.strftime('%A').lower()
                return True if operand2 == dayOfWeek else False
            else:
                return False
        elif operand1 == 'employee':
            return True if operand2 == employeeGlobal else False
        else:
            showError("Wrong condition")
            return -1
    elif operation == 'or':
        return True if operand_prepare(operand1) or operand_prepare(operand2) else False
    elif operation == 'and':
        return True if operand_prepare(operand1) and operand_prepare(operand2) else False
    else:
        showError("Operation is not supported")
        return -1


def operand_prepare(operand):
    # if type(operand).__name__ == 'tuple':
    return run_condition(operand[0], operand[1], operand[2])
    # else:
    #     return operand


# ---------- Run set date
def run_set_date(parm):
    global dateGlobal
    dateGlobal = parm


# ---------- Run scheduled service
def run_scheduled_service(parm):
    # print (str(parm) + " scheduled service code work")
    service = ''
    client = ''
    date = ''
    employee = ''
    material = ''
    status = ''
    description = ''

    for el in parm:
        if el[0] == 'service':
            service = el[1]
        elif el[0] == 'client':
            client = el[1]
        elif el[0] == 'status':
            status = el[1]
        elif el[0] == 'material':
            material = el[1]
        elif el[0] == 'date':
            date = el[1]
        elif el[0] == 'description':
            description = el[1]
        elif el[0] == 'employee':
            employee = el[1]

    if not date:
        date = dateGlobal

    if not date:
        showError("Date must be specified")
        return -1

    if not status:
        showError("Status must be specified")
        return -1

    serviceId = -1
    if service:
        serviceId = find_service(service)
        if serviceId == -1:
            showError("Service " + str(service) + " cannot be found")
            return -1
    else:
        showError("Service must be specified")
        return -1

    clientId = -1
    if client:
        clientId = find_client(client)
        if clientId == -1:
            showError("Client " + str(client) + " cannot be found")
            return -1
    else:
        showError("Client must be specified")
        return -1

    if not employee:
        employee = employeeGlobal

    employeeId = find_employee(employee)

    if employeeId == -1:
        showError("Employee " + employee + "cannot be found")
        return -1

    if check_employee_availability(employeeId, date) == -1:
        showError("Employee " + employee + " is not available on " + str(date))
        return -1

    updateFieldList = "EmployeeService = %s, CustomerID = %s, ServiceID = %s, Date=%s, Status=%s"
    updateValues = (employeeId, clientId, serviceId, date, status)
    if description:
        updateFieldList += ",Description=%s"
        updateValues = updateValues + (description,)

    if material:
        updateFieldList += ",Material=%s"
        updateValues = updateValues + (material,)

    sheduledServiceId = find_sheduled_service(employeeId, clientId, serviceId, date)

    try:
        myCursor = mydb.cursor()

        if sheduledServiceId != -1:
            sqlstmt = """
                    UPDATE scheduleservice
                    SET """ + updateFieldList + """ WHERE ServiceScheduleID = %s;"""

            values = updateValues + (sheduledServiceId,)
        else:
            sqlstmt = """
                INSERT INTO scheduleservice
                (EmployeeService,CustomerID,ServiceID,Date,Status,Description,Material)
                VALUES
                (%s,%s,%s,%s,%s,%s,%s);
                        """
            values = (employeeId, clientId, serviceId, date, status, description, material)

        myCursor.execute(sqlstmt, values)
        mydb.commit()

        print("Scheduled service created or updated")

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


def find_sheduled_service(emplId, clientId, serviceId, date):
    try:
        myCursor = mydb.cursor()

        query = """
                Select ServiceScheduleID from scheduleservice  
                where EmployeeService = %s and CustomerID = %s and ServiceID = %s and Date=%s
                """

        myCursor.execute(query, (emplId, clientId, serviceId, date))
        myResult = myCursor.fetchone()

        if myResult:
            return myResult[0]
        else:
            return -1

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


def check_employee_availability(emplId, date):
    if find_avialability(emplId, 1) == -1:
        return -1

    availRecord = find_avialability_record(emplId, 1)
    availDays = eval(availRecord[8])

    date_obj = datetime.fromisoformat(date)
    dayOfWeek = date_obj.strftime('%A').lower()

    if dayOfWeek not in availDays:
        return -1

    if find_avialability(emplId, 0) != -1:
        unavailRecord = find_avialability_record(emplId, 0)
        dateFrom = unavailRecord[1]
        dateTo = unavailRecord[2]

        if date_obj.date() >= dateFrom and date_obj.date() <= dateTo:
            return -1


def find_client(parm):
    try:
        myCursor = mydb.cursor()

        query = """
                Select customerId from customer c 
                inner join user u on u.UserID = c.UserID
                where u.Name = %s
                """

        myCursor.execute(query, (parm,))
        myResult = myCursor.fetchone()

        if myResult:
            return myResult[0]
        else:
            return -1

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


def find_avialability_record(emplId, isAvailable):
    try:

        myCursor = mydb.cursor()

        query = """
                SELECT 
                    AvalailabilityID,SDate,EDate,STime,ETime,Reason,IsAvailable,UserID,DaysOfWeek
                FROM availability 
                WHERE UserId = %s AND IsAvailable = %s
                """

        myCursor.execute(query, (emplId, isAvailable))

        myResult = myCursor.fetchone()

        if myResult:
            return myResult
        else:
            return -1

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


# ---------- Run Service
def run_service(parm):
    # print (str(parm) + " service code work")
    serviceType = ''
    serviceDuration = ''
    serviceStatus = 0
    serviceStatusSpecified = False
    servicePriority = ''
    serviceDescription = ''

    for el in parm:
        if el[0] == 'type':
            serviceType = el[1]
        elif el[0] == 'duration':
            serviceDuration = el[1]
        elif el[0] == 'status':
            serviceStatus = 1 if el[1] == 'true' else 0
            serviceStatusSpecified = True
        elif el[0] == 'priority':
            servicePriority = el[1]
        elif el[0] == 'description':
            serviceDescription = el[1]

    if not serviceType:
        showError("Service type must be specified")
        return -1

    if not serviceStatusSpecified:
        showError("Service status must be specified")
        return -1

    if not servicePriority:
        showError("Service priority must be specified")
        return -1

    if not serviceDuration:
        showError("Service duration must be specified")
        return -1

    updateFieldList = "Status=%s, Duration=%s, Priority=%s"
    updateValues = (serviceStatus, serviceDuration, servicePriority)
    if serviceDescription:
        updateFieldList += ",Description=%s"
        updateValues = updateValues + (serviceDescription,)

    serviceId = find_service(serviceType)

    try:
        myCursor = mydb.cursor()

        if serviceId != -1:
            sqlstmt = """
                    UPDATE service
                    SET """ + updateFieldList + """ WHERE ServiceID = %s;"""

            values = updateValues + (serviceId,)
        else:
            sqlstmt = """
                INSERT INTO service
                (Name,Status,Duration,Priority,Description)
                VALUES
                (%s,%s,%s,%s,%s);
                        """
            values = (serviceType, serviceStatus, serviceDuration, servicePriority, serviceDescription)

        myCursor.execute(sqlstmt, values)
        mydb.commit()

        print("Service created or updated")

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


def find_service(serviceType):
    try:

        myCursor = mydb.cursor()

        query = """
                SELECT ServiceID FROM service 
                WHERE Name = %s
                """

        myCursor.execute(query, (serviceType,))

        myResult = myCursor.fetchone()

        if myResult:
            return myResult[0]
        else:
            return -1

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


# ---------- Run availabilty
def run_availability(parm):
    # print (str(parm) + " availability code work")
    daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    dayFrom = ''
    dayTo = ''
    employee = ''
    startTime = '00:00'
    endTime = '00:00'
    bulkVar = ''

    for el in parm:
        if el[0] == 'days':
            dayFrom = el[1][0]
            dayTo = el[1][1]
        elif el[0] == 'employee':
            employee = el[1]
        elif el[0] == 'hours':
            startTime = el[1][0]
            endTime = el[1][1]
        elif el[0] == 'for_employees':
            bulkVar = el[1]

    if bulkVar:
        employee_list = varDict.get(bulkVar)
        cleared_details = [item for item in parm if item[0] != 'for_employees' and item[0] != 'employee']
        for empl in employee_list:
            updated_details = cleared_details
            updated_details.append(('employee', empl))
            run_availability(updated_details)
        return

    if dayFrom and dayTo:
        start_index = daysOfWeek.index(dayFrom)
        end_index = daysOfWeek.index(dayTo)

        if start_index <= end_index:
            availableDays = daysOfWeek[start_index:end_index + 1]
        else:
            availableDays = daysOfWeek[start_index:] + daysOfWeek[:end_index + 1]

    if not employee:
        employee = employeeGlobal

    employeeId = find_employee(employee)

    if employeeId == -1:
        showError("Employee " + employee + "cannot be found")
        return -1

    availabilityId = find_avialability(employeeId, 1)

    try:
        myCursor = mydb.cursor()

        if availabilityId != -1:
            sqlstmt = """
                    UPDATE availability
                    SET
                        STime = %s,
                        ETime = %s,
                        DaysOfWeek = %s
                    WHERE AvalailabilityID = %s;
                        """
            values = (startTime, endTime, str(availableDays), availabilityId)
        else:
            sqlstmt = """
                INSERT INTO availability
                (STime,ETime,IsAvailable,UserID,DaysOfWeek)
                VALUES
                (%s,%s,%s,%s,%s);
                        """
            values = (startTime, endTime, 1, employeeId, str(availableDays))

        myCursor.execute(sqlstmt, values)
        mydb.commit()

        print("Availability created or updated")

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


def find_avialability(emplId, isAvailable):
    try:

        myCursor = mydb.cursor()

        query = """
                SELECT AvalailabilityID FROM availability 
                WHERE UserId = %s AND IsAvailable = %s
                """

        myCursor.execute(query, (emplId, isAvailable))

        myResult = myCursor.fetchone()

        if myResult:
            return myResult[0]
        else:
            return -1

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


def find_employee(emplId):
    try:

        myCursor = mydb.cursor()

        query = """
                SELECT UserID FROM user u
                WHERE Name = %s AND PermissionID = %s
                """

        myCursor.execute(query, (emplId, "EMPLOYEE_SERVICES"))

        myResult = myCursor.fetchone()

        if myResult:
            return myResult[0]
        else:
            return -1

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


# ---------- Run unavailability
def run_unavailability(parm):
    dateFrom = ''
    dateTo = ''
    employee = ''
    reason = ''
    bulkVar = ''

    for el in parm:
        if el[0] == 'date':
            dateFrom = el[1][0]
            dateTo = el[1][1]
        elif el[0] == 'employee':
            employee = el[1]
        elif el[0] == 'reason':
            reason = el[1]
        elif el[0] == 'for_employees':
            bulkVar = el[1]

    if bulkVar:
        employee_list = varDict.get(bulkVar)
        cleared_details = [item for item in parm if item[0] != 'for_employees' and item[0] != 'employee']
        for empl in employee_list:
            updated_details = cleared_details
            updated_details.append(('employee', empl))
            run_unavailability(updated_details)
        return

    if not employee:
        employee = employeeGlobal

    employeeId = find_employee(employee)

    if employeeId == -1:
        showError("Employee " + employee + "cannot be found")
        return -1

    availabilityId = find_avialability(employeeId, 0)

    try:
        myCursor = mydb.cursor()

        if availabilityId != -1:
            sqlstmt = """
                    UPDATE availability
                    SET
                        SDate = %s,
                        EDate = %s,
                        Reason = %s
                    WHERE AvalailabilityID = %s;
                        """
            values = (dateFrom, dateTo, reason, availabilityId)
        else:
            sqlstmt = """
                INSERT INTO availability
                (SDate,EDate,Reason,IsAvailable,UserID)
                VALUES
                (%s,%s,%s,%s,%s);
                        """
            values = (dateFrom, dateTo, reason, 0, employeeId)

        myCursor.execute(sqlstmt, values)
        mydb.commit()

        print("Unavailability created or updated")

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


# ---------- Run eployee assignment
def run_set_employee(parm):
    global employeeGlobal
    employeeGlobal = parm


# ---------- Run definition of function
def run_def_func(parm):
    fname = parm[0]
    fexpr = parm[1]

    def run_func(funcName=fname, expr=fexpr):
        func_code_run(funcName, expr)

    functions[fname] = run_func


def func_code_run(funcName, expr):
    # print("run "+str(expr)+" function code")
    if expr != None:
        match expr[0]:
            case 'UNAV':
                if run_unavailability(expr[1]) == -1:
                    return -1
            case 'AV':
                if run_availability(expr[1]) == -1:
                    return -1
            case 'SERVICE':
                if run_service(expr[1]) == -1:
                    return -1
            case 'SCH_SERVICE':
                if run_scheduled_service(expr[1]) == -1:
                    return -1
            case _:
                showError("Operation " + str(expr[0]) + " is not supported in function " + str(funcName))
                return -1


# ----------- Run calling of function
def run_func(parm):
    fname = parm
    if fname in functions:
        functions[fname]()
    else:
        showError("Function " + str(fname) + " does not exist")
        return -1


# ----------- Run query
def run_query(parm):
    try:
        dateFilterExists = False
        serviceNameFilter = ''
        start_date = ''
        end_date = ''
        for el in parm:
            if el[0] == 'type' and el[1] != 'services':
                showError("Query type \"" + el[1] + "\" is not supported")
                return False
            elif el[0] == 'period':
                start_date, end_date = el[1]
                if not end_date:
                    end_date = start_date
            elif el[0] == 'filter':
                if el[1][0] == 'type':
                    serviceNameFilter = el[1][1]

        if start_date != None and end_date != None:
            whereClause = " where date >= '" + str(start_date) + "' AND date <= '" + str(end_date) + "'"
            dateFilterExists = True

        if serviceNameFilter:
            if dateFilterExists:
                whereClause += " and "
            else:
                whereClause = " where "
            whereClause += "service.Name = '" + str(serviceNameFilter) + "';"

        myCursor = mydb.cursor(dictionary=True)

        myCursor.execute("""SELECT s.*, u.Name as customer_name , service.Name As service_name
                            FROM scheduleservice s
                            inner join Customer c on c.CustomerID = s.CustomerID
                            inner join User u on u.UserID = c.UserID
                            inner join service on service.ServiceID = s.ServiceID""" + whereClause)

        myResult = myCursor.fetchall()

        if (myResult):
            print("Query result:")
            for row in myResult:
                print("- " + str(row['Date']) + " : " + str(row['service_name']) + " for " + str(row['customer_name']))
        else:
            print('No result')

    except mysql.connector.Error as err:
        showError("SQL Error:" + err)
        return -1


# ----------- Assign variables
def run_var_assign(parm):
    varName = parm[0]
    varValue = parm[1]
    varDict[varName] = varValue


lexer = lex.lex()
parser = yacc.yacc()



instr = parser.parse(sys.argv[1])

# print(instr)

if parser.errorok == True:
    # print("Run interpreter")
    ineterpreter(instr)







