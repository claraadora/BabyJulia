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
  LiteralContext,
  StructDefinitionContext,
  StructFieldContext
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
  Expression,
  FunctionApplication,
  StructDefinition,
  StructField,
  AbstractTypeDeclaration,
  Primitive
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

  visitLiteral(temp_ctx: LiteralContext): Literal {
    const ctx = temp_ctx.atom();
    return {
      type: "Literal",
      value: getLiteralCtxValue(ctx),
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
      atype: ctx._type ? ctx._type.text! : null,
    };
  }

  // Function Definition
  visitFuncDefinition(temp_ctx: FuncDefinitionContext): FunctionDefinition {
    const ctx = temp_ctx.funcDef();

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
      ? return_stmt_ctx.expr()
      : null;
    const return_stmt = return_stmt_expr_ctx
      ? (return_stmt_expr_ctx.accept(this) as Expression)
      : null;

    return {
      type: "FunctionDefinition",
      name: ctx._funcName.text!,
      params,
      body,
      return_stmt,
      return_type: ctx._returnType?.text,
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
  visitFuncApplication(temp_ctx: FuncApplicationContext): FunctionApplication {
    const ctx = temp_ctx.funcApp();
    const args: Expression[] = [];
    const args_ctx = ctx.arguments();

    for (let i = 0; i < (args_ctx ? args_ctx.childCount : 0); i++) {
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
    for (let i = 0; i < (fields_ctx ? fields_ctx.childCount : 0); i++) {
      fields.push(fields_ctx?.getChild(i).accept(this) as StructField);
    }

    return {
      type: "StructDefinition",
      struct_name: ctx._structName.text!,
      super_type_name: ctx._supertype?.text,
      fields
    };
  }

  visitStructField(ctx: StructFieldContext): StructField {
    return {
      type: "StructField",
      name: ctx._varName.text!,
      atype: ctx._type ? ctx._type.text! : null,
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
      super_type_name: ctx._supertype?.text,
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

function getLiteralCtxValue(ctx: AtomContext): Primitive {  
  // boolean
  if (ctx.text == "true") {
    return true;
  } 
  if (ctx.text == "false") {
    return false;
  }

  // number
  if (!isNaN(Number(ctx.text))) {
    return Number(ctx.text);
  }

  return ctx.text;
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
