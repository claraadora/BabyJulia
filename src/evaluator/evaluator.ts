import {
  Name,
  VariableDefinition,
  Literal,
  Node,
  ExpressionSequence,
  Environment,
  VarValAndType,
  FuncValAndType,
  Primitive,
  FunctionApplication,
  FunctionDefinition,
} from "./../types/types";
import * as _ from "lodash";
import { isPrimitive } from "util";

const global_env:Environment = {};
const ANY = "any";

export const evaluate = (node: Node): Primitive | void => {
  switch (node?.type) {
    case "ExpressionSequence":
      return evaluate_sequence(node);
    case "VariableDefinition":
      return evaluate_variable_declaration(node);
    case "FunctionDefinition":
      return evaluate_function_definition(node);
    case "Literal":
      return evaluate_literal(node);
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
  const evalResult = evaluate(node.expr);

  if (isPrimitive(evalResult)) { // Literal
    const varValAndType = {
      value: evaluate_literal(node.expr as Literal),
      type: node.atype as string,
    } as VarValAndType;

    // Replace the previous var definition
    global_env[node.name] = [varValAndType];

  /* 1) FuncApp from FuncDef, TODO: 2) FuncApp from StructDef, 3) FieldAccess */
  } else {
    const funcApp = node.expr as FunctionApplication;
    const funcValAndType = global_env[funcApp.name];
  }

  
  console.log(global_env);
  return undefined;
};

/* function myplus(x, y)
    x = 5
    y::Int64 = 10
    return x
  end 
 */
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

  // console.log("PARAM_TYPES: ", funcValAndType.type?.param_types);

  // Set type.return_type, if any.
  // Differentiate between 1) return a value of type undefined, 2) not have any return value
  if (node.return_stmt) {
    if (funcValAndType.type) { // if param_types are not empty
      funcValAndType.type.return_type = node.return_type ? node.return_type : ANY;
    } else {
      funcValAndType.type = {
        return_type: (node.return_type ? node.return_type : ANY),
      };
    }
  }
  // console.log("RETURN_TYPE: ", funcValAndType.type?.return_type);

  // Extend the previous func definition if func previously defined
  if (node.name in global_env) {
    global_env[node.name].push(funcValAndType);
  } else {
    global_env[node.name] = [funcValAndType];
  }

  console.log(global_env);
  return undefined;
};
