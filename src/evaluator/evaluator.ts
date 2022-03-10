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
  is_declaration,
} from "./../types/types";
import * as _ from "lodash";
import { TypeGraph } from "../type_graph/type_graph";
import { EnvStack } from "../environment/environment";

const ANY = "Any";
const RETURN_VALUE_TAG = "return_value";

const type_graph = new TypeGraph();
const env = new EnvStack();

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

const scan_out_names = (node: ExpressionSequence) => {
  return node.expressions
    .filter((expr) => is_declaration(expr))
    .map((expr: FunctionDefinition | VariableDefinition) => expr.name);
};

// Expressions.
const evaluate_sequence = (node: ExpressionSequence) => {
  // Extend environment.
  env.extend(scan_out_names(node));

  // Evaluate expressions.
  const expressions = node.expressions;
  let last_evaluated_expr;

  for (let expr of expressions) {
    last_evaluated_expr = evaluate(expr);

    if (is_evaluated_return_statement(last_evaluated_expr)) {
      return get_evaluated_return_value(last_evaluated_expr);
    }
  }

  // Pop environment.
  env.pop();

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
  env.assign_name(node.name, eval_result!, node.atype ?? ANY);
};

// Function definition.
const evaluate_function_definition = (node: FunctionDefinition) => {
  env.assign_fname(
    node.name,
    node.body,
    node.params.map((param) => param.atype ?? ANY),
    node.return_type ?? ANY
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
