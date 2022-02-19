export type BJNode = Expr | null;

export type Expr = VarDeclaration | Literal | Prog | ExprList;

export interface VarDeclaration {
  type: "VarDeclaration";
  name?: string;
  value?: string;
}

export interface Literal {
  type: "Literal";
  value?: string;
}

export interface Prog {
  type: "Program";
  expressions: ExprList;
}

export interface ExprList {
  type: "ExprList";
  expressions: Array<BJNode>;
}

export interface SourceLoc {
  end: Position;
  source?: string;
  start: Position;
}

export interface Position {
  column: number;
  line: number;
}
