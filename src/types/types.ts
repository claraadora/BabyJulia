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
  ntype: "Program";
  expressions: ExpressionSequence;
}
export interface ExpressionSequence {
  ntype: "ExpressionSequence";
  expressions: Array<Expression>;
}

export interface Block {
  ntype: "Block";
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
  | ForLoop
  | RelationalExpression
  | ConditionalExpression
  | ArrElementAssignment;

export interface NumberLiteral {
  ntype: "NumberLiteral";
  value: string;
}

export interface StringLiteral {
  ntype: "StringLiteral";
  value: string;
}

export interface BooleanLiteral {
  ntype: "BooleanLiteral";
  value: string;
}

export interface Name {
  ntype: "Name";
  name: string;
}

export interface FieldAccess {
  ntype: "FieldAccess";
  objName: string;
  fieldName: string;
}

// Variable Definition
export interface VariableDefinition {
  ntype: "VariableDefinition";
  name: string;
  expr: Expression;
  atype: Type | null;
}

// Function Definition
export interface FunctionDefinition {
  ntype: "FunctionDefinition";
  name: string;
  params: Parameter[];
  body: ExpressionSequence;
  return_type: Type | null;
}

export interface Parameter {
  ntype: "Parameter";
  name: string;
  atype: Type | null;
}

export interface ReturnStatement {
  ntype: "ReturnStatement";
  expr: Expression | null;
}

export type EvaluatedReturnStatement = [string, any];
// Function Application
export interface FunctionApplication {
  ntype: "FunctionApplication";
  name: string;
  args: Expression[];
}

// Struct
export interface StructDefinition {
  ntype: "StructDefinition";
  type: Type;
  super_type: Type | null;
  fields: StructField[];
}

export interface StructField {
  ntype: "StructField";
  name: string;
  atype: Type | null;
}

// Abstract Type
export interface AbstractTypeDeclaration {
  ntype: "AbstractTypeDeclaration";
  type: Type;
  super_type: Type | null;
}

// Print stmt
export interface PrintExpression {
  ntype: "PrintExpression";
  expr: Expression;
}

export interface EnvFrame {
  [name: string]: ValAndType[];
}

export type ValAndType = VarValAndType | FuncValAndType;

export interface VarValAndType {
  value: Value | Array<Value> | null | Function;
  type: Type | null;
}

export interface FuncValAndType {
  value: ExpressionSequence | null | Function;
  param_types: Type[];
  param_names: string[];
  return_type: Type | null;
  env_stack: EnvStack;
}

export interface BinaryExpression {
  ntype: "BinaryExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface Arr {
  ntype: "Arr";
  value: Array<Expression> | Array<Array<Expression>>;
}

export interface IndexAccess {
  ntype: "IndexAccess";
  name: string;
  start_idx: Expression;
  end_idx: Expression | null;
}

export interface ForLoop {
  ntype: "ForLoop";
  name: string;
  start_idx: Expression;
  end_idx: Expression;
  body: ExpressionSequence;
}

export interface ConditionalExpression {
  ntype: "ConditionalExpression";
  predicate: Expression;
  consequent: Expression;
  alternative: Expression;
}

export interface RelationalExpression {
  ntype: "RelationalExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface ArrElementAssignment {
  ntype: "ArrElementAssignment";
  arrEl: IndexAccess;
  expr: Expression;
}

export type TypeVarInfo = {
  name: string | null;
  super_name: string | null;
};

export type PlainType = string;
export interface ParametricType {
  base: string;
  tv: TypeVarInfo;
}

export type Type = PlainType | ParametricType | Type[];
// Type guards
export const is_primitive = (value: any): boolean => Object(value) !== value;

export const is_variable_definition = (
  node: Node
): node is VariableDefinition => node?.ntype === "VariableDefinition";

export const is_function_definition = (
  node: Node
): node is FunctionDefinition => node?.ntype === "FunctionDefinition";

export const is_struct_definition = (node: Node): node is StructDefinition =>
  node?.ntype === "StructDefinition";

export const is_for_loop = (node: Node): node is ForLoop =>
  node?.ntype === "ForLoop";

export const is_declaration = (
  node: Node
): node is VariableDefinition | FunctionDefinition | StructDefinition =>
  is_variable_definition(node) ||
  is_function_definition(node) ||
  is_struct_definition(node);

// both int and float are considered number
export const is_number = (value: any): value is number =>
  typeof value === typeof 1;

export const is_float = (value: any): value is number => value % 1 !== 0;

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
