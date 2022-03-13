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

function main() {
  const file_name = argv[3]; // TODO: brittle
  const program = fs.readFileSync(file_name, "utf8");

  const parsed_program = parse(program);
  sanitize(parsed_program);

  try {
    const evaluated_program = evaluate(parsed_program);
    console.log("BabyJulia >", evaluated_program);
  } catch (err) {
    console.log(err.message);
  }
}
main();
