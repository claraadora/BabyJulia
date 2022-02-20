import {
  Name,
  VariableDeclaration,
  Literal,
  Node,
  ExpressionSequence,
} from "./../types/types";
import * as _ from "lodash";

const global_env = {};
type Primitive = number | boolean | string;

export const evaluate = (node: Node): Primitive | void => {
  console.log(node?.type);
  switch (node?.type) {
    case "ExpressionSequence":
      return evaluate_sequence(node);
    case "Literal":
      return evaluate_literal(node);
    case "VariableDeclaration":
      return evaluate_variable_declaration(node);
    case "Name":
      return evaluate_name(node);
    default:
  }
};

const evaluate_sequence = (node: ExpressionSequence) => {
  const expressions = node.expressions.filter((expr) => expr);
  const evaluated_exprs = expressions.map((expr) => evaluate(expr));
  console.log(evaluated_exprs);
  return _.last(evaluated_exprs);
};

const evaluate_literal = (node: Literal): Primitive => {
  return parseInt(node.value);
};
const evaluate_name = (node: Name): Primitive => {
  console.log(`looking up ${node.name}. value is ${global_env[node.name]}`);
  return global_env[node.name];
};
const evaluate_variable_declaration = (node: VariableDeclaration) => {
  console.log(`mapping ${node.name} to ${node.value}`);
  global_env[node.name] = node.value;
};
