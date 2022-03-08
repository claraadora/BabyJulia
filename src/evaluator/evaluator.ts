import {
  Name,
  VariableDefinition,
  Node,
  ExpressionSequence,
  VarValAndType,
  FuncValAndType,
  Primitive,
  FunctionDefinition,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
  ReturnStatement,
  EvaluatedReturnStatement,
  AbstractTypeDeclaration,
  ValAndType,
  is_primitive,
} from "./../types/types";
import * as _ from "lodash";
import { Environment } from "../environment/environment";
import { TypeGraph } from "../type_graph/type_graph";

const ANY = "any";
const RETURN_VALUE_TAG = "return_value";

const type_graph = new TypeGraph();
const env = new Environment(type_graph);

export const evaluate = (node: Node): Primitive | Object | void => {
  switch (node?.type) {
    case "ExpressionSequence":
      return evaluate_sequence(node);
    case "NumberLiteral":
      return evaluate_number_literal(node);
    case "StringLiteral":
      return evaluate_string_literal(node);
    case "BooleanLiteral":
      return evaluate_boolean_literal(node);
    case "Name":
      return evaluate_name(node);
    case "VariableDefinition":
      return evaluate_variable_declaration(node);
    case "FunctionDefinition":
      return evaluate_function_definition(node);
    case "AbstractTypeDeclaration":
      return evaluate_abstract_type_declaration(node);
    case "ReturnStatement":
      return evaluate_return_statement(node);
    default:
  }
};

// Expressions.
const evaluate_sequence = (node: ExpressionSequence) => {
  // Extend environment.
  env.extend_env(node);

  // Evaluate expressions.
  const expressions = node.expressions;
  let last_evaluated_expr;

  for (let expr of expressions) {
    last_evaluated_expr = evaluate(expr);

    if (is_evaluated_return_statement(last_evaluated_expr)) {
      return get_evaluated_return_value(last_evaluated_expr);
    }
  }
  return last_evaluated_expr;
};

const evaluate_number_literal = (node: NumberLiteral): number => {
  return parseInt(node.value);
};

const evaluate_string_literal = (node: StringLiteral): string => {
  return node.value;
};

const evaluate_boolean_literal = (node: BooleanLiteral): boolean => {
  return node.value === "true";
};

const evaluate_name = (node: Name): Primitive | Object => {
  return env.lookup_name(node.name);
};

// TODO: add field access here.

// Variable definition.
const evaluate_variable_declaration = (node: VariableDefinition) => {
  const eval_result = evaluate(node.expr);
  env.update_name(node.name, eval_result!);
};

// Function definition.
const evaluate_function_definition = (node: FunctionDefinition) => {
  env.update_signature(
    node.name,
    node.params.map((param) => param.atype ?? ANY),
    node.body
  );
};

function evaluate_return_statement(node: ReturnStatement) {
  return [RETURN_VALUE_TAG, node.expr ? evaluate(node.expr) : undefined];
}

function is_evaluated_return_statement(
  value: any
): value is EvaluatedReturnStatement {
  return (
    _.isArray(value) && value.length === 2 && value[0] === RETURN_VALUE_TAG
  );
}

function get_evaluated_return_value(
  evaluated_return_statement: EvaluatedReturnStatement
) {
  return evaluated_return_statement[1];
}

// TODO: add function application here

// TODO: add struct definition here

// Abstract type declaration.
const evaluate_abstract_type_declaration = (node: AbstractTypeDeclaration) => {
  type_graph.add_node(node.name, node.super_type_name ?? ANY);
};
