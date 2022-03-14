import { EnvStack } from "../environment/environment";

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
export type Value = Primitive | Object;

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
  | AbstractTypeDeclaration
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | Name
  | PrintExpression
  | BinaryExpression
  | Arr
  | IndexAccess;

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
  name: string;
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

// Print stmt
export interface PrintExpression {
  type: "PrintExpression";
  expr: Expression;
}

export interface EnvFrame {
  [name: string]: ValAndType[];
}

export type ValAndType = VarValAndType | FuncValAndType;

export interface VarValAndType {
  value: Value | Array<Value> | null;
  type: string;
}

export interface FuncValAndType {
  value: ExpressionSequence | null | Function;
  param_types: string[];
  param_names: string[];
  return_type: string | null;
  env_stack: EnvStack;
}

export interface BinaryExpression {
  type: "BinaryExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface Arr {
  type: "Arr";
  value: Array<Expression> | Array<Array<Expression>>; 
}

export interface IndexAccess {
  type: "IndexAccess";
  name: string;
  start_idx: Expression;
  end_idx: Expression | null;
}

// Type guards
export const is_primitive = (value: any): boolean => Object(value) !== value;

export const is_variable_definition = (
  node: Node
): node is VariableDefinition => node?.type === "VariableDefinition";

export const is_function_definition = (
  node: Node
): node is FunctionDefinition => node?.type === "FunctionDefinition";

export const is_struct_definition = (node: Node): node is StructDefinition =>
  node?.type === "StructDefinition";

export const is_declaration = (
  node: Node
): node is VariableDefinition | FunctionDefinition | StructDefinition =>
  is_variable_definition(node) ||
  is_function_definition(node) ||
  is_struct_definition(node);

export const is_number = (value: any): value is number =>
  typeof value === typeof 1;
