import {
  Name,
  VariableDefinition,
  Node,
  ExpressionSequence,
  FuncValAndType,
  Primitive,
  FunctionDefinition,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
  ReturnStatement,
  EvaluatedReturnStatement,
  AbstractTypeDeclaration,
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
  is_var_val_and_type,
  ForLoop,
  Block,
  is_string,
  RelationalExpression,
  ConditionalExpression,
  is_float,
  is_struct_definition,
  Type,
  PlainType,
  ArrElementAssignment,
} from "./../types/types";
import * as _ from "lodash";
import { TypeGraph, TypeUtil } from "../type_graph/type_graph";
import { EnvStack } from "../environment/environment";

// Constants.
const ANY = "Any";
const RETURN_VALUE_TAG = "return_value";

// Type graph.
let type_graph = new TypeGraph();

// Environment.
let env = new EnvStack();
env.setup();

// Object to runtime types.
let obj_to_runtime_types = new Map<
  string,
  { base_name: string; tv_name: string }
>();

export const evaluate = (node: Node): Value | void => {
  switch (node?.ntype) {
    case "Block":
      return evaluate_block(node);
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
    case "ForLoop":
      return evaluate_for_loop(node);
    case "RelationalExpression":
      return evaluate_relational_expression(node);
    case "ConditionalExpression":
      return evaluate_conditional_expression(node);
    case "ArrElementAssignment":
      return evaluate_arr_element_assignment(node);
    default:
  }
};

const scan_out_names = (node: ForLoop | ExpressionSequence) => {
  if (node.ntype === "ForLoop") {
    return [node.name];
  } else {
    return node.expressions
      .filter((expr) => is_declaration(expr))
      .map((expr: FunctionDefinition | VariableDefinition | StructDefinition) =>
        is_struct_definition(expr)
          ? TypeUtil.get_base_name(expr.type)
          : expr.name
      );
  }
};

const list_of_values = (expressions: Expression[]): (Primitive | Object)[] => {
  return expressions.map((expr) => evaluate(expr) as Primitive | Object);
};

const get_runtime_type = (value: any): string => {
  const type = typeof value;

  if (Array.isArray(value)) {
    return "Vector";
  }

  if (value === undefined) {
    return "Nothing";
  }

  switch (type) {
    case typeof 1:
      return is_float(value) ? "Float64" : "Int64";
    case typeof true:
      return "Bool";
    case typeof "string":
      return "String";
    case typeof {}:
      const rtype = obj_to_runtime_types.get(value)?.base_name; // TODO

      if (!rtype) {
        throw new Error(`Can't find object type ${value}!`);
      }
      return rtype;
    default:
      throw new Error(`Can't find type ${value}!`);
  }
};

// Block.
const evaluate_block = (node: Block) => {
  env.extend(scan_out_names(node.node));
  const evaluation_result = evaluate(node.node);
  env.pop();
  return evaluation_result;
};

// Expressions.
const evaluate_sequence = (node: ExpressionSequence) => {
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
  return is_float(node.value) ? parseFloat(node.value) : parseInt(node.value);
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

const throw_if_invalid_variable_declaration = (
  old_atype: Type | null,
  new_atype: Type | null,
  new_rtype: Type
) => {
  if (old_atype) {
    if (new_atype) {
      throw new Error("Multiple type declaration is not allowed.");
    } else if (!type_graph.is_subtype_of(new_rtype, old_atype)) {
      throw new Error(
        `Cannot convert an object of type ${new_rtype} to ${old_atype}`
      );
    }
  } else if (new_atype) {
    if (!type_graph.is_subtype_of(new_rtype, new_atype)) {
      throw new Error(
        `Cannot convert an object of type ${new_rtype} to ${new_atype}`
      );
    }
  }
};
// Variable definition.
const evaluate_variable_declaration = (node: VariableDefinition) => {
  const eval_result = evaluate(node.expr);

  let vnt = env.lookup_name(node.name);

  if (is_var_val_and_type(vnt)) {
    throw_if_invalid_variable_declaration(
      vnt.type,
      node.atype,
      get_runtime_type(eval_result)
    );
  }
  env.assign_name(node.name, eval_result!, node.atype);
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
function get_specificity_score(arg_types: Type[], param_types: Type[]) {
  // Functions don't match if they have different number of parameters.
  if (arg_types.length !== param_types.length) {
    return Number.MAX_VALUE;
  }
  let specificity_score = 0;
  for (let i = 0; i < param_types.length; i++) {
    const distance = type_graph.get_distance_from(arg_types[i], param_types[i]);
    if (distance === Number.MAX_VALUE) return Number.MAX_VALUE;
    specificity_score += distance;
  }
  return specificity_score;
}

function get_most_specific_function(
  funcs: FuncValAndType[],
  arg_types: Type[]
) {
  const func_scores = funcs
    .map((func: FuncValAndType) => func.param_types)
    .map((param_types) => get_specificity_score(arg_types, param_types));

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
  const arg_types = arg_vals.map((arg: any) => get_runtime_type(arg)); // A{T}

  const invalid_arg_types = arg_types.filter(
    (arg_type, idx) =>
      type_graph.get_distance_from(
        arg_type as PlainType, // TODO: currently arg type cmn bisa plain type.
        funcValAndType.param_types[idx]
      ) === -1 // can't find path from arg type to param type
  );

  if (invalid_arg_types.length > 0)
    throw new Error("Invalid arguments to constructor!");

  const func = funcValAndType.value as Function;
  const obj = func(...arg_vals);

  // Update obj runtime type.
  obj_to_runtime_types.set(obj, {
    base_name: name,
    tv_name: "TODO",
  });
  return obj;
}

function apply(name: string, arg_vals: (Primitive | Object)[]) {
  const potential_funcs = env.lookup_fnames(name);

  // Dispatch to constructor.
  if (is_constructor_function(name)) {
    return construct(name, arg_vals);
  }

  // Dispatch to underlying javascript function.
  if (is_var_val_and_type(potential_funcs[0])) {
    return (potential_funcs[0].value as Function)(...arg_vals);
  }

  // Get the most specific function.
  const arg_types = arg_vals.map((arg: any) => get_runtime_type(arg));
  const func = get_most_specific_function(
    potential_funcs,
    arg_types as PlainType[]
  );

  // Extend environment.
  func.env_stack.extend(
    _.union(func.param_names, scan_out_names(func.value as ExpressionSequence))
  );

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

  // if function has atype, check runtime type of eval_result against the func.atype
  const eval_result_runtime_type = get_runtime_type(eval_result);
  if (
    func.return_type &&
    type_graph.get_distance_from(
      eval_result_runtime_type!,
      func.return_type
    ) === Number.MAX_VALUE // result type not <: atype
  ) {
    throw new Error(
      `The atype of function ${name} is ${func.return_type}, but it returns value of type ${eval_result_runtime_type}`
    );
  }

  env = env_to_restore;
  return eval_result;
}

// TODO
function check_func_return_type_against_atype() {
  // If atype is string
  // If atype is union
}

function make_constructor_function(fields: StructField[]) {
  const field_names = fields.map((field) => field.name);
  const field_names_string = field_names.join(",");
  return new Function(...field_names, `return {${field_names_string}}`);
}

// Struct definition.
function evaluate_struct_definition(node: StructDefinition) {
  const struct_name = TypeUtil.get_base_name(node.type);
  let super_type = node.super_type;

  if (super_type && TypeUtil.is_union(super_type)) {
    super_type = type_graph.condense_union(super_type);
  }

  // Add to type graph.
  type_graph.add_node(
    struct_name,
    super_type ? TypeUtil.get_base_name(super_type) : ANY
  );

  // Create and add constructor function.
  const constructor_func = make_constructor_function(node.fields);
  const param_types = node.fields.map((field) => field.atype ?? ANY);
  const param_names = node.fields.map((field) => field.name);
  env.assign_fname(
    struct_name,
    constructor_func,
    param_types,
    param_names,
    struct_name,
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
  const name_of_type = TypeUtil.get_base_name(node.type);
  let super_type = node.super_type;

  if (super_type && TypeUtil.is_union(super_type)) {
    super_type = type_graph.condense_union(super_type);
  }

  const name_of_super_type = super_type
    ? TypeUtil.get_base_name(super_type)
    : ANY;
  type_graph.add_node(name_of_type, name_of_super_type);
};

// Binary expression.
const evaluate_binary_expression = (
  node: BinaryExpression
): number | string => {
  const left = evaluate(node.left);
  const right = evaluate(node.right);

  // String and String
  if (is_string(left) && is_string(right) && node.operator === "*") {
    return left + "" + right;
  }

  
  // Number and Number
  if (!(is_number(left) && is_number(right))) {
    throw new Error(`Invalid binary expression operand type(s): ${left} ${node.operator} ${right}`);
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

  validate_index_access(arr, start_idx, end_idx);

  return is_2D && end_idx
    ? arr[start_idx - 1][end_idx - 1]
    : arr[start_idx - 1];
}

function validate_index_access(arr: Array<Value>, start_idx: number, end_idx: number | null) {
  const is_2D = Array.isArray(arr[0]);

  // Check validity of start_idx.
  if (start_idx <= 0 || start_idx > arr.length) {
    throw new Error("Index out of bounds!");
  }

  // Check validity of end_idx.
  if (end_idx && (end_idx <= 0 || end_idx > Object.keys(arr[0]).length)) {
    throw new Error("Index out of bounds!");
  }

  // Check validity of index access.
  if (!is_2D && end_idx) {
    throw new Error("Invalid 1D array index access!");
  }
}

// For loop
function evaluate_for_loop(node: ForLoop) {
  const start = evaluate(node.start_idx) as number;
  const end = evaluate(node.end_idx) as number;

  for (let i = start; i <= end; i++) {
    env.assign_name(node.name, i, ANY);
    evaluate(node.body);
  }
}

// Relational expression.
const evaluate_relational_expression = (
  node: RelationalExpression
): boolean => {
  const left = evaluate(node.left);
  const right = evaluate(node.right);

  switch (node.operator) {
    case "==":
      return left === right;
    case "!=":
      return left !== right;
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    default:
      throw new Error("Invalid relational expression!");
  }
};

// Conditional expression.
const evaluate_conditional_expression = (
  node: ConditionalExpression
): Expression => {
  const consequent = evaluate(node.consequent) as Expression;
  const alternative = evaluate(node.alternative) as Expression;

  // TODO: abstract out
  const consequent_runtime_type = get_runtime_type(consequent);
  const alternative_runtime_type = get_runtime_type(alternative);
  if (consequent_runtime_type !== alternative_runtime_type) {
    console.log(`Type unstable!
    Consequent ${consequent} is of type ${consequent_runtime_type},
    whereas alternative ${alternative} is of type ${alternative_runtime_type}`);
  }

  // If predicate doesn't return a boolean, throw error
  const predicate = evaluate(node.predicate);
  const predicate_runtime_type = get_runtime_type(predicate);
  if (predicate_runtime_type !== "Bool") {
    throw new Error(
      `Non-boolean (${predicate_runtime_type}) used in boolean context`
    );
  }

  return predicate ? consequent : alternative;
};

// Array element assignment.
function evaluate_arr_element_assignment(node: ArrElementAssignment) {
  const arr_el = node.arr_el;

  const arr = env.lookup_name(arr_el.name).value as Array<Value>;
  const is_2D = Array.isArray(arr[0]);

  const start_idx = evaluate(arr_el.start_idx) as number;
  const end_idx = is_2D ? (evaluate(arr_el.end_idx!) as number) : null;

  validate_index_access(arr, start_idx, end_idx);

  const value = evaluate(node.expr) as Value;
  if (is_2D && end_idx) {
    arr[start_idx - 1][end_idx - 1] = value;
  } else {
    arr[start_idx - 1] = value;
  }

  return;
}

export const clear_only_if_you_are_sure_and_are_debugging = () => {
  // Type graph.
  type_graph = new TypeGraph();

  // Environment.
  env = new EnvStack();
  env.setup();

  // Object to runtime types.
  obj_to_runtime_types = new Map<
    string,
    { base_name: string; tv_name: string }
  >();
};
