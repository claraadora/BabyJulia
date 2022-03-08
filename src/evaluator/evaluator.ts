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

const type_graph = new TypeGraph();
const env = new Environment(type_graph);
const ANY = "any";

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
  return env.lookup_name(node.name, false);
};

// TODO: add field access here.

// Variable definition.
const evaluate_variable_declaration = (node: VariableDefinition) => {
  const evalResult = evaluate(node.expr);

  if (is_primitive(evalResult)) {
    env.upsert_;
    /* TODO: 1) FuncApp from FuncDef, 2) FuncApp from StructDef, 3) FieldAccess */
  } else {
  }

  return undefined;
};

// Function definition.
const evaluate_function_definition = (node: FunctionDefinition) => {
  const funcValAndType: FuncValAndType = {
    value: node.body,
    type: {
      param_types: [],
      return_type: "",
    },
  };

  // Set type.param_types, if any.
  funcValAndType.type.param_types = node.params.map(
    (param) => param.atype ?? ANY
  );

  // Set type.return_type, if any.
  // Differentiate between 1) return a value of type undefined, 2) not have any return value
  funcValAndType.type.return_type = node.return_type ?? ANY;

  // Extend the previous func definition if func previously defined
  if (node.name in global_env) {
    global_env[node.name].push(funcValAndType);
  } else {
    global_env[node.name] = [funcValAndType];
  }

  return undefined;
};

const RETURN_VALUE_TAG = "return_value";

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
function is_declaration(expr: Expression): unknown {
  throw new Error("Function not implemented.");
}

function is_variable_definition(def: VariableDefinition | FunctionDefinition) {
  throw new Error("Function not implemented.");
}

function isPrimitive(evalResult: string | number | boolean | void | Object) {
  throw new Error("Function not implemented.");
}
