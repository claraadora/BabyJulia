import {
  Name,
  VariableDefinition,
  Literal,
  Node,
  ExpressionSequence,
  Environment,
  ValAndType,
  VarValAndType,
  FuncValAndType,
  Primitive
} from "./../types/types";
import * as _ from "lodash";

const global_env:Environment = {};

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
  return node.value;
};

const evaluate_name = (node: Name): string => {
  return node.name;
};

const evaluate_variable_declaration = (node: VariableDefinition) => {
  switch (node.expr.type) {
    case "Literal": // e.g. x = 3 or x::Int64 = 100 
      const varValAndType = {
        value: evaluate_literal(node.expr as Literal),
        type: node.atype as string,
      } as VarValAndType;

      // Replace the previous var definition
      global_env[node.name] = [varValAndType];
    case "FunctionApplication": // e.g. foo = Foo("a", 1, true)
      
    default:
  }

  console.log(node.name," : ", global_env[node.name]);
  return undefined;
};
