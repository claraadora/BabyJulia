export type Node = Program | ExpressionSequence | Expression | Parameter | StructField | void;

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
  | AbstractTypeDeclaration
  | Literal
  | Name;

export interface Literal {
  type: "Literal";
  value: Primitive;
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
  body: ExpressionSequence | null;
  return_stmt: Expression | null;
  return_type?: string;
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
  args: Expression[];
}

// Struct
export interface StructDefinition {
  type: "StructDefinition";
  struct_name: string;
  super_type_name?: string;
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
  super_type_name?: string;
}

export interface Environment {
  [name: string]: ValAndType[]
}

export type ValAndType = VarValAndType | FuncValAndType

export interface VarValAndType {
  value: Primitive
  type?: string | FuncValAndType
}

export interface FuncValAndType {
  value: Function 
  type?: {
    param_types?: string[] 
    return_type?: string 
  } 
}

