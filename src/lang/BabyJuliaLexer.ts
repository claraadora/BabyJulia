// Generated from ./src/lang/BabyJulia.g4 by ANTLR 4.9.0-SNAPSHOT

import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { CharStream } from "antlr4ts/CharStream";
import { Lexer } from "antlr4ts/Lexer";
import { LexerATNSimulator } from "antlr4ts/atn/LexerATNSimulator";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

export class BabyJuliaLexer extends Lexer {
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

  // tslint:disable:no-trailing-whitespace
  public static readonly channelNames: string[] = [
    "DEFAULT_TOKEN_CHANNEL",
    "HIDDEN",
  ];

  // tslint:disable:no-trailing-whitespace
  public static readonly modeNames: string[] = ["DEFAULT_MODE"];

  public static readonly ruleNames: string[] = [
    "NUMBER",
    "STRING",
    "BOOL",
    "BIN_OP",
    "MUL",
    "DIV",
    "ADD",
    "SUB",
    "NAME",
    "WHITESPACE",
    "NEWLINE",
    "ASSIGN",
  ];

  private static readonly _LITERAL_NAMES: Array<string | undefined> = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    "'*'",
    "'/'",
    "'+'",
    "'-'",
    undefined,
    undefined,
    undefined,
    "'='",
  ];
  private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
    undefined,
    "NUMBER",
    "STRING",
    "BOOL",
    "BIN_OP",
    "MUL",
    "DIV",
    "ADD",
    "SUB",
    "NAME",
    "WHITESPACE",
    "NEWLINE",
    "ASSIGN",
  ];
  public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(
    BabyJuliaLexer._LITERAL_NAMES,
    BabyJuliaLexer._SYMBOLIC_NAMES,
    []
  );

  // @Override
  // @NotNull
  public get vocabulary(): Vocabulary {
    return BabyJuliaLexer.VOCABULARY;
  }
  // tslint:enable:no-trailing-whitespace

  constructor(input: CharStream) {
    super(input);
    this._interp = new LexerATNSimulator(BabyJuliaLexer._ATN, this);
  }

  // @Override
  public get grammarFileName(): string {
    return "BabyJulia.g4";
  }

  // @Override
  public get ruleNames(): string[] {
    return BabyJuliaLexer.ruleNames;
  }

  // @Override
  public get serializedATN(): string {
    return BabyJuliaLexer._serializedATN;
  }

  // @Override
  public get channelNames(): string[] {
    return BabyJuliaLexer.channelNames;
  }

  // @Override
  public get modeNames(): string[] {
    return BabyJuliaLexer.modeNames;
  }

  public static readonly _serializedATN: string =
    "\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\x0E[\b\x01\x04" +
    "\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
    "\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
    "\x03\x02\x06\x02\x1D\n\x02\r\x02\x0E\x02\x1E\x03\x03\x03\x03\x03\x03\x03" +
    "\x03\x07\x03%\n\x03\f\x03\x0E\x03(\v\x03\x03\x03\x03\x03\x03\x04\x03\x04" +
    "\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x045\n\x04" +
    "\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05;\n\x05\x03\x06\x03\x06\x03\x07" +
    "\x03\x07\x03\b\x03\b\x03\t\x03\t\x03\n\x06\nF\n\n\r\n\x0E\nG\x03\v\x06" +
    "\vK\n\v\r\v\x0E\vL\x03\v\x03\v\x03\f\x05\fR\n\f\x03\f\x03\f\x06\fV\n\f" +
    "\r\f\x0E\fW\x03\r\x03\r\x02\x02\x02\x0E\x03\x02\x03\x05\x02\x04\x07\x02" +
    "\x05\t\x02\x06\v\x02\x07\r\x02\b\x0F\x02\t\x11\x02\n\x13\x02\v\x15\x02" +
    "\f\x17\x02\r\x19\x02\x0E\x03\x02\x06\x03\x022;\x05\x02\f\f\x0F\x0F$$\x05" +
    '\x02C\\aac|\x05\x02\v\v\x0F\x0F""\x02f\x02\x03\x03\x02\x02\x02\x02\x05' +
    "\x03\x02\x02\x02\x02\x07\x03\x02\x02\x02\x02\t\x03\x02\x02\x02\x02\v\x03" +
    "\x02\x02\x02\x02\r\x03\x02\x02\x02\x02\x0F\x03\x02\x02\x02\x02\x11\x03" +
    "\x02\x02\x02\x02\x13\x03\x02\x02\x02\x02\x15\x03\x02\x02\x02\x02\x17\x03" +
    "\x02\x02\x02\x02\x19\x03\x02\x02\x02\x03\x1C\x03\x02\x02\x02\x05 \x03" +
    "\x02\x02\x02\x074\x03\x02\x02\x02\t:\x03\x02\x02\x02\v<\x03\x02\x02\x02" +
    "\r>\x03\x02\x02\x02\x0F@\x03\x02\x02\x02\x11B\x03\x02\x02\x02\x13E\x03" +
    "\x02\x02\x02\x15J\x03\x02\x02\x02\x17U\x03\x02\x02\x02\x19Y\x03\x02\x02" +
    "\x02\x1B\x1D\t\x02\x02\x02\x1C\x1B\x03\x02\x02\x02\x1D\x1E\x03\x02\x02" +
    "\x02\x1E\x1C\x03\x02\x02\x02\x1E\x1F\x03\x02\x02\x02\x1F\x04\x03\x02\x02" +
    '\x02 &\x07$\x02\x02!%\n\x03\x02\x02"#\x07^\x02\x02#%\x07$\x02\x02$!\x03' +
    "\x02\x02\x02$\"\x03\x02\x02\x02%(\x03\x02\x02\x02&$\x03\x02\x02\x02&'" +
    "\x03\x02\x02\x02')\x03\x02\x02\x02(&\x03\x02\x02\x02)*\x07$\x02\x02*" +
    "\x06\x03\x02\x02\x02+,\x07v\x02\x02,-\x07t\x02\x02-.\x07w\x02\x02.5\x07" +
    "g\x02\x02/0\x07h\x02\x0201\x07c\x02\x0212\x07n\x02\x0223\x07u\x02\x02" +
    "35\x07g\x02\x024+\x03\x02\x02\x024/\x03\x02\x02\x025\b\x03\x02\x02\x02" +
    "6;\x05\v\x06\x027;\x05\r\x07\x028;\x05\x0F\b\x029;\x05\x11\t\x02:6\x03" +
    "\x02\x02\x02:7\x03\x02\x02\x02:8\x03\x02\x02\x02:9\x03\x02\x02\x02;\n" +
    "\x03\x02\x02\x02<=\x07,\x02\x02=\f\x03\x02\x02\x02>?\x071\x02\x02?\x0E" +
    "\x03\x02\x02\x02@A\x07-\x02\x02A\x10\x03\x02\x02\x02BC\x07/\x02\x02C\x12" +
    "\x03\x02\x02\x02DF\t\x04\x02\x02ED\x03\x02\x02\x02FG\x03\x02\x02\x02G" +
    "E\x03\x02\x02\x02GH\x03\x02\x02\x02H\x14\x03\x02\x02\x02IK\t\x05\x02\x02" +
    "JI\x03\x02\x02\x02KL\x03\x02\x02\x02LJ\x03\x02\x02\x02LM\x03\x02\x02\x02" +
    "MN\x03\x02\x02\x02NO\b\v\x02\x02O\x16\x03\x02\x02\x02PR\x07\x0F\x02\x02" +
    "QP\x03\x02\x02\x02QR\x03\x02\x02\x02RS\x03\x02\x02\x02SV\x07\f\x02\x02" +
    "TV\x07\x0F\x02\x02UQ\x03\x02\x02\x02UT\x03\x02\x02\x02VW\x03\x02\x02\x02" +
    "WU\x03\x02\x02\x02WX\x03\x02\x02\x02X\x18\x03\x02\x02\x02YZ\x07?\x02\x02" +
    "Z\x1A\x03\x02\x02\x02\r\x02\x1E$&4:GLQUW\x03\b\x02\x02";
  public static __ATN: ATN;
  public static get _ATN(): ATN {
    if (!BabyJuliaLexer.__ATN) {
      BabyJuliaLexer.__ATN = new ATNDeserializer().deserialize(
        Utils.toCharArray(BabyJuliaLexer._serializedATN)
      );
    }

    return BabyJuliaLexer.__ATN;
  }
}
