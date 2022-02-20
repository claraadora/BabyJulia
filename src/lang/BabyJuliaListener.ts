// Generated from ./src/lang/BabyJulia.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { VarDeclarationContext } from "./BabyJuliaParser";
import { LiteralContext } from "./BabyJuliaParser";
import { NameContext } from "./BabyJuliaParser";
import { ExprSequenceContext } from "./BabyJuliaParser";
import { ExprContext } from "./BabyJuliaParser";
import { AtomContext } from "./BabyJuliaParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `BabyJuliaParser`.
 */
export interface BabyJuliaListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `VarDeclaration`
	 * labeled alternative in `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 */
	enterVarDeclaration?: (ctx: VarDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by the `VarDeclaration`
	 * labeled alternative in `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 */
	exitVarDeclaration?: (ctx: VarDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by the `Literal`
	 * labeled alternative in `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 */
	enterLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Exit a parse tree produced by the `Literal`
	 * labeled alternative in `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 */
	exitLiteral?: (ctx: LiteralContext) => void;

	/**
	 * Enter a parse tree produced by the `Name`
	 * labeled alternative in `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 */
	enterName?: (ctx: NameContext) => void;
	/**
	 * Exit a parse tree produced by the `Name`
	 * labeled alternative in `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 */
	exitName?: (ctx: NameContext) => void;

	/**
	 * Enter a parse tree produced by `BabyJuliaParser.exprSequence`.
	 * @param ctx the parse tree
	 */
	enterExprSequence?: (ctx: ExprSequenceContext) => void;
	/**
	 * Exit a parse tree produced by `BabyJuliaParser.exprSequence`.
	 * @param ctx the parse tree
	 */
	exitExprSequence?: (ctx: ExprSequenceContext) => void;

	/**
	 * Enter a parse tree produced by `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `BabyJuliaParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `BabyJuliaParser.atom`.
	 * @param ctx the parse tree
	 */
	enterAtom?: (ctx: AtomContext) => void;
	/**
	 * Exit a parse tree produced by `BabyJuliaParser.atom`.
	 * @param ctx the parse tree
	 */
	exitAtom?: (ctx: AtomContext) => void;
}

