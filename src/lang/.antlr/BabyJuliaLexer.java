// Generated from /Users/clara/Documents/school/Y3S2/BabyJulia/src/lang/BabyJulia.g4 by ANTLR 4.8
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class BabyJuliaLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		NUMBER=1, STRING=2, BOOL=3, BIN_OP=4, MUL=5, DIV=6, ADD=7, SUB=8, NAME=9, 
		WHITESPACE=10, NEWLINE=11, ASSIGN=12;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"NUMBER", "STRING", "BOOL", "BIN_OP", "MUL", "DIV", "ADD", "SUB", "NAME", 
			"WHITESPACE", "NEWLINE", "ASSIGN"
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


	public BabyJuliaLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "BabyJulia.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\16[\b\1\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\3\2\6\2\35\n\2\r\2\16\2\36\3\3\3\3\3\3\3\3\7\3%\n"+
		"\3\f\3\16\3(\13\3\3\3\3\3\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\5\4\65\n"+
		"\4\3\5\3\5\3\5\3\5\5\5;\n\5\3\6\3\6\3\7\3\7\3\b\3\b\3\t\3\t\3\n\6\nF\n"+
		"\n\r\n\16\nG\3\13\6\13K\n\13\r\13\16\13L\3\13\3\13\3\f\5\fR\n\f\3\f\3"+
		"\f\6\fV\n\f\r\f\16\fW\3\r\3\r\2\2\16\3\3\5\4\7\5\t\6\13\7\r\b\17\t\21"+
		"\n\23\13\25\f\27\r\31\16\3\2\6\3\2\62;\5\2\f\f\17\17$$\5\2C\\aac|\5\2"+
		"\13\13\17\17\"\"\2f\2\3\3\2\2\2\2\5\3\2\2\2\2\7\3\2\2\2\2\t\3\2\2\2\2"+
		"\13\3\2\2\2\2\r\3\2\2\2\2\17\3\2\2\2\2\21\3\2\2\2\2\23\3\2\2\2\2\25\3"+
		"\2\2\2\2\27\3\2\2\2\2\31\3\2\2\2\3\34\3\2\2\2\5 \3\2\2\2\7\64\3\2\2\2"+
		"\t:\3\2\2\2\13<\3\2\2\2\r>\3\2\2\2\17@\3\2\2\2\21B\3\2\2\2\23E\3\2\2\2"+
		"\25J\3\2\2\2\27U\3\2\2\2\31Y\3\2\2\2\33\35\t\2\2\2\34\33\3\2\2\2\35\36"+
		"\3\2\2\2\36\34\3\2\2\2\36\37\3\2\2\2\37\4\3\2\2\2 &\7$\2\2!%\n\3\2\2\""+
		"#\7^\2\2#%\7$\2\2$!\3\2\2\2$\"\3\2\2\2%(\3\2\2\2&$\3\2\2\2&\'\3\2\2\2"+
		"\')\3\2\2\2(&\3\2\2\2)*\7$\2\2*\6\3\2\2\2+,\7v\2\2,-\7t\2\2-.\7w\2\2."+
		"\65\7g\2\2/\60\7h\2\2\60\61\7c\2\2\61\62\7n\2\2\62\63\7u\2\2\63\65\7g"+
		"\2\2\64+\3\2\2\2\64/\3\2\2\2\65\b\3\2\2\2\66;\5\13\6\2\67;\5\r\7\28;\5"+
		"\17\b\29;\5\21\t\2:\66\3\2\2\2:\67\3\2\2\2:8\3\2\2\2:9\3\2\2\2;\n\3\2"+
		"\2\2<=\7,\2\2=\f\3\2\2\2>?\7\61\2\2?\16\3\2\2\2@A\7-\2\2A\20\3\2\2\2B"+
		"C\7/\2\2C\22\3\2\2\2DF\t\4\2\2ED\3\2\2\2FG\3\2\2\2GE\3\2\2\2GH\3\2\2\2"+
		"H\24\3\2\2\2IK\t\5\2\2JI\3\2\2\2KL\3\2\2\2LJ\3\2\2\2LM\3\2\2\2MN\3\2\2"+
		"\2NO\b\13\2\2O\26\3\2\2\2PR\7\17\2\2QP\3\2\2\2QR\3\2\2\2RS\3\2\2\2SV\7"+
		"\f\2\2TV\7\17\2\2UQ\3\2\2\2UT\3\2\2\2VW\3\2\2\2WU\3\2\2\2WX\3\2\2\2X\30"+
		"\3\2\2\2YZ\7?\2\2Z\32\3\2\2\2\r\2\36$&\64:GLQUW\3\b\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}