import {
  Name,
  VariableDeclaration,
  Literal,
  Node,
  ExpressionSequence,
  Struct,
} from "./../types/types";
import * as _ from "lodash";
import { arrayBuffer } from "stream/consumers";

const global_env = {};
type Primitive = number | boolean | string;

export const evaluate = (node: Node): Primitive | void => {
  switch (node?.type) {
    case "ExpressionSequence":
      return evaluate_sequence(node);
    case "Literal":
      return evaluate_literal(node);
    case "VariableDeclaration":
      return evaluate_variable_declaration(node);
    case "Name":
      return evaluate_name(node);
    case "Struct":
      return evaluate_struct(node);
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
const evaluate_variable_declaration = (node: VariableDeclaration) => {
  global_env[node.name] = node.value;
  return undefined;
};

const evaluate_struct = (node: Struct) => {
  for (let i = 0; i < node.fields.length; i++) { 
    // global_env is a placeholder
    set_type(node.name, node.fields[i].name, node.fields[i].atype, global_env);
  }
  // console.log("*** EVAL struct:", global_env[node.name]);
  return undefined;
};


// set_type is used for type declarations to
// set the type of a given symbol in the first 
// (innermost) frame of the given environment

const set_type = (structName: string, symbol: String, atype: String = "", env: {}) => {
   env[structName] = [symbol, atype];
}


