import {
  FieldAccessContext,
  IdentifierContext,
  FuncApplicationContext,
  ParameterContext,
  BodyContext,
  FuncAppContext,
  ArgumentContext,
  AbsTypeDeclrContext,
  ProgramContext,
  FuncDefinitionContext,
  VarDefinitionContext,
  NameContext,
  AbstractTypeDeclarationContext,
  StructDefinitionContext,
  StructFieldContext,
  NumberContext,
  StringContext,
  BooleanContext,
  ReturnStatementContext,
  PrintExpressionContext,
  ParenthesesContext,
  PowerContext,
  MultDivContext,
  AddSubContext,
  ArrContext,
  OneDArrContext,
  TwoDArrContext,
  ColContext,
  IndexAccessContext,
} from "./../lang/BabyJuliaParser";
/* tslint:disable:max-classes-per-file */
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { ErrorNode } from "antlr4ts/tree/ErrorNode";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { RuleNode } from "antlr4ts/tree/RuleNode";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { BabyJuliaVisitor } from "../lang/BabyJuliaVisitor";
import {
  BabyJuliaParser,
  ExprContext,
  ExprSequenceContext,
  ParametersContext,
} from "../lang/BabyJuliaParser";
import { BabyJuliaLexer } from "../lang/BabyJuliaLexer";
import {
  ExpressionSequence,
  VariableDefinition,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
  Node,
  Name,
  FunctionDefinition,
  FieldAccess,
  Parameter,
  Expression,
  FunctionApplication,
  StructDefinition,
  StructField,
  AbstractTypeDeclaration,
  ReturnStatement,
  PrintExpression,
  Arr,
  IndexAccess,
} from "./../types/types";

class NodeGenerator implements BabyJuliaVisitor<Node> {
  // Expressions
  visitExprSequence(ctx: ExprSequenceContext): ExpressionSequence {
    const expressions: Expression[] = [];
    for (let i = 0; i < ctx.childCount; i++) {
      expressions.push(ctx.getChild(i).accept(this) as Expression);
    }

    return {
      type: "ExpressionSequence",
      expressions,
    };
  }

  visitExpr(ctx: ExprContext): Expression {
    return ctx.getChild(0).accept(this) as Expression;
  }

  visitNumber(temp_ctx: NumberContext): NumberLiteral {
    const ctx = temp_ctx.NUMBER();
    return {
      type: "NumberLiteral",
      value: ctx.text,
    };
  }

  visitString(temp_ctx: StringContext): StringLiteral {
    const ctx = temp_ctx.STRING();
    return {
      type: "StringLiteral",
      value: ctx.text.replace(/['"]+/g, ""), // TODO: hacky
    };
  }

  visitBoolean(temp_ctx: BooleanContext): BooleanLiteral {
    const ctx = temp_ctx.BOOL();
    return {
      type: "BooleanLiteral",
      value: ctx.text,
    };
  }

  visitName(temp_ctx: NameContext): Name {
    const ctx = temp_ctx.identifier();
    return {
      type: "Name",
      name: ctx.text,
    };
  }

  visitFieldAccess(temp_ctx: FieldAccessContext): FieldAccess {
    const ctx = temp_ctx.fldAccess();
    return {
      type: "FieldAccess",
      objName: ctx._objName.text!,
      fieldName: ctx._fieldName.text!,
    };
  }

  // Variable Definition
  visitVarDefinition(temp_ctx: VarDefinitionContext): VariableDefinition {
    const ctx = temp_ctx.varDef();
    // accept(this)
    return {
      type: "VariableDefinition",
      name: ctx._name.text!,
      expr: ctx.expr().accept(this) as Expression,
      atype: ctx._type?.text ?? null,
    };
  }

  // Function Definition
  visitFuncDefinition(temp_ctx: FuncDefinitionContext): FunctionDefinition {
    const ctx = temp_ctx.funcDef();

    // Get parameters.
    const params = [] as Parameter[];
    const parameters_ctx = ctx.parameters();
    for (let i = 0; i < (parameters_ctx?.childCount ?? 0); i++) {
      params.push(parameters_ctx?.getChild(i).accept(this) as Parameter);
    }

    // Get body.
    const body_ctx = ctx.body();
    const body = this.visitExprSequence(body_ctx.exprSequence());

    return {
      type: "FunctionDefinition",
      name: ctx._funcName.text!,
      params,
      body,
      return_type: ctx._returnType?.text ?? null,
    };
  }

  visitParameter(ctx: ParameterContext): Parameter {
    return {
      type: "Parameter",
      name: ctx._name.text!,
      atype: ctx._type?.text ?? null,
    };
  }

  visitReturnStatement(ctx: ReturnStatementContext): ReturnStatement {
    return {
      type: "ReturnStatement",
      expr: (ctx.returnStmt().expr()?.accept(this) as Expression) ?? null,
    };
  }

  // Function Application
  visitFuncApplication(temp_ctx: FuncApplicationContext): FunctionApplication {
    const ctx = temp_ctx.funcApp();
    const args: Expression[] = [];
    const args_ctx = ctx.arguments();

    for (let i = 0; i < (args_ctx?.childCount ?? 0); i++) {
      args.push(args_ctx?.getChild(i).accept(this) as Expression);
    }

    return {
      type: "FunctionApplication",
      name: ctx._fname.text!,
      args,
    };
  }

  visitArgument(ctx: ArgumentContext): Expression {
    return ctx.expr().accept(this) as Expression;
  }

  // Struct Definition
  visitStructDefinition(temp_ctx: StructDefinitionContext): StructDefinition {
    const ctx = temp_ctx.structDef();

    // Get struct fields.
    const fields = [] as StructField[];
    const fields_ctx = ctx.structFields();
    for (let i = 0; i < (fields_ctx?.childCount ?? 0); i++) {
      fields.push(fields_ctx?.getChild(i).accept(this) as StructField);
    }

    return {
      type: "StructDefinition",
      name: ctx._structName.text!,
      super_type_name: ctx._supertype?.text ?? null,
      fields,
    };
  }

  visitStructField(ctx: StructFieldContext): StructField {
    return {
      type: "StructField",
      name: ctx._varName.text!,
      atype: ctx._type?.text ?? null,
    };
  }

  // Abstract Type Declaration
  visitAbstractTypeDeclaration(
    temp_ctx: AbstractTypeDeclarationContext
  ): AbstractTypeDeclaration {
    const ctx = temp_ctx.absTypeDeclr();
    return {
      type: "AbstractTypeDeclaration",
      name: ctx._type.text!,
      super_type_name: ctx._supertype?.text ?? null,
    };
  }

  // Print Expression
  visitPrintExpression(ctx: PrintExpressionContext): PrintExpression {
    return {
      type: "PrintExpression",
      expr: (ctx.printExpr().expr()?.accept(this) as Expression) ?? null,
    };
  }

  // Binary Expression
  visitParentheses(ctx: ParenthesesContext): Expression {
    return this.visit(ctx._inner) as Expression;
  }

  visitPower(ctx: PowerContext): Expression {
    return {
      type: "BinaryExpression",
      operator: "^",
      left: this.visit(ctx._left) as Expression,
      right: this.visit(ctx._right) as Expression,
    };
  }

  visitMultDiv(ctx: MultDivContext): Expression {
    return {
      type: "BinaryExpression",
      operator: ctx._operator.text!,
      left: this.visit(ctx._left) as Expression,
      right: this.visit(ctx._right) as Expression,
    };
  }

  visitAddSub(ctx: AddSubContext): Expression {
    return {
      type: "BinaryExpression",
      operator: ctx._operator.text!,
      left: this.visit(ctx._left) as Expression,
      right: this.visit(ctx._right) as Expression,
    };
  }

  // Array
  visitArr(temp_ctx: ArrContext): Arr {
    const ctx = temp_ctx.array();
    return ctx.getChild(0).accept(this) as Arr;
  }

  visitOneDArr(ctx: OneDArrContext): Arr {
    // Visit the cols.
    const exprs = [] as Expression[];
    const cols_ctx = ctx.cols();
    for (let i = 0; i < (cols_ctx.childCount ?? 0); i++) {
      exprs.push(cols_ctx?.getChild(i).accept(this) as Expression);
    }

    return {
      type: "Arr",
      value: exprs,
    };
  }

  visitTwoDArr(ctx: TwoDArrContext): Arr {
    // Visit the rows and construct the 2d array.
    const exprs = [] as Expression[][];
    const rows_ctx = ctx.rows();
    let rowIdx = 0;
    let colIdx = 0;
    exprs[rowIdx] = [];

    for (let i = 0; i < (rows_ctx.childCount ?? 0); i++) {
      let col = rows_ctx?.getChild(i).accept(this) as Expression;

      if (col) {
        exprs[rowIdx][colIdx++] = col;
      } else {
        // If col == undefined, it means we are at the end of the current row.
        colIdx = 0;
        exprs[++rowIdx] = [];
      }
    }

    return {
      type: "Arr",
      value: exprs,
    };
  }

  visitCol(ctx: ColContext): Expression {
    return ctx.expr().accept(this) as Expression;
  }

  visitIndexAccess(temp_ctx: IndexAccessContext): IndexAccess {
    const ctx = temp_ctx.idxAccess();
    return {
      type: "IndexAccess",
      name: ctx._name.text!,
      start_idx: ctx._startIdx.accept(this) as Expression,
      end_idx: (ctx._endIdx?.accept(this) as Expression) ?? null,
    };
  }

  // ANTLR things
  visit(tree: ParseTree): Node {
    return tree.accept(this);
  }

  visitChildren(node: RuleNode): Node {}

  visitTerminal(node: TerminalNode): Node {}

  visitErrorNode(node: ErrorNode): Node {
    throw new Error("Invalid syntax!");
  }
}

function convertSource(prog: ProgramContext): Node {
  const expressionSeq = prog.exprSequence();
  const generator = new NodeGenerator();
  return expressionSeq.accept(generator);
}

export function parse(source: string) {
  const inputStream = new ANTLRInputStream(source);
  const lexer = new BabyJuliaLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new BabyJuliaParser(tokenStream);
  parser.buildParseTree = true;

  const tree = parser.program();
  const converted = convertSource(tree);
  return converted;
}
