export type Node = Program | ExpressionSequence | Expression | Parameter | void;

// Commons
export interface Program {
  type: "Program";
  expressions: ExpressionSequence;
}
export interface ExpressionSequence {
  type: "ExpressionSequence";
  expressions: Array<Expression>;
}

export type Expression =
  | VariableDefinition
  | FunctionDefinition
  | FunctionApplication
  | FieldAccess
  | AbstractTypeDeclaration
  | Literal
  | Name;

export type SimpleExpression = FieldAccess | Literal | Name;

export interface Literal {
  type: "Literal";
  value: string;
}

export interface Name {
  type: "Name";
  name: string;
}

export interface FieldAccess {
  type: "FieldAccess";
  objName: string;
  fieldName: string;
}

// Variable Definition
export interface VariableDefinition {
  type: "VariableDefinition";
  name: string;
  expr: Node; // Simple expression.
  atype: string | null;
}

// Function Definition
export interface FunctionDefinition {
  type: "FunctionDefinition";
  name: string;
  params: Parameter[];
  body: ExpressionSequence | null;
  return_stmt: SimpleExpression | null;
}

export interface Parameter {
  type: "Parameter";
  name: string;
  atype: string | null;
}

// Function Application
export interface FunctionApplication {
  type: "FunctionApplication";
  name: string;
  args: SimpleExpression[];
}

// Struct

// Abstract Type
export interface AbstractTypeDeclaration {
  type: "AbstractTypeDeclaration";
  name: string;
  super_type_name?: string;
}
