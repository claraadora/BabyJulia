// Generated from ./src/lang/BabyJulia.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { VarDeclarationContext } from "./BabyJuliaParser";
import { LiteralContext } from "./BabyJuliaParser";
import { ProgContext } from "./BabyJuliaParser";
import { ExprContext } from "./BabyJuliaParser";
import { AtomContext } from "./BabyJuliaParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `BabyJuliaParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface BabyJuliaVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by the `VarDeclaration`
	 * labeled alternative in `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVarDeclaration?: (ctx: VarDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by the `Literal`
	 * labeled alternative in `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteral?: (ctx: LiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `BabyJuliaParser.prog`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProg?: (ctx: ProgContext) => Result;

	/**
	 * Visit a parse tree produced by `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;

	/**
	 * Visit a parse tree produced by `BabyJuliaParser.atom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAtom?: (ctx: AtomContext) => Result;
}

