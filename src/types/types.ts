export type Node =
  | VariableDeclaration
  | Literal
  | Program
  | ExpressionSequence
  | Name
  | Struct
  | void;

export interface VariableDeclaration {
  type: "VariableDeclaration";
  name: string;
  value: string;
}

export interface Literal {
  type: "Literal";
  value: string;
}

export interface Name {
  type: "Name";
  name: string;
}

export interface Program {
  type: "Program";
  expressions: ExpressionSequence;
}

export interface ExpressionSequence {
  type: "ExpressionSequence";
  expressions: Array<Node>;
}

export interface Struct {
  type: "Struct";
  name: string;
  fields: Array<StructField>;
}

export interface StructField {
  name: string;
  atype?: string;
}

// Type guards
function isVariableDeclaration(node: Node): node is VariableDeclaration {
  return (node as VariableDeclaration).type === "VariableDeclaration";
}

function isLiteral(node: Node): node is Literal {
  return (node as Literal).type === "Literal";
}

function isProgram(node: Node): node is Program {
  return (node as Program).type === "Program";
}

function isExpressionList(node: Node): node is ExpressionSequence {
  return (node as ExpressionSequence).type === "ExpressionSequence";
}

function isStruct(node: Node): node is Struct {
  return (node as Struct).type === "Struct";
}

export { isVariableDeclaration, isLiteral, isProgram, isExpressionList, isStruct };
