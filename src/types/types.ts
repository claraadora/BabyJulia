export type Node =
  | Program
  | ExpressionSequence
  | Expression
  | Parameter
  | StructField
  | ReturnStatement
  | void;

// Commons
export type Primitive = number | boolean | string;

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
  | StructDefinition
  | StructField
  | AbstractTypeDeclaration
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | Name;

export interface NumberLiteral {
  type: "NumberLiteral";
  value: string;
}

export interface StringLiteral {
  type: "StringLiteral";
  value: string;
}

export interface BooleanLiteral {
  type: "BooleanLiteral";
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
  expr: Expression;
  atype: string | null;
}

// Function Definition
export interface FunctionDefinition {
  type: "FunctionDefinition";
  name: string;
  params: Parameter[];
  body: ExpressionSequence;
  return_type: string | null;
}

export interface Parameter {
  type: "Parameter";
  name: string;
  atype: string | null;
}

export interface ReturnStatement {
  type: "ReturnStatement";
  expr: Expression | null;
}

export type EvaluatedReturnStatement = [string, any];
// Function Application
export interface FunctionApplication {
  type: "FunctionApplication";
  name: string;
  args: Expression[];
}

// Struct
export interface StructDefinition {
  type: "StructDefinition";
  struct_name: string;
  super_type_name: string | null;
  fields: StructField[];
}

export interface StructField {
  type: "StructField";
  name: string;
  atype: string | null;
}

// Abstract Type
export interface AbstractTypeDeclaration {
  type: "AbstractTypeDeclaration";
  name: string;
  super_type_name: string | null;
}

export interface Environment {
  [name: string]: ValAndType[];
}

export type ValAndType = VarValAndType | FuncValAndType;

export interface VarValAndType {
  value: Primitive | Object;
  type: string;
}

export interface FuncValAndType {
  value: ExpressionSequence | null;
  type: {
    param_types: string[];
    return_type: string | null;
  };
}
