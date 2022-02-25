grammar BabyJulia;

// Parser rules
exprSequence: (expr (NEWLINE)* | NEWLINE)* EOF;
expr:
	name = NAME ASSIGN value = atom	# VarDeclaration
	| value = atom					# Literal
	| name = NAME					# Name
	| struct = structDefinition		# Struct
	| structAssg = structAssignment # StructAssg;

funcDefinition:
	'function' name = NAME params = parameters NEWLINE bod = body 'end';
parameters: '(' (param = NAME)? ')';
body: exprSequence 'return' expr;

structAssignment:
	varName = (NAME | IDENTIFIER) ASSIGN structName = (NAME | IDENTIFIER) params = structParams;
structParams: '(' (param = atom (',')? )* ')';

structDefinition:
	('mutable')? 'struct' name = parametrizedIdentifier NEWLINE 
	extTypedIdent = extendedTypedIdentifier
	'end';

extendedTypedIdentifier:
	(typedIdent = typedIdentifier NEWLINE)*;

typedIdentifier:
	ident1 = parametrizedIdentifier
	| (ident1 = parametrizedIdentifier PARAMETRIZED_CHOICE ident2 = parametrizedIdentifier);

parametrizedIdentifier:
	(NAME | IDENTIFIER)
	| (NAME | IDENTIFIER) '{' modifTypedIdent = modifiedTypedIdentifier '}';

modifiedTypedIdentifier:
	typedIdent = typedIdentifier
	| (typedIdent = typedIdentifier ',' modifiedTypedIdentifier);

PARAMETRIZED_CHOICE: '::' | '<:';

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
IDENTIFIER: [a-zA-Z_][a-zA-Z0-9_]*;
WHITESPACE: [ \r\t]+ -> skip;
NEWLINE: ('\r'? '\n' | '\r')+;
ASSIGN: '=';
TERMINATOR: NEWLINE | ';';

