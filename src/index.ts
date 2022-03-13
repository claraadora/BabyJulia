import { parse } from "./parser/parser";
import * as fs from "fs";
import { argv } from "process";
import { evaluate } from "./evaluator/evaluator";
import * as _ from "lodash";
import { isObject } from "lodash";
import { Expression, ExpressionSequence, Program } from "./types/types";

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

function main() {
  const file_name = argv[3]; // TODO: brittle
  const program = fs.readFileSync(file_name, "utf8");

  const parsed_program = parse(program);
  sanitize(parsed_program);
  // TODO: delete
  console.log("parsed_program:", (parsed_program as Program).expressions);

  try {
    const evaluated_program = evaluate(parsed_program);
    console.log("evaluated_program:", evaluated_program);
  } catch (err) {
    console.log(err.message);
  }
}
main();

