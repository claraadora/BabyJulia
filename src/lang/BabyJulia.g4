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
	| atom			# Literal
	| identifier	# Name;

simpleExpr: fldAccess | atom | identifier;

// 1. Variable Definition
varDef:
	name = NAME (INSTANCE_OF type = NAME)? ASSIGN simpleExpr;

// 2. Function Definition
funcDef:
	'function' funcName = NAME '(' parameters? ')' (
		INSTANCE_OF returnType = NAME
	)? NEWLINE body? returnStmt NEWLINE 'end';
parameters: parameter (',' parameter)*;
parameter: name = NAME (INSTANCE_OF type = NAME)?;
body: exprSequence;
returnStmt: 'return' simpleExpr?;

// 3. Function Application
arguments: argument (',' argument)*;
argument: simpleExpr;
funcApp: fname = NAME '(' arguments? ')';

// 4. Struct Definition
structDef:
	'struct' structName = NAME (SUBTYPE_OF supertype = NAME)? NEWLINE (
		varName = NAME (INSTANCE_OF type = NAME)? NEWLINE
	)* 'end';

// 5. Abstract Type Declaration
absTypeDeclr:
	'abstract' 'type' type = NAME (SUBTYPE_OF supertype = NAME)? 'end';

// 6. Field Access
fldAccess: objName = NAME '.' fieldName = NAME;

// 7. Identifier
identifier: NAME;

// 8. Atom 
atom: NUMBER | STRING | BOOL;

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

