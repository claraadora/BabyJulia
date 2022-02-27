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

// 1. Variable Definition
varDef: name = NAME (INSTANCE_OF type = NAME)? ASSIGN expr;

// 2. Function Definition
funcDef:
	'function' NAME '(' parameters? ')' (
		INSTANCE_OF returnType = NAME
	)? NEWLINE body? returnStmt 'end';
parameters: parameter (',' parameter)*;
parameter: name = NAME (INSTANCE_OF type = NAME)?;
body: exprSequence;
returnStmt: 'return' fldAccess | atom | identifier;

// 3. Function Application
arguments: argument (',' argument)*;
argument: fldAccess | atom | identifier;
funcApp: NAME '(' arguments? ')';

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

// 7. Name
identifier: NAME;

// 8. Literal
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
NAME: [a-zA-Z_]+;
WHITESPACE: [ \r\t]+ -> skip;
NEWLINE: ('\r'? '\n' | '\r')+;
ASSIGN: '=';

// types
INSTANCE_OF: '::';
SUBTYPE_OF: '<:';

