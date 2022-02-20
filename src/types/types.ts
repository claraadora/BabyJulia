export type Node =
  | VariableDeclaration
  | Literal
  | Program
  | ExpressionSequence
  | Name
  | void;

export type AType = "Int64" | "Bool";
export interface VariableDeclaration {
  type: "VariableDeclaration";
  name: string;
  value: string;
  atype?: string;
}

export interface FunctionDefinition {
  type: "FunctionDefinition";
  name: string;
  params: string[];
  body: ExpressionSequence;
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

export { isVariableDeclaration, isLiteral, isProgram, isExpressionList };
