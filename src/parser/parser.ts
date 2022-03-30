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
  ForLoopContext,
  RelationalExpressionContext,
  ConditionalExpressionContext,
  TypeContext,
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
  ForLoop,
  Block,
  RelationalExpression,
  ConditionalExpression,
  Type,
} from "./../types/types";

class NodeGenerator implements BabyJuliaVisitor<Node | Type | null> {
  // Expressions
  visitExprSequence(ctx: ExprSequenceContext): ExpressionSequence {
    const expressions: Expression[] = [];
    for (let i = 0; i < ctx.childCount; i++) {
      expressions.push(ctx.getChild(i).accept(this) as Expression);
    }

    return {
      ntype: "ExpressionSequence",
      expressions,
    };
  }

  visitExpr(ctx: ExprContext): Expression {
    return ctx.getChild(0).accept(this) as Expression;
  }

  visitNumber(temp_ctx: NumberContext): NumberLiteral {
    const ctx = temp_ctx.NUMBER();
    return {
      ntype: "NumberLiteral",
      value: ctx.text,
    };
  }

  visitString(temp_ctx: StringContext): StringLiteral {
    const ctx = temp_ctx.STRING();
    return {
      ntype: "StringLiteral",
      value: ctx.text.replace(/['"]+/g, ""), // TODO: hacky
    };
  }

  visitBoolean(temp_ctx: BooleanContext): BooleanLiteral {
    const ctx = temp_ctx.BOOL();
    return {
      ntype: "BooleanLiteral",
      value: ctx.text,
    };
  }

  visitName(temp_ctx: NameContext): Name {
    const ctx = temp_ctx.identifier();
    return {
      ntype: "Name",
      name: ctx.text,
    };
  }

  visitFieldAccess(temp_ctx: FieldAccessContext): FieldAccess {
    const ctx = temp_ctx.fldAccess();
    return {
      ntype: "FieldAccess",
      objName: ctx._objName.text!,
      fieldName: ctx._fieldName.text!,
    };
  }

  // Variable Definition
  visitVarDefinition(temp_ctx: VarDefinitionContext): VariableDefinition {
    const ctx = temp_ctx.varDef();
    const atype = this.visitType(ctx._atype) as Type;

    return {
      ntype: "VariableDefinition",
      name: ctx._name.text!,
      expr: ctx.expr().accept(this) as Expression,
      atype,
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
    const body = wrap_in_block(this.visitExprSequence(body_ctx.exprSequence()));

    // Get return type.
    const return_type = this.visitType(ctx._returnType) as Type;

    return {
      ntype: "FunctionDefinition",
      name: ctx._funcName.text!,
      params,
      body,
      return_type,
    };
  }

  visitParameter(ctx: ParameterContext): Parameter {
    const atype = this.visitType(ctx._atype) as Type;

    return {
      ntype: "Parameter",
      name: ctx._name.text!,
      atype,
    };
  }

  visitReturnStatement(ctx: ReturnStatementContext): ReturnStatement {
    return {
      ntype: "ReturnStatement",
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
      ntype: "FunctionApplication",
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
      ntype: "StructDefinition",
      type: this.visitType(ctx._base_type) as Type,
      super_type: ctx._super_type
        ? (this.visitType(ctx._super_type) as Type)
        : null,
      fields,
    };
  }

  visitStructField(ctx: StructFieldContext): StructField {
    const atype = this.visitType(ctx._atype) as Type;

    return {
      ntype: "StructField",
      name: ctx._varName.text!,
      atype,
    };
  }

  // Abstract Type Declaration
  visitAbstractTypeDeclaration(
    temp_ctx: AbstractTypeDeclarationContext
  ): AbstractTypeDeclaration {
    const ctx = temp_ctx.absTypeDeclr();

    return {
      ntype: "AbstractTypeDeclaration",
      type: this.visitType(ctx._base_type) as Type,
      super_type: ctx._super_type
        ? (this.visitType(ctx._super_type) as Type)
        : null,
    };
  }

  // Print Expression
  visitPrintExpression(ctx: PrintExpressionContext): PrintExpression {
    return {
      ntype: "PrintExpression",
      expr: (ctx.printExpr().expr()?.accept(this) as Expression) ?? null,
    };
  }

  // Binary Expression
  visitParentheses(ctx: ParenthesesContext): Expression {
    return this.visit(ctx._inner) as Expression;
  }

  visitPower(ctx: PowerContext): Expression {
    return {
      ntype: "BinaryExpression",
      operator: "^",
      left: this.visit(ctx._left) as Expression,
      right: this.visit(ctx._right) as Expression,
    };
  }

  visitMultDiv(ctx: MultDivContext): Expression {
    return {
      ntype: "BinaryExpression",
      operator: ctx._operator.text!,
      left: this.visit(ctx._left) as Expression,
      right: this.visit(ctx._right) as Expression,
    };
  }

  visitAddSub(ctx: AddSubContext): Expression {
    return {
      ntype: "BinaryExpression",
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
      ntype: "Arr",
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
      ntype: "Arr",
      value: exprs,
    };
  }

  visitCol(ctx: ColContext): Expression {
    return ctx.expr().accept(this) as Expression;
  }

  visitIndexAccess(temp_ctx: IndexAccessContext): IndexAccess {
    const ctx = temp_ctx.idxAccess();
    return {
      ntype: "IndexAccess",
      name: ctx._name.text!,
      start_idx: ctx._startIdx.accept(this) as Expression,
      end_idx: (ctx._endIdx?.accept(this) as Expression) ?? null,
    };
  }

  // For loop
  visitForLoop(temp_ctx: ForLoopContext): Node {
    const ctx = temp_ctx.forLoopStmt();

    // Get body.
    const body_ctx = ctx.body();
    const body = this.visitExprSequence(body_ctx.exprSequence());

    return wrap_in_block({
      ntype: "ForLoop",
      name: ctx._name.text!,
      start_idx: (ctx._startIdx?.accept(this) as Expression) ?? null,
      end_idx: (ctx._endIdx?.accept(this) as Expression) ?? null,
      body: body,
    });
  }

  visitRelationalExpression(
    ctx: RelationalExpressionContext
  ): RelationalExpression {
    return {
      ntype: "RelationalExpression",
      operator: ctx._operator.text!,
      left: this.visit(ctx._left) as Expression,
      right: this.visit(ctx._right) as Expression,
    };
  }

  visitConditionalExpression(
    ctx: ConditionalExpressionContext
  ): ConditionalExpression {
    return {
      ntype: "ConditionalExpression",
      predicate: this.visit(ctx._predicate) as Expression,
      consequent: this.visit(ctx._consequent) as Expression,
      alternative: this.visit(ctx._alternative) as Expression,
    };
  }

  /*
function getTypes(typeCtx: TypeContext): string[] {
  const types = [] as string[];
  if (typeCtx?.NAME()) {
    types.push(typeCtx?.NAME()?.text!);
  } else if (typeCtx?.union()) {
    const union_types = typeCtx?.union()?.NAME();
    union_types?.map((atype) => types.push(atype.text));
  }

  return types;
}

  */

  visitType(ctx: TypeContext): Type | null {
    if (ctx?.NAME()) {
      // Plain type.
      return ctx?.NAME()?.text!;
    } else if (ctx?.union()) {
      // Union type.
      const types = [] as Type[];
      ctx
        .union()
        ?.type()
        .map((t) => types.push(this.visitType(t) as Type));
      return types;
    } else if (ctx?.parametric()) {
      // Parametric type.
      const param_ctx = ctx.parametric();
      return {
        base: param_ctx?._base.text!,
        tv: {
          name: param_ctx?._tv?.text ?? null,
          supername: param_ctx?._tv_super?.text ?? null,
        },
      };
    } else {
      return null;
    }
  }

  // ANTLR things
  visit(tree: ParseTree): Node | Type | null {
    return tree.accept(this);
  }

  visitChildren(node: RuleNode): Node {}

  visitTerminal(node: TerminalNode): Node {}

  visitErrorNode(node: ErrorNode): Node {
    throw new Error("Invalid syntax!");
  }
}

function wrap_in_block(node: ForLoop | ExpressionSequence): Block {
  return {
    ntype: "Block",
    node,
  };
}

function convertSource(prog: ProgramContext): Node {
  const expressionSeq = prog.exprSequence();
  const generator = new NodeGenerator();
  return wrap_in_block(expressionSeq.accept(generator) as ExpressionSequence);
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
