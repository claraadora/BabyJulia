grammar BabyJulia;

// Parser rules
program: exprSequence EOF;
exprSequence: (expr (NEWLINE)* | NEWLINE)*;
expr:
	varDef																	# VarDefinition
	| funcDef																# FuncDefinition
	| funcApp																# FuncApplication
	| structDef																# StructDefinition
	| fldAccess																# FieldAccess
	| idxAccess																# IndexAccess
	| absTypeDeclr															# AbstractTypeDeclaration
	| identifier															# Name
	| returnStmt															# ReturnStatement
	| printExpr																# PrintExpression
	| array																	# Arr
  | arrElAssg                             # ArrElementAssignment
	| forLoopStmt															# ForLoop
	| <assoc = right> left = expr operator = POW right = expr				# Power
	| left = expr operator = (MUL | DIV) right = expr						# MultDiv
	| left = expr operator = (ADD | SUB) right = expr						# AddSub
	| left = expr operator = (EQ | NEQ | GT | GTE | LT | LTE) right = expr	# RelationalExpression
	| predicate = expr '?' consequent = expr ':' alternative = expr			# ConditionalExpression
	| NUMBER																# Number
	| '(' inner = expr ')'													# Parentheses
	| STRING																# String
	| BOOL																	# Boolean;

// 1. Variable Definition
varDef: name = NAME (INSTANCE_OF atype = type)? ASSIGN expr;

// 2. Function Definition
funcDef:
	'function' funcName = NAME '(' parameters? ')' (
		INSTANCE_OF returnType = type
	)? NEWLINE body NEWLINE 'end';
parameters: parameter (',' parameter)*;
parameter: name = NAME (INSTANCE_OF atype = type)?;
body: exprSequence;
returnStmt: 'return' expr?;

// 3. Function Application
arguments: argument (',' argument)*;
argument: expr;
funcApp: fname = NAME '(' arguments? ')';

// 4. Struct Definition
structDef:
	'struct' base_type = type (SUBTYPE_OF super_type = type)? NEWLINE structFields? 'end';

structFields: (structField)*;

structField: varName = NAME (INSTANCE_OF atype = type)? NEWLINE;

// 5. Abstract Type Declaration
absTypeDeclr:
	'abstract' 'type' base_type = type (
		SUBTYPE_OF super_type = type
	)? 'end';

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

arrElAssg: idxAccess ASSIGN expr;

idxAccess:
	name = NAME '[' startIdx = expr (',' endIdx = expr)? ']';

forLoopStmt:
	'for' name = NAME (
		('in' arr = expr)
		| ('in' | ASSIGN) (startIdx = expr ':' endIdx = expr)
	) NEWLINE body NEWLINE 'end';

// Union types
type: union | parametric | NAME;
union: 'Union' '{' (type (',' type)*)? '}';
parametric:
	base = NAME '{' (tv = NAME)? (SUBTYPE_OF tv_super = NAME)? '}';

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

SKIP_: (WHITESPACE | COMMENT) -> skip;
WHITESPACE: [ \r\t]+;
COMMENT: '#' ~[\r\n\f]*;

NEWLINE: ('\r'? '\n' | '\r')+;
ASSIGN: '=';

// types
INSTANCE_OF: '::';
SUBTYPE_OF: '<:';
