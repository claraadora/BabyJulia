import {
  Name,
  VariableDefinition,
  Literal,
  Node,
  ExpressionSequence,
} from "./../types/types";
import * as _ from "lodash";

const global_env = {};
type Primitive = number | boolean | string;

export const evaluate = (node: Node): Primitive | void => {
  switch (node?.type) {
    case "ExpressionSequence":
      return evaluate_sequence(node);
    case "Literal":
      return evaluate_literal(node);
    case "VariableDefinition":
      return evaluate_variable_declaration(node);
    case "Name":
      return evaluate_name(node);
    default:
  }
};

const evaluate_sequence = (node: ExpressionSequence) => {
  const expressions = node.expressions.filter((expr) => expr);
  const evaluated_exprs = expressions.map((expr) => evaluate(expr));
  return _.last(evaluated_exprs);
};

const evaluate_literal = (node: Literal): Primitive => {
  return parseInt(node.value);
};
const evaluate_name = (node: Name): Primitive => {
  return global_env[node.name];
};
const evaluate_variable_declaration = (node: VariableDefinition) => {
  global_env[node.name] = node.expr;
  return undefined;
};
