import { parse } from "./parser/parser";
import * as fs from "fs";
import { argv } from "process";
import { evaluate } from "./evaluator/evaluator";
import * as _ from "lodash";

function sanitize(node: any) {
  if (!_.isObject(node)) {
    return;
  }

  for (let key in node) {
    if (_.isArray(node[key])) {
      node[key] = node[key].filter((val: any) => val);
      node[key].forEach((val: any) => sanitize(val));
    } else {
      sanitize(node[key]);
    }
  }
}

const chalk = require("chalk");
const header = chalk.hex("#f4b5f9").bold;
const result = chalk.hex("#f5ecbb");

function main() {
  const file_name = argv[3]; // TODO: brittle
  const program = fs.readFileSync(file_name, "utf8");

  const parsed_program = parse(program);
  sanitize(parsed_program);

  try {
    const evaluated_program = evaluate(parsed_program);
    console.log(
      header("BabyJulia > "),
      result(JSON.stringify(evaluated_program, null, 1))
    );
  } catch (err) {
    console.log(err.message);
  }
}
main();
