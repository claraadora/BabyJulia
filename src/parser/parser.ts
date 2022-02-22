import { ExprSequenceContext, NameContext } from "./../lang/BabyJuliaParser";
/* tslint:disable:max-classes-per-file */
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { ErrorNode } from "antlr4ts/tree/ErrorNode";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { RuleNode } from "antlr4ts/tree/RuleNode";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { BabyJuliaVisitor } from "../lang/BabyJuliaVisitor";
import {
  BabyJuliaParser,
  VarDeclarationContext,
  LiteralContext,
  AtomContext,
  ExprContext,
  StructContext,
} from "../lang/BabyJuliaParser";
import { BabyJuliaLexer } from "../lang/BabyJuliaLexer";
import {
  ExpressionSequence,
  VariableDeclaration,
  Literal,
  Node,
  Name,
  Struct,
  StructField,
} from "./../types/types";
class NodeGenerator implements BabyJuliaVisitor<Node> {
  visitVarDeclaration(ctx: VarDeclarationContext): VariableDeclaration {
    // console.log("var declaration");
    return {
      type: "VariableDeclaration",
      name: ctx._name.text!,
      value: ctx._value.text!,
    };
  }

  visitLiteral(ctx: LiteralContext): Node {
    // console.log("literal");
    return this.visit(ctx.atom());
  }

  visitName(ctx: NameContext): Name {
    return {
      type: "Name",
      name: ctx._name.text!,
    };
  }

  visitAtom(ctx: AtomContext): Literal {
    // console.log("atom");
    return {
      type: "Literal",
      value: ctx.text,
    };
  }

  visitExprSequence(ctx: ExprContext): ExpressionSequence {
    // console.log("sequence");
    const expressions: Node[] = [];
    for (let i = 0; i < ctx.childCount; i++) {
      expressions.push(ctx.getChild(i).accept(this));
    }
    return {
      type: "ExpressionSequence",
      expressions,
    };
  }

  visitStruct(ctx: StructContext): Struct {
    // console.log("struct declaration");
    const fields: StructField[] = [];
    for (let i = 0; i < ctx.childCount; i++) {
      fields.push(ctx.getChild(i).accept(this));
    }
    return {
      type: "Struct",
      name: ctx._extTypedIdent._typedIdent.text!,
      fields: fields,
    };
  }

  visit(tree: ParseTree): Node {
    return tree.accept(this);
  }

  visitChildren(node: RuleNode): Node {}

  visitTerminal(node: TerminalNode): Node {}

  visitErrorNode(node: ErrorNode): Node {
    throw new Error("Invalid syntax!");
  }
}

function convertSource(prog: ExprSequenceContext): Node {
  const generator = new NodeGenerator();
  return prog.accept(generator);
}

export function parse(source: string) {
  const inputStream = new ANTLRInputStream(source);
  const lexer = new BabyJuliaLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new BabyJuliaParser(tokenStream);
  parser.buildParseTree = true;

  const tree = parser.exprSequence();
  const converted = convertSource(tree);
  return converted;
}
