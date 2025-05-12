import ply.yacc as yacc
import ply.lex as lex


tokens = ("STRING", "RBRACE", "LBRACE", "COMMA", "LPAREN", "RPAREN", "QUOTE", "SEMICOLON", "EQUALS", "AND",
          "OR", "COLON", "MINUS", "ASSIGN", "DATE", "TIME","RESERVED_AVAILABILITY","RESERVED_DAYS","RESERVED_HOURS",
          "RESERVED_SERVICE", "RESERVED_NAME", "RESERVED_DESCRIPTION", "RESERVED_STATUS", "RESERVED_EMPLOYEE",
          "RESERVED_CLIENT", "RESERVED_UNAVAILABILITY", "RESERVED_SET", "RESERVED_IF", "RESERVED_REASON",
          "RESERVED_MATERIAL", "RESERVED_FUNCTION", "RESERVED_DATE", "RESERVED_TO"
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
    "date": "RESERVED_DATE",
    "to": "RESERVED_TO"
}



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
    r'[0-2][0-9][0-9][0-9]-(0[1-9]|1[1-9])-(0[1-9]|[1-2][0-9]|3[0-1])'
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

lexer = lex.lex()

test_string = """
def morning_shift() {
    set availability:
        days: Monday to Friday;
        hours: 08:00-12:00;
}

"""


lexer.input(test_string)

while True:
    tok = lexer.token()
    if not tok:
        break  # No more input
    print(tok.type, tok.value, tok.lineno, tok.lexpos)
