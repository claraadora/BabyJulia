import {
  Name,
  VariableDefinition,
  Node,
  ExpressionSequence,
  Environment,
  VarValAndType,
  FuncValAndType,
  Primitive,
  FunctionApplication,
  FunctionDefinition,
  ValAndType,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
} from "./../types/types";
import * as _ from "lodash";
import { isPrimitive } from "util";
import { env } from "process";

const global_env:Environment = {};
const ANY = "any";

export const evaluate = (node: Node): Primitive | Object | void => {
  switch (node?.type) {
    case "ExpressionSequence":
      return evaluate_sequence(node);
    case "VariableDefinition":
      return evaluate_variable_declaration(node);
    case "FunctionDefinition":
      return evaluate_function_definition(node);
    case "NumberLiteral":
      return evaluate_number_literal(node);
    case "StringLiteral":
      return evaluate_string_literal(node);
    case "BooleanLiteral":
      return evaluate_boolean_literal(node);
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

const evaluate_number_literal = (node: NumberLiteral): string => {
  return node.value;
};

const evaluate_string_literal = (node: StringLiteral): string => {
  return node.value;
};

const evaluate_boolean_literal = (node: BooleanLiteral): string => {
  return node.value;
};

const evaluate_name = (node: Name): Primitive | Object => {
  const varValAndType = global_env[node.name][0] as ValAndType;
  return varValAndType.value;
};

const evaluate_variable_declaration = (node: VariableDefinition) => {
  const evalResult = evaluate(node.expr);

  if (isPrimitive(evalResult)) { // Literal
    const varValAndType = {
      value: evalResult,
      type: node.atype ? node.atype as string : ANY,
    } as VarValAndType;

    // Replace the previous var definition only if the old atype is "any", 
    // or if the old atype matches the new one
    if (!(node.name in global_env) 
        || global_env[node.name][0].type == "any"
        || global_env[node.name][0].type == varValAndType.type) {
      global_env[node.name] = [varValAndType];
    } else {
      throw new Error("Cannot convert an object of type \"" + varValAndType.type 
        + "\" to an object of type \"" + global_env[node.name][0].type + "\"");
    }

  /* TODO: 1) FuncApp from FuncDef, 2) FuncApp from StructDef, 3) FieldAccess */
  } else {

  }
  
  return undefined;
};

const evaluate_function_definition = (node: FunctionDefinition) => {
  const funcValAndType = {
    value: node.body,
  } as FuncValAndType;

  // Set type.param_types, if any.
  if (node.params) {
    const param_types = [] as string[];
    for (let param of node.params) {
      if (param) {
        param_types.push(param.atype ? param.atype as string : ANY);
      }
    }

    funcValAndType.type = {
      param_types,
    };
  }

  // Set type.return_type, if any.
  // Differentiate between 1) return a value of type undefined, 2) not have any return value
  if (node.return_stmt) {
    funcValAndType.type!.return_type = node.return_type ? node.return_type : ANY;
  }

  // Extend the previous func definition if func previously defined
  if (node.name in global_env) {
    global_env[node.name].push(funcValAndType);
  } else {
    global_env[node.name] = [funcValAndType];
  }

  return undefined;
};
