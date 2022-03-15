import { parse } from "./parser/parser";
import * as fs from "fs";
import { argv } from "process";
import { evaluate } from "./evaluator/evaluator";
import * as _ from "lodash";
import { Block, Node, Value } from "./types/types";

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

function pretty_print(value: Value | void) {
  const tabs = typeof value === typeof {} && !Array.isArray(value) ? 1 : 0;
  const chalk = require("chalk");
  const header = chalk.hex("#f4b5f9").bold;
  const result = chalk.hex("#f5ecbb");

  console.log(
    header("BabyJulia > "),
    result(JSON.stringify(value, null, tabs))
  );
}

const make_block = (node: Node): Block => {
  return {
    type: "Block",
    node,
  };
};

function main() {
  const file_name = argv[3]; // TODO: brittle
  const program = fs.readFileSync(file_name, "utf8");

  const parsed_program = parse(program);
  sanitize(parsed_program);

  try {
    const block = make_block(parsed_program);
    const evaluated_program = evaluate(block);
    pretty_print(evaluated_program);
  } catch (err) {
    console.log(err.message);
  }
}
main();
