// Generated from ./src/lang/BabyJulia.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { BabyJuliaListener } from "./BabyJuliaListener";
import { BabyJuliaVisitor } from "./BabyJuliaVisitor";


export class BabyJuliaParser extends Parser {
	public static readonly NUMBER = 1;
	public static readonly STRING = 2;
	public static readonly BOOL = 3;
	public static readonly BIN_OP = 4;
	public static readonly MUL = 5;
	public static readonly DIV = 6;
	public static readonly ADD = 7;
	public static readonly SUB = 8;
	public static readonly NAME = 9;
	public static readonly WHITESPACE = 10;
	public static readonly NEWLINE = 11;
	public static readonly ASSIGN = 12;
	public static readonly RULE_exprSequence = 0;
	public static readonly RULE_expr = 1;
	public static readonly RULE_atom = 2;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"exprSequence", "expr", "atom",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, "'*'", "'/'", "'+'", 
		"'-'", undefined, undefined, undefined, "'='",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "NUMBER", "STRING", "BOOL", "BIN_OP", "MUL", "DIV", "ADD", 
		"SUB", "NAME", "WHITESPACE", "NEWLINE", "ASSIGN",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(BabyJuliaParser._LITERAL_NAMES, BabyJuliaParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return BabyJuliaParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "BabyJulia.g4"; }

	// @Override
	public get ruleNames(): string[] { return BabyJuliaParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return BabyJuliaParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(BabyJuliaParser._ATN, this);
	}
	// @RuleVersion(0)
	public exprSequence(): ExprSequenceContext {
		let _localctx: ExprSequenceContext = new ExprSequenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, BabyJuliaParser.RULE_exprSequence);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 16;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << BabyJuliaParser.NUMBER) | (1 << BabyJuliaParser.STRING) | (1 << BabyJuliaParser.BOOL) | (1 << BabyJuliaParser.NAME) | (1 << BabyJuliaParser.NEWLINE))) !== 0)) {
				{
				this.state = 14;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case BabyJuliaParser.NUMBER:
				case BabyJuliaParser.STRING:
				case BabyJuliaParser.BOOL:
				case BabyJuliaParser.NAME:
					{
					this.state = 6;
					this.expr();
					this.state = 10;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
					while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
						if (_alt === 1) {
							{
							{
							this.state = 7;
							this.match(BabyJuliaParser.NEWLINE);
							}
							}
						}
						this.state = 12;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
					}
					}
					break;
				case BabyJuliaParser.NEWLINE:
					{
					this.state = 13;
					this.match(BabyJuliaParser.NEWLINE);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 18;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 19;
			this.match(BabyJuliaParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expr(): ExprContext {
		let _localctx: ExprContext = new ExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, BabyJuliaParser.RULE_expr);
		try {
			this.state = 26;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				_localctx = new VarDeclarationContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 21;
				(_localctx as VarDeclarationContext)._name = this.match(BabyJuliaParser.NAME);
				this.state = 22;
				this.match(BabyJuliaParser.ASSIGN);
				this.state = 23;
				(_localctx as VarDeclarationContext)._value = this.atom();
				}
				break;

			case 2:
				_localctx = new LiteralContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 24;
				(_localctx as LiteralContext)._value = this.atom();
				}
				break;

			case 3:
				_localctx = new NameContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 25;
				(_localctx as NameContext)._name = this.match(BabyJuliaParser.NAME);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public atom(): AtomContext {
		let _localctx: AtomContext = new AtomContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, BabyJuliaParser.RULE_atom);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 28;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << BabyJuliaParser.NUMBER) | (1 << BabyJuliaParser.STRING) | (1 << BabyJuliaParser.BOOL))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x0E!\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x03\x02\x03\x02\x07\x02\v\n\x02\f\x02" +
		"\x0E\x02\x0E\v\x02\x03\x02\x07\x02\x11\n\x02\f\x02\x0E\x02\x14\v\x02\x03" +
		"\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03\x1D\n\x03" +
		"\x03\x04\x03\x04\x03\x04\x02\x02\x02\x05\x02\x02\x04\x02\x06\x02\x02\x03" +
		"\x03\x02\x03\x05\x02\"\x02\x12\x03\x02\x02\x02\x04\x1C\x03\x02\x02\x02" +
		"\x06\x1E\x03\x02\x02\x02\b\f\x05\x04\x03\x02\t\v\x07\r\x02\x02\n\t\x03" +
		"\x02\x02\x02\v\x0E\x03\x02\x02\x02\f\n\x03\x02\x02\x02\f\r\x03\x02\x02" +
		"\x02\r\x11\x03\x02\x02\x02\x0E\f\x03\x02\x02\x02\x0F\x11\x07\r\x02\x02" +
		"\x10\b\x03\x02\x02\x02\x10\x0F\x03\x02\x02\x02\x11\x14\x03\x02\x02\x02" +
		"\x12\x10\x03\x02\x02\x02\x12\x13\x03\x02\x02\x02\x13\x15\x03\x02\x02\x02" +
		"\x14\x12\x03\x02\x02\x02\x15\x16\x07\x02\x02\x03\x16\x03\x03\x02\x02\x02" +
		"\x17\x18\x07\v\x02\x02\x18\x19\x07\x0E\x02\x02\x19\x1D\x05\x06\x04\x02" +
		"\x1A\x1D\x05\x06\x04\x02\x1B\x1D\x07\v\x02\x02\x1C\x17\x03\x02\x02\x02" +
		"\x1C\x1A\x03\x02\x02\x02\x1C\x1B\x03\x02\x02\x02\x1D\x05\x03\x02\x02\x02" +
		"\x1E\x1F\t\x02\x02\x02\x1F\x07\x03\x02\x02\x02\x06\f\x10\x12\x1C";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!BabyJuliaParser.__ATN) {
			BabyJuliaParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(BabyJuliaParser._serializedATN));
		}

		return BabyJuliaParser.__ATN;
	}

}

export class ExprSequenceContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(BabyJuliaParser.EOF, 0); }
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public NEWLINE(): TerminalNode[];
	public NEWLINE(i: number): TerminalNode;
	public NEWLINE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(BabyJuliaParser.NEWLINE);
		} else {
			return this.getToken(BabyJuliaParser.NEWLINE, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BabyJuliaParser.RULE_exprSequence; }
	// @Override
	public enterRule(listener: BabyJuliaListener): void {
		if (listener.enterExprSequence) {
			listener.enterExprSequence(this);
		}
	}
	// @Override
	public exitRule(listener: BabyJuliaListener): void {
		if (listener.exitExprSequence) {
			listener.exitExprSequence(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BabyJuliaVisitor<Result>): Result {
		if (visitor.visitExprSequence) {
			return visitor.visitExprSequence(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BabyJuliaParser.RULE_expr; }
	public copyFrom(ctx: ExprContext): void {
		super.copyFrom(ctx);
	}
}
export class VarDeclarationContext extends ExprContext {
	public _name!: Token;
	public _value!: AtomContext;
	public ASSIGN(): TerminalNode { return this.getToken(BabyJuliaParser.ASSIGN, 0); }
	public NAME(): TerminalNode { return this.getToken(BabyJuliaParser.NAME, 0); }
	public atom(): AtomContext {
		return this.getRuleContext(0, AtomContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BabyJuliaListener): void {
		if (listener.enterVarDeclaration) {
			listener.enterVarDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: BabyJuliaListener): void {
		if (listener.exitVarDeclaration) {
			listener.exitVarDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BabyJuliaVisitor<Result>): Result {
		if (visitor.visitVarDeclaration) {
			return visitor.visitVarDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LiteralContext extends ExprContext {
	public _value!: AtomContext;
	public atom(): AtomContext {
		return this.getRuleContext(0, AtomContext);
	}
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BabyJuliaListener): void {
		if (listener.enterLiteral) {
			listener.enterLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: BabyJuliaListener): void {
		if (listener.exitLiteral) {
			listener.exitLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BabyJuliaVisitor<Result>): Result {
		if (visitor.visitLiteral) {
			return visitor.visitLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NameContext extends ExprContext {
	public _name!: Token;
	public NAME(): TerminalNode { return this.getToken(BabyJuliaParser.NAME, 0); }
	constructor(ctx: ExprContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BabyJuliaListener): void {
		if (listener.enterName) {
			listener.enterName(this);
		}
	}
	// @Override
	public exitRule(listener: BabyJuliaListener): void {
		if (listener.exitName) {
			listener.exitName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BabyJuliaVisitor<Result>): Result {
		if (visitor.visitName) {
			return visitor.visitName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AtomContext extends ParserRuleContext {
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(BabyJuliaParser.NUMBER, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(BabyJuliaParser.STRING, 0); }
	public BOOL(): TerminalNode | undefined { return this.tryGetToken(BabyJuliaParser.BOOL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BabyJuliaParser.RULE_atom; }
	// @Override
	public enterRule(listener: BabyJuliaListener): void {
		if (listener.enterAtom) {
			listener.enterAtom(this);
		}
	}
	// @Override
	public exitRule(listener: BabyJuliaListener): void {
		if (listener.exitAtom) {
			listener.exitAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BabyJuliaVisitor<Result>): Result {
		if (visitor.visitAtom) {
			return visitor.visitAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


