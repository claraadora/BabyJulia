// Generated from /Users/clara/Documents/school/Y3S2/BabyJulia/src/lang/BabyJulia.g4 by ANTLR 4.8
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class BabyJuliaParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		NUMBER=1, STRING=2, BOOL=3, BIN_OP=4, MUL=5, DIV=6, ADD=7, SUB=8, NAME=9, 
		WHITESPACE=10, NEWLINE=11, ASSIGN=12;
	public static final int
		RULE_exprSequence = 0, RULE_expr = 1, RULE_atom = 2;
	private static String[] makeRuleNames() {
		return new String[] {
			"exprSequence", "expr", "atom"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, "'*'", "'/'", "'+'", "'-'", null, null, 
			null, "'='"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "NUMBER", "STRING", "BOOL", "BIN_OP", "MUL", "DIV", "ADD", "SUB", 
			"NAME", "WHITESPACE", "NEWLINE", "ASSIGN"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "BabyJulia.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public BabyJuliaParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class ExprSequenceContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(BabyJuliaParser.EOF, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public List<TerminalNode> NEWLINE() { return getTokens(BabyJuliaParser.NEWLINE); }
		public TerminalNode NEWLINE(int i) {
			return getToken(BabyJuliaParser.NEWLINE, i);
		}
		public ExprSequenceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_exprSequence; }
	}

	public final ExprSequenceContext exprSequence() throws RecognitionException {
		ExprSequenceContext _localctx = new ExprSequenceContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_exprSequence);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(16);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << NUMBER) | (1L << STRING) | (1L << BOOL) | (1L << NAME) | (1L << NEWLINE))) != 0)) {
				{
				setState(14);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case NUMBER:
				case STRING:
				case BOOL:
				case NAME:
					{
					setState(6);
					expr();
					setState(10);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
					while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
						if ( _alt==1 ) {
							{
							{
							setState(7);
							match(NEWLINE);
							}
							} 
						}
						setState(12);
						_errHandler.sync(this);
						_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
					}
					}
					break;
				case NEWLINE:
					{
					setState(13);
					match(NEWLINE);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(18);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(19);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExprContext extends ParserRuleContext {
		public ExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expr; }
	 
		public ExprContext() { }
		public void copyFrom(ExprContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class VarDeclarationContext extends ExprContext {
		public Token name;
		public AtomContext value;
		public TerminalNode ASSIGN() { return getToken(BabyJuliaParser.ASSIGN, 0); }
		public TerminalNode NAME() { return getToken(BabyJuliaParser.NAME, 0); }
		public AtomContext atom() {
			return getRuleContext(AtomContext.class,0);
		}
		public VarDeclarationContext(ExprContext ctx) { copyFrom(ctx); }
	}
	public static class LiteralContext extends ExprContext {
		public AtomContext value;
		public AtomContext atom() {
			return getRuleContext(AtomContext.class,0);
		}
		public LiteralContext(ExprContext ctx) { copyFrom(ctx); }
	}
	public static class NameContext extends ExprContext {
		public Token name;
		public TerminalNode NAME() { return getToken(BabyJuliaParser.NAME, 0); }
		public NameContext(ExprContext ctx) { copyFrom(ctx); }
	}

	public final ExprContext expr() throws RecognitionException {
		ExprContext _localctx = new ExprContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_expr);
		try {
			setState(26);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
			case 1:
				_localctx = new VarDeclarationContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(21);
				((VarDeclarationContext)_localctx).name = match(NAME);
				setState(22);
				match(ASSIGN);
				setState(23);
				((VarDeclarationContext)_localctx).value = atom();
				}
				break;
			case 2:
				_localctx = new LiteralContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(24);
				((LiteralContext)_localctx).value = atom();
				}
				break;
			case 3:
				_localctx = new NameContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(25);
				((NameContext)_localctx).name = match(NAME);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AtomContext extends ParserRuleContext {
		public TerminalNode NUMBER() { return getToken(BabyJuliaParser.NUMBER, 0); }
		public TerminalNode STRING() { return getToken(BabyJuliaParser.STRING, 0); }
		public TerminalNode BOOL() { return getToken(BabyJuliaParser.BOOL, 0); }
		public AtomContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_atom; }
	}

	public final AtomContext atom() throws RecognitionException {
		AtomContext _localctx = new AtomContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_atom);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(28);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << NUMBER) | (1L << STRING) | (1L << BOOL))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\16!\4\2\t\2\4\3\t"+
		"\3\4\4\t\4\3\2\3\2\7\2\13\n\2\f\2\16\2\16\13\2\3\2\7\2\21\n\2\f\2\16\2"+
		"\24\13\2\3\2\3\2\3\3\3\3\3\3\3\3\3\3\5\3\35\n\3\3\4\3\4\3\4\2\2\5\2\4"+
		"\6\2\3\3\2\3\5\2\"\2\22\3\2\2\2\4\34\3\2\2\2\6\36\3\2\2\2\b\f\5\4\3\2"+
		"\t\13\7\r\2\2\n\t\3\2\2\2\13\16\3\2\2\2\f\n\3\2\2\2\f\r\3\2\2\2\r\21\3"+
		"\2\2\2\16\f\3\2\2\2\17\21\7\r\2\2\20\b\3\2\2\2\20\17\3\2\2\2\21\24\3\2"+
		"\2\2\22\20\3\2\2\2\22\23\3\2\2\2\23\25\3\2\2\2\24\22\3\2\2\2\25\26\7\2"+
		"\2\3\26\3\3\2\2\2\27\30\7\13\2\2\30\31\7\16\2\2\31\35\5\6\4\2\32\35\5"+
		"\6\4\2\33\35\7\13\2\2\34\27\3\2\2\2\34\32\3\2\2\2\34\33\3\2\2\2\35\5\3"+
		"\2\2\2\36\37\t\2\2\2\37\7\3\2\2\2\6\f\20\22\34";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}