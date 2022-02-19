/* tslint:disable:max-classes-per-file */
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { ErrorNode } from "antlr4ts/tree/ErrorNode";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { RuleNode } from "antlr4ts/tree/RuleNode";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { BabyJuliaVisitor } from "../lang/BabyJuliaVisitor";
import {
  BabyJuliaParser,
  ProgContext,
  VarDeclarationContext,
  LiteralContext,
  AtomContext,
} from "../lang/BabyJuliaParser";
import { BabyJuliaLexer } from "../lang/BabyJuliaLexer";
import { VarDeclaration, Literal, BJNode } from "../types";

class BJNodeGenerator implements BabyJuliaVisitor<BJNode> {
  visitVarDeclaration(ctx: VarDeclarationContext): VarDeclaration {
    return {
      type: "VarDeclaration",
      name: ctx._name.text,
      value: ctx._value.text,
    };
  }

  visitLiteral(ctx: LiteralContext): BJNode {
    return this.visit(ctx.atom());
  }

  visitAtom(ctx: AtomContext): Literal {
    return {
      type: "Literal",
      value: ctx.text,
    };
  }

  visitProg(ctx: ProgContext): BJNode {
    const expressions: BJNode[] = [];
    for (let i = 0; i < ctx.childCount; i++) {
      expressions.push(ctx.getChild(i).accept(this));
    }
    return {
      type: "ExprList",
      expressions,
    };
  }

  visit(tree: ParseTree): BJNode {
    return tree.accept(this);
  }

  visitChildren(node: RuleNode): BJNode {
    console.log("children");
    return null;
  }

  visitTerminal(node: TerminalNode): BJNode {
    console.log("terminal");
    return null;
  }

  visitErrorNode(node: ErrorNode): BJNode {
    throw new Error("Invalid syntax!");
  }
}

function convertSource(prog: ProgContext): BJNode {
  const generator = new BJNodeGenerator();
  return prog.accept(generator);
}

export function parse(source: string) {
  const inputStream = new ANTLRInputStream(source);
  const lexer = new BabyJuliaLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new BabyJuliaParser(tokenStream);
  parser.buildParseTree = true;

  const tree = parser.prog();
  const converted = convertSource(tree);
  return converted;
}
