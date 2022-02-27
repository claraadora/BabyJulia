import {
  VarDefContext,
  SimpleExprContext,
  IdentifierContext,
  FldAccessContext,
  FuncDefContext,
  ParameterContext,
  BodyContext,
  FuncAppContext,
  ArgumentContext,
  AbsTypeDeclrContext,
  ProgramContext,
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
  AtomContext,
  ExprContext,
  ExprSequenceContext,
  ParametersContext,
} from "../lang/BabyJuliaParser";
import { BabyJuliaLexer } from "../lang/BabyJuliaLexer";
import {
  ExpressionSequence,
  VariableDefinition,
  Literal,
  Node,
  Name,
  FunctionDefinition,
  FieldAccess,
  Parameter,
  SimpleExpression,
  Expression,
  FunctionApplication,
  AbstractTypeDeclaration,
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

  visitSimpleExpr(ctx: SimpleExprContext): SimpleExpression {
    return ctx.getChild(0).accept(this) as SimpleExpression;
  }

  visitAtom(ctx: AtomContext): Literal {
    return {
      type: "Literal",
      value: ctx.text,
    };
  }

  visitIdentfier(ctx: IdentifierContext): Name {
    return {
      type: "Name",
      name: ctx.text,
    };
  }

  visitFldAccess(ctx: FldAccessContext): FieldAccess {
    return {
      type: "FieldAccess",
      objName: ctx._objName.text!,
      fieldName: ctx._fieldName.text!,
    };
  }

  // Variable Definition
  visitVarDef(ctx: VarDefContext): VariableDefinition {
    console.log("YO");
    return {
      type: "VariableDefinition",
      name: ctx._name.text!,
      expr: this.visit(ctx.simpleExpr()),
      atype: ctx._type ? ctx._type.text! : null,
    };
  }

  // Function Definition
  visitFuncDefinition(ctx: FuncDefContext): FunctionDefinition {
    // Get parameters.
    const params = [] as Parameter[];
    const parameters_ctx = ctx.parameters();
    for (let i = 0; i < (parameters_ctx ? parameters_ctx.childCount : 0); i++) {
      params.push(parameters_ctx?.getChild(i).accept(this) as Parameter);
    }

    // Get body.
    const body_ctx = ctx.body();
    const body = body_ctx
      ? this.visitExprSequence(body_ctx.exprSequence())
      : null;

    // Get return statement.
    const return_stmt_ctx = ctx.returnStmt();
    const return_stmt_expr_ctx = return_stmt_ctx
      ? return_stmt_ctx.simpleExpr()
      : null;
    const return_stmt = return_stmt_expr_ctx
      ? this.visitSimpleExpr(return_stmt_expr_ctx)
      : null;

    return {
      type: "FunctionDefinition",
      name: ctx._funcName.text!,
      params,
      body,
      return_stmt,
    };
  }

  visitParameter(ctx: ParameterContext): Parameter {
    return {
      type: "Parameter",
      name: ctx._name.text!,
      atype: ctx._type ? ctx._type.text! : null,
    };
  }

  // Function Application
  visitFuncApp(ctx: FuncAppContext): FunctionApplication {
    const args: SimpleExpression[] = [];
    const args_ctx = ctx.arguments();

    for (let i = 0; i < (args_ctx ? args_ctx.childCount : 0); i++) {
      args.push(args_ctx?.getChild(i).accept(this) as SimpleExpression);
    }

    return {
      type: "FunctionApplication",
      name: ctx._fname.text!,
      args,
    };
  }

  visitArgument(ctx: ArgumentContext): SimpleExpression {
    return this.visitSimpleExpr(ctx.simpleExpr());
  }

  // Abstract Type Declaration
  visitAbsTypeDeclr(ctx: AbsTypeDeclrContext): AbstractTypeDeclaration {
    return {
      type: "AbstractTypeDeclaration",
      name: ctx._type.text!,
      super_type_name: ctx._supertype.text!,
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
