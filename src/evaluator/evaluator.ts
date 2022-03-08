import {
  Name,
  VariableDefinition,
  Node,
  ExpressionSequence,
  Environment,
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
  StructDefinition,
  Expression
} from "./../types/types";
import * as _ from "lodash";

const global_env: Environment = {};
const type_graph: TypeGraph = new TypeGraph();
const ANY = "any";

const isPrimitive = (value: any): boolean => Object(value) !== value;

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
    case "StructDefinition":
      return evaluate_struct_definition(node);
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
  const varValAndType = global_env[node.name][0] as VarValAndType;
  return varValAndType.value;
};

// TODO: add field access here.

// Variable definition.
const evaluate_variable_declaration = (node: VariableDefinition) => {
  const evalResult = evaluate(node.expr);

  if (isPrimitive(evalResult)) {
    // Literal
    const varValAndType: VarValAndType = {
      value: evalResult as Object | Primitive,
      type: node.atype ?? ANY,
    };

    // Replace the previous var definition only if the old atype is "any",
    // or if the old atype matches the new one
    if (
      !(node.name in global_env) ||
      global_env[node.name][0].type == ANY ||
      global_env[node.name][0].type == varValAndType.type
    ) {
      global_env[node.name] = [varValAndType];
    } else {
      throw new Error(
        'Cannot convert an object of type "' +
          varValAndType.type +
          '" to an object of type "' +
          global_env[node.name][0].type +
          '"'
      );
    }

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

// Struct definition.
const make_expr_sequence = (node: StructDefinition): ExpressionSequence => {
  const expressions = [] as Expression[];
  node.fields.forEach((field) => expressions.push(field as Expression));

  return {
    type: "ExpressionSequence",
    expressions,
  };
};

const evaluate_struct_definition = (node: StructDefinition) => {
  const field_types = [] as string[];

  node.fields.forEach((field) => field_types.push(field.atype ?? ANY));

  const funcValAndType = {
    value: make_expr_sequence(node),
    type: {
      param_types: field_types,
      return_type: node.struct_name,
    }
  } 

  // Don't allow re-declaration of struct
  if (node.struct_name in global_env) {
    throw new Error(
      'Struct "' +
      node.struct_name +
      '" has been declared'
    ); 
  }

  global_env[node.struct_name] = [funcValAndType];
  return undefined;
};

// Abstract type declaration.
const evaluate_abstract_type_declaration = (node: AbstractTypeDeclaration) => {
  type_graph.add_node(node.name, node.super_type_name ?? ANY);
};
