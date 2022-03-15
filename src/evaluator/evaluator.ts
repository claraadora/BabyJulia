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
  StructDefinition,
  StructField,
  FieldAccess,
  BinaryExpression,
  is_number,
  Arr,
  IndexAccess,
  Value,
  is_func_val_and_type,
  is_var_val_and_type,
} from "./../types/types";
import * as _ from "lodash";
import { TypeGraph } from "../type_graph/type_graph";
import { EnvStack } from "../environment/environment";

const ANY = "Any";
const RETURN_VALUE_TAG = "return_value";

const type_graph = new TypeGraph();
let env = new EnvStack();
env.setup();

const obj_to_runtime_types: {
  [objref: string]: string;
} = {};

export const evaluate = (node: Node): Value | void => {
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
    case "StructDefinition":
      return evaluate_struct_definition(node);
    case "FieldAccess":
      return evaluate_field_access(node);
    case "AbstractTypeDeclaration":
      return evaluate_abstract_type_declaration(node);
    case "ReturnStatement":
      return evaluate_return_statement(node);
    case "PrintExpression":
      return console.log(evaluate(node.expr));
    case "BinaryExpression":
      return evaluate_binary_expression(node);
    case "Arr":
      return evaluate_array(node);
    case "IndexAccess":
      return evaluate_index_access(node);
    default:
  }
};

const scan_out_names = (node: ExpressionSequence) => {
  return node.expressions
    .filter((expr) => is_declaration(expr))
    .map(
      (expr: FunctionDefinition | VariableDefinition | StructDefinition) =>
        expr.name
    );
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

function is_constructor_function(name: string) {
  return name in type_graph.node_map;
}

function construct(name: string, arg_vals: (Primitive | Object)[]) {
  const funcValAndType = env.lookup_fnames(name)[0];
  const arg_types = arg_vals.map((arg: any) => get_runtime_type(arg));

  const invalid_arg_types = arg_types.filter(
    (arg_type, idx) =>
      type_graph.get_distance_from(
        arg_type,
        funcValAndType.param_types[idx]
      ) === -1 // can't find path from arg type to param type
  );

  if (invalid_arg_types.length > 0)
    throw new Error("Invalid arguments to constructor!");

  const func = funcValAndType.value as Function;
  return func(...arg_vals);
}

function apply(name: string, arg_vals: (Primitive | Object)[]) {
  const potential_funcs = env.lookup_fnames(name);

  // Dispatch to constructor.
  if (is_constructor_function(name)) {
    return construct(name, arg_vals);
  }

  // Dispatch to underlying javascript.
  if (is_var_val_and_type(potential_funcs[0])) {
    return (potential_funcs[0].value as Function)(...arg_vals);
  }

  // Get the most specific function.
  const arg_types = arg_vals.map((arg: any) => get_runtime_type(arg));
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

function make_constructor_function(fields: StructField[]) {
  const field_names = fields.map((field) => field.name);
  const field_names_string = field_names.join(",");
  return new Function(...field_names, `return {${field_names_string}}`);
}

// Struct definition.
function evaluate_struct_definition(node: StructDefinition) {
  // Add to type graph.
  type_graph.add_node(node.name, node.super_type_name ?? ANY);

  // Create and add constructor function.
  const constructor_func = make_constructor_function(node.fields);
  const param_types = node.fields.map((field) => field.atype ?? ANY);
  const param_names = node.fields.map((field) => field.name);
  env.assign_fname(
    node.name,
    constructor_func,
    param_types,
    param_names,
    node.name,
    env.clone()
  );
}

// Field access.
function evaluate_field_access(node: FieldAccess) {
  const obj = env.lookup_name(node.objName).value as Object;
  return obj[node.fieldName];
}

// Abstract type declaration.
const evaluate_abstract_type_declaration = (node: AbstractTypeDeclaration) => {
  type_graph.add_node(node.name, node.super_type_name ?? ANY);
};

// Binary expression.
const evaluate_binary_expression = (node: BinaryExpression): number => {
  const left = evaluate(node.left);
  const right = evaluate(node.right);

  if (!is_number(left) || !is_number(right)) {
    throw new Error("Invalid binary expression operand type(s)");
  }

  switch (node.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "^":
      return Math.pow(left, right);
    default:
      throw new Error("Invalid binary expression!");
  }
};

// Array
const evaluate_array = (node: Arr): Array<Value> => {
  return is_two_d_array(node)
    ? evaluate_two_d_array(node)
    : evaluate_one_d_array(node);
};

const is_two_d_array = (node: Arr): boolean => {
  return Array.isArray(node.value[0]);
};

const evaluate_one_d_array = (node: Arr): Array<Value> => {
  return node.value.map((element) => evaluate(element as Expression) as Value);
};

const evaluate_two_d_array = (node: Arr): Array<Array<Value>> => {
  const eval_result_array = [] as Value[][];
  const num_rows = node.value.length;
  const num_cols = (node.value[0] as Array<Expression>).length;

  for (let i = 0; i < num_rows; i++) {
    eval_result_array[i] = [];
    for (let j = 0; j < num_cols; j++) {
      eval_result_array[i][j] = evaluate(node.value[i][j]) as Value;
    }
  }

  return eval_result_array;
};

// Index access.
function evaluate_index_access(node: IndexAccess) {
  const arr = env.lookup_name(node.name).value as Array<Value>;
  const is_2D = Array.isArray(arr[0]);

  const start_idx = evaluate(node.start_idx) as number;
  const end_idx = is_2D ? (evaluate(node.end_idx!) as number) : null;

  // Check validity of start_idx.
  if (start_idx <= 0 || start_idx > arr.length) {
    throw new Error("Index out of bounds!");
  }

  // Check validity of end_idx.
  if (end_idx && (end_idx <= 0 || end_idx > Object.keys(arr[0]).length)) {
    throw new Error("Index out of bounds!");
  }

  // Check validity of index access.
  if (!is_2D && node.end_idx) {
    throw new Error("Invalid 1D array index access!");
  }

  return is_2D && end_idx
    ? arr[start_idx - 1][end_idx - 1]
    : arr[start_idx - 1];
}
