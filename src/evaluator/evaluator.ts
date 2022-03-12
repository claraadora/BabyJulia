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
  Expression,
} from "./../types/types";
import * as _ from "lodash";
import { TypeGraph } from "../type_graph/type_graph";
import { EnvStack } from "../environment/environment";

const ANY = "Any";
const RETURN_VALUE_TAG = "return_value";

const type_graph = new TypeGraph();
let env = new EnvStack();

const obj_to_runtime_types: {
  [objref: string]: string;
} = {};

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
    case "FunctionApplication":
      return apply(node.name, list_of_values(node.args));
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

const list_of_values = (expressions: Expression[]): (Primitive | Object)[] => {
  return expressions.map((expr) => evaluate(expr) as Primitive | Object);
};

const get_runtime_type = (value: any) => {
  const type = typeof value;

  switch (type) {
    case typeof 1:
      return "Int64";
    case typeof true:
      return "Bool";
    case typeof "string":
      return "String";
    case typeof {}:
      return obj_to_runtime_types[value];
    default:
      throw new Error("Can't find type!");
  }
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
  return env.lookup_name(node.name).value as Primitive | Object;
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
    node.params.map((param) => param.name),
    node.return_type ?? ANY,
    env.clone()
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

// Function Application
function get_specificity_score(arg_types: string[], param_types: string[]) {
  let specificity_score = 0;
  for (let i = 0; i < param_types.length; i++) {
    const distance = type_graph.get_distance_from(arg_types[i], param_types[i]);
    if (distance === -1) return -1;
    specificity_score += distance;
  }
  return specificity_score;
}

function get_most_specific_function(
  funcs: FuncValAndType[],
  arg_types: string[]
) {
  const func_scores = funcs
    .map((func: FuncValAndType) => func.param_types)
    .map((param_types) => get_specificity_score(arg_types, param_types))
    .map((score) => (score < 0 ? Number.MAX_VALUE : score)); // Mark the functions that do not match.

  const min_score = Math.min(...func_scores);

  if (min_score === Number.MAX_VALUE) throw new Error("No function found");

  // Check if there are more than one "most" specific functions.
  const score_count = _.countBy(func_scores);
  if (score_count[min_score] > 1)
    throw new Error("Can't have two equally specific functions.");

  // Get the function.
  const most_specific_func_idx = func_scores.indexOf(min_score);
  return funcs[most_specific_func_idx];
}

function apply(name: string, arg_vals: (Primitive | Object)[]) {
  // Get the most specific function.
  const arg_types = arg_vals.map((arg: any) => get_runtime_type(arg));
  const potential_funcs = env.lookup_fnames(name);
  const func = get_most_specific_function(potential_funcs, arg_types);

  // Extend environment.
  func.env_stack.extend(func.param_names);

  // Assign arg values to parameter names.
  func.param_names.forEach((param_name, index) =>
    func.env_stack.assign_name(
      param_name,
      arg_vals[index],
      func.param_types[index]
    )
  );

  // TODO: quite hackish haha
  const env_to_restore = env;
  env = func.env_stack;
  const eval_result = evaluate(func.value as Node);
  env = env_to_restore;
  return eval_result;
}
// TODO: add struct definition here

// Abstract type declaration.
const evaluate_abstract_type_declaration = (node: AbstractTypeDeclaration) => {
  type_graph.add_node(node.name, node.super_type_name ?? ANY);
};
