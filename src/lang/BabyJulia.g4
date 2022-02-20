grammar BabyJulia;

// Parser rules 
exprSequence: (expr (NEWLINE)* | NEWLINE)* EOF;
expr:
	name = NAME ASSIGN value = atom	# VarDeclaration
	| value = atom					# Literal
	| name = NAME					# Name;

funcDefinition:
	'function' name = NAME params = parameters NEWLINE bod = body 'end';
parameters: '(' (param = NAME)? ')';
body: exprSequence 'return' expr;

atom: NUMBER | STRING | BOOL;
// Lexer rules literal
NUMBER: [0-9]+;
STRING: '"' ( ~["\n\r] | '\\"')* '"';
BOOL: 'true' | 'false';

// operations
BIN_OP: MUL | DIV | ADD | SUB;
MUL: '*';
DIV: '/';
ADD: '+';
SUB: '-';

// others
NAME: [a-zA-Z_]+;
WHITESPACE: [ \r\t]+ -> skip;
NEWLINE: ('\r'? '\n' | '\r')+;
ASSIGN: '=';

