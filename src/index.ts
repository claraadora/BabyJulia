import { parse } from "./parser/parser";
import * as fs from "fs";
import { argv } from "process";
import { evaluate } from "./evaluator/evaluator";

function main() {
  const file_name = argv[3]; // TODO: brittle
  const program = fs.readFileSync(file_name, "utf8");

  const parsed_program = parse(program);
  // console.log(JSON.stringify(parsed_program, null, 4));
  try {
    const evaluated_program = evaluate(parsed_program);
    console.log("evaluated_program:", evaluated_program);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }

}
main();
