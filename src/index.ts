import { parse } from "./parser/parser";
import * as fs from "fs";
import { argv } from "process";
import { evaluate } from "./evaluator/evaluator";
import { sanitize, format_2d_array } from "./sanitize";
import * as _ from "lodash";
import { Value } from "./types/types";

function pretty_print(value: Value | void) {
  const tabs = typeof value === typeof {} && !Array.isArray(value) ? 1 : 0;
  const chalk = require("chalk");
  const header = chalk.hex("#f4b5f9").bold;
  const result = chalk.hex("#f5ecbb");

  if (Array.isArray(value[0])) {
    value = format_2d_array(value as Value[]);
  }

  console.log(
    header("BabyJulia > "),
    result(JSON.stringify(value, null, tabs))
  );
}

function main() {
  const file_name = argv[3]; // TODO: brittle
  const program = fs.readFileSync(file_name, "utf8");

  const parsed_program = parse(program);
  sanitize(parsed_program);
  try {
    const evaluated_program = evaluate(parsed_program);
    pretty_print(evaluated_program);
  } catch (err) {
    console.log(err.message);
  }
}
main();
