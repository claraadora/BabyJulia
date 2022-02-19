import { parse } from "./parser/parser";
import * as fs from "fs";
import { argv } from "process";

function main() {
  const file_name = argv[3]; // TODO: brittle
  const file_content = fs.readFileSync(file_name, "utf8");

  const parsed_program = parse(file_content);
  console.log(parsed_program);
}
main();
