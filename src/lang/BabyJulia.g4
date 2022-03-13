grammar BabyJulia;

// Parser rules
program: exprSequence EOF;
exprSequence: (expr (NEWLINE)* | NEWLINE)*;
expr:
	varDef			# VarDefinition
	| funcDef		# FuncDefinition
	| funcApp		# FuncApplication
	| structDef		# StructDefinition
	| fldAccess		# FieldAccess
	| absTypeDeclr	# AbstractTypeDeclaration
	| identifier	# Name
	| returnStmt	# ReturnStatement
	| printExpr		# PrintExpression
	| STRING		# String
	| BOOL			# Boolean
	| binaryExpr	# BinaryExpression;

// Binary Expression
binaryExpr:
	NUMBER													# Number
	| '(' inner = binaryExpr ')'							# Parentheses
	| left = binaryExpr operator = MUL right = binaryExpr	# Multiplication
	| left = binaryExpr operator = POW right = binaryExpr	# Power
	| left = binaryExpr operator = DIV right = binaryExpr   # Division
	| left = binaryExpr operator = ADD right = binaryExpr   # Addition
	| left = binaryExpr operator = SUB right = binaryExpr   # Subtraction
;

// 1. Variable Definition
varDef: name = NAME (INSTANCE_OF type = NAME)? ASSIGN expr;

// 2. Function Definition
funcDef:
	'function' funcName = NAME '(' parameters? ')' (
		INSTANCE_OF returnType = NAME
	)? NEWLINE body NEWLINE 'end';
parameters: parameter (',' parameter)*;
parameter: name = NAME (INSTANCE_OF type = NAME)?;
body: exprSequence;
returnStmt: 'return' expr?;

// 3. Function Application
arguments: argument (',' argument)*;
argument: expr;
funcApp: fname = NAME '(' arguments? ')';

// 4. Struct Definition
structDef:
	'struct' structName = NAME (SUBTYPE_OF supertype = NAME)? NEWLINE structFields? 'end';

structFields: (structField)*;

structField: varName = NAME (INSTANCE_OF type = NAME)? NEWLINE;

// 5. Abstract Type Declaration
absTypeDeclr:
	'abstract' 'type' type = NAME (SUBTYPE_OF supertype = NAME)? 'end';

// 6. Field Access
fldAccess: objName = NAME '.' fieldName = NAME;

// 7. Identifier
identifier: NAME;

// Print Expression
printExpr: 'println' '(' expr ')';

// Lexer rules
NUMBER: [0-9]+;
STRING: '"' ( ~["\n\r] | '\\"')* '"';
BOOL: 'true' | 'false';

// operations
BIN_OP: MUL | DIV | ADD | SUB;
MUL: '*';
DIV: '/';
ADD: '+';
SUB: '-';
POW: '^';

// others
NAME: ('a' ..'z' | 'A' ..'Z' | '_') (
		'a' ..'z'
		| 'A' ..'Z'
		| '_'
		| '0' ..'9'
	)*;
WHITESPACE: [ \r\t]+ -> skip;
NEWLINE: ('\r'? '\n' | '\r')+;
ASSIGN: '=';

// types
INSTANCE_OF: '::';
SUBTYPE_OF: '<:';


