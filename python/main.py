import ply.yacc as yacc
import ply.lex as lex

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
    "date": "RESERVED_DATE",
    "to": "RESERVED_TO",
    "query": "RESERVED_QUERY",
    "period": "RESERVED_PERIOD",
    "type": "RESERVED_TYPE",
    "filter": "RESERVED_FILTER"
}

tokens = ["STRING", "RBRACE", "LBRACE", "COMMA", "LPAREN", "RPAREN", "QUOTE", "SEMICOLON", "EQUALS", "AND",
          "OR", "COLON", "MINUS", "ASSIGN", "DATE", "TIME"] + list(reserved.values())

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
    statement : availabilityRule
              | unavailabilityRule
              | queryRule
    """


def p_Unavailability(p):
    """
      unavailabilityRule : RESERVED_SET RESERVED_UNAVAILABILITY COLON \
                         RESERVED_DATE COLON dateRule SEMICOLON \
                         RESERVED_REASON COLON sentence SEMICOLON
    """
    print('unavailability rule work')


def p_date(p):
    """
     dateRule : DATE RESERVED_TO DATE
             | DATE
     """


def p_Availability(p):
    """
      availabilityRule : RESERVED_SET RESERVED_AVAILABILITY COLON \
                         RESERVED_DAYS COLON daysRule SEMICOLON \
                         RESERVED_HOURS COLON TIME MINUS TIME SEMICOLON
    """
    print('availability rule work')


def p_days(p):
    """
    daysRule : STRING RESERVED_TO STRING
            | STRING
    """


def p_str(p):
    """
    sentence : STRING sentence
            | STRING
    """


def p_query(p):
    """
    queryRule : RESERVED_QUERY COLON \
            RESERVED_TYPE COLON sentence SEMICOLON \
            RESERVED_PERIOD COLON DATE RESERVED_TO DATE SEMICOLON \
            RESERVED_FILTER COLON RESERVED_TYPE EQUALS QUOTE sentence QUOTE SEMICOLON


    """
    print('query rule work')


lexer = lex.lex()
parser = yacc.yacc()

test_string = """set availability:
                days: Monday to Friday;
                hours: 08:00-12:00;



                set unavailability:
                date: 2025-04-10 to 2025-04-12;
                reason: vacation;


                query:
                type: services;
                period: 2025-01-01 to 2025-01-31;
                filter: type == "oil change";
                """

parser.parse(test_string)