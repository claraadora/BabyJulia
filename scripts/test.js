const glob = require("glob");
const fs = require("fs");
const sanitizer = require("../dist/sanitize");
const parser = require("../dist/parser/parser");
const evaluator = require("../dist/evaluator/evaluator");

glob("examples/*.jl", (err, files) => {
  // For every example file, construct a [test_file, expected_output_file]
  const suite = files.map((file) => {
    const test_name = file.match(/^examples\/(.+)\.jl$/);
    return [file, `examples/${test_name[1]}_expected.txt`];
  });

  for (const [file, expected_file] of suite) {
    console.log("*******************************************");
    console.log(`running test ${file}...`);
    try {
      const program = fs.readFileSync(file, "utf8");
      const parsed_program = parser.parse(program);
      sanitizer.sanitize(parsed_program);

      // Clear data structures used in evaluator.
      evaluator.clear_only_if_you_are_sure_and_are_debugging();
      const output = evaluator.evaluate(parsed_program);
      const output_str = JSON.stringify(output, null, 0);
      const expected_str = fs.readFileSync(expected_file, "utf8");

      if (output_str === expected_str) {
        console.log(`test ${file} passed :D`);
      } else {
        console.log(`output  : ${output_str}`);
        console.log(`expected: ${expected_str}`);
        throw new Error(`test ${file} output not the same :(`);
      }
    } catch (e) {
      console.log(`${e}`);
      console.log(`test ${file} failed :(`);
    }
  }
});
