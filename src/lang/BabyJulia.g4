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
	| idxAccess		# IndexAccess
	| absTypeDeclr	# AbstractTypeDeclaration
	| identifier	# Name
	| returnStmt	# ReturnStatement
	| printExpr		# PrintExpression
	| array			# Arr
	| forLoopStmt												# ForLoop
	| <assoc = right> left = expr operator = POW right = expr	# Power
	| left = expr operator = (MUL | DIV) right = expr			# MultDiv
	| left = expr operator = (ADD | SUB) right = expr			# AddSub
  | left = expr operator = (EQ | NEQ | GT | GTE | LT | LTE) right = expr			# RelationalExpression
  | predicate = expr '?' consequent = expr ':' alternative = expr # ConditionalExpression
	| NUMBER													# Number
	| '(' inner = expr ')'										# Parentheses
	| STRING													# String
	| BOOL														# Boolean;

// 1. Variable Definition
varDef: name = NAME (INSTANCE_OF type = NAME | UNION)? ASSIGN expr;

// 2. Function Definition
funcDef:
	'function' funcName = NAME '(' parameters? ')' (
		INSTANCE_OF returnType = NAME | UNION
	)? NEWLINE body NEWLINE 'end';
parameters: parameter (',' parameter)*;
parameter: name = NAME (INSTANCE_OF type = NAME | UNION)?;
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

structField: varName = NAME (INSTANCE_OF type = NAME | UNION)? NEWLINE;

// 5. Abstract Type Declaration
absTypeDeclr:
	'abstract' 'type' type = NAME (SUBTYPE_OF supertype = NAME)? 'end';

// 6. Field Access
fldAccess: objName = NAME '.' fieldName = NAME;

// 7. Identifier
identifier: NAME;

// Print Expression
printExpr: 'println' '(' expr ')';

// Array
array: oneDArr | twoDArr;

oneDArr: '[' cols ']';
cols: col ( ',' col)*;

twoDArr: '[' rows ']';
rows: (col+) ( ';' col+)*;
col: expr;

idxAccess:
	name = NAME '[' startIdx = expr (',' endIdx = expr)? ']';

forLoopStmt: 'for' name = NAME ( ('in' arr = expr) | 
	('in' | ASSIGN) (startIdx = expr ':' endIdx = expr) )
	NEWLINE body NEWLINE 'end';

// Lexer rules bin ops
POW: '^';
MUL: '*';
DIV: '/';
ADD: '+';
SUB: '-';
EQ: '==';
NEQ: '!=';
GT: '>';
GTE: '>=';
LT: '<';
LTE: '<=';

NUMBER: ([0-9]+) | ((([1-9]+) | [0]) '.' [0-9]+);
BOOL: 'true' | 'false';
STRING: '"' ( ~["\n\r] | '\\"')* '"';

NAME: ('a' ..'z' | 'A' ..'Z' | '_') (
		'a' ..'z'
		| 'A' ..'Z'
		| '_'
		| '0' ..'9'
	)*;

UNION: 'Union' '{' ( TYPES )? '}';
TYPES: (NAME) (',' NAME)*;

SKIP_: (WHITESPACE | COMMENT) -> skip;
WHITESPACE: [ \r\t]+;
COMMENT: '#' ~[\r\n\f]*;

NEWLINE: ('\r'? '\n' | '\r')+;
ASSIGN: '=';

// types
INSTANCE_OF: '::';
SUBTYPE_OF: '<:';
