import { EnvStack } from "../environment/environment";

export type Node =
  | Program
  | ExpressionSequence
  | Expression
  | Parameter
  | StructField
  | ReturnStatement
  | Block
  | ForLoop
  | void;

// Commons
export type Primitive = number | boolean | string;
export type Value = Primitive | Object | Array<Value>;

export interface Program {
  type: "Program";
  expressions: ExpressionSequence;
}
export interface ExpressionSequence {
  type: "ExpressionSequence";
  expressions: Array<Expression>;
}

export interface Block {
  type: "Block";
  node: ExpressionSequence | ForLoop;
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
  | IndexAccess
  | ForLoop;

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
  body: Block;
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
  value: Value | Array<Value> | null | Function;
  type: string;
}

export interface FuncValAndType {
  value: Block | null | Function;
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

export interface ForLoop {
  type: "ForLoop";
  name: string;
  start_idx: Expression;
  end_idx: Expression;
  body: ExpressionSequence;
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

export const is_for_loop = (node: Node): node is ForLoop =>
  node?.type === "ForLoop";

export const is_declaration = (
  node: Node
): node is VariableDefinition | FunctionDefinition | StructDefinition =>
  is_variable_definition(node) ||
  is_function_definition(node) ||
  is_struct_definition(node);

export const is_number = (value: any): value is number =>
  typeof value === typeof 1;

export const is_func_val_and_type = (value: any): value is FuncValAndType =>
  typeof value === typeof {} &&
  "value" in value &&
  "param_types" in value &&
  "param_names" in value &&
  "return_type" in value &&
  "env_stack" in value;

export const is_var_val_and_type = (value: any): value is VarValAndType =>
  typeof value === typeof {} && "value" in value && "type" in value;

export const is_string = (value: any): value is string =>
  typeof value === typeof "string";
