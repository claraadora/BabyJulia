import {
  Expression,
  FuncValAndType,
  is_declaration,
  is_function_definition,
  is_variable_definition,
  Primitive,
  VarValAndType,
} from "./../types/types";
import {
  ExpressionSequence,
  FunctionDefinition,
  VariableDefinition,
} from "../types/types";
import _ from "lodash";
import { TypeGraph } from "../type_graph/type_graph";

const make_unassigned_callable_vnt = (
  def: FunctionDefinition
): FuncValAndType => {
  const param_types = [...def.params].map((param) => param.atype ?? "Any");
  return {
    value: null,
    type: { param_types, return_type: def.return_type ?? "Any" },
  };
};

const make_unassigned_noncallable_vnt = (
  def: VariableDefinition
): VarValAndType => {
  return { value: null, type: def.atype ?? "Any" };
};

export class Environment {
  frames: EnvironmentFrame[];
  type_graph: TypeGraph;

  constructor(type_graph: TypeGraph) {
    this.frames = [];
    this.type_graph = type_graph;
  }

  extend_env(expressionSeq: ExpressionSequence) {
    const new_env_frame = new EnvironmentFrame();

    // Upsert each declaration name and its unassigned ValueAndType to the new frame.
    [...expressionSeq.expressions]
      .filter((expr: Expression) => is_declaration(expr))
      .forEach((def: FunctionDefinition | VariableDefinition) => {
        const vnt = is_function_definition(def)
          ? make_unassigned_callable_vnt(def)
          : make_unassigned_noncallable_vnt(def);

        is_function_definition(def)
          ? new_env_frame.upsert_signature_vnt(def.name, vnt as FuncValAndType)
          : new_env_frame.upsert_name_vnt(def.name, vnt as VarValAndType);
      });

    // Add the frame into the environment stack.
    this.frames.push(new_env_frame);
  }

  pop_env() {
    return this.frames.pop();
  }

  lookup_name(name: string) {
    // Traverse from the top of the stack frame
    for (let i = name.length - 1; i >= 0; i--) {
      const curr_frame = this.frames[i];
      if (curr_frame.is_name_exist(name)) {
        return curr_frame.get_name_vnt(name).value;
      }
    }
    throw new Error("Looking up non-existing name!!"); // TODO: change to a better error msg
  }

  lookup_function(name: string, arg_types: string[]) {
    // Traverse from the top of the stack frame
    for (let i = name.length - 1; i >= 0; i--) {
      const curr_frame = this.frames[i];
      const most_specific_func = curr_frame.lookup_signature(name, arg_types);

      if (most_specific_func) return most_specific_func;
    }
    throw new Error("Looking up non-existing name!!"); // TODO: change to a better error msg
  }

  get_curr_frame() {
    return this.frames[this.frames.length - 1];
  }

  update_name(name: string, value: Primitive) {
    const curr_frame = this.get_curr_frame();
    curr_frame.update_name_value(name, value);
  }

  update_signature(
    name: string,
    param_types: string[],
    value: ExpressionSequence
  ) {
    const curr_frame = this.get_curr_frame();
    curr_frame.update_signature_value(name, param_types, value);
  }
}

class EnvironmentFrame {
  name_to_vnts: { [name: string]: VarValAndType };
  signature_to_vnts: { [name: string]: FuncValAndType[] };

  constructor() {
    this.name_to_vnts = {};
    this.signature_to_vnts = {};
  }

  // Non-callables.
  upsert_name_vnt(name: string, vnt: VarValAndType) {
    if (!this.is_name_declaration_allowed(name, vnt))
      throw new Error("Invalid declaration");
    this.name_to_vnts[name] = vnt;
  }

  update_name_value(name: string, value: Primitive) {
    this.name_to_vnts[name].value = value;
  }

  get_name_vnt(name: string): VarValAndType {
    return this.name_to_vnts[name];
  }

  is_name_declaration_allowed(name: string, vnt: VarValAndType) {
    return (
      !(name in this.name_to_vnts) || // Name doesn't exist yet.
      this.name_to_vnts[name].type === "Any" || // Name exists, but type is "Any".
      this.name_to_vnts[name].type === vnt.type // Name exists, type is same as previously declared.
    );
  }

  lookup_name(name: string) {
    return this.name_to_vnts[name];
  }

  is_name_exist(name: string) {
    return name in this.name_to_vnts;
  }

  // Callables.
  upsert_signature_vnt(signature: string, vnt: FuncValAndType) {
    if (!this.is_signature_declaration_allowed(signature, vnt))
      throw new Error("Invalid declaration");

    if (this.signature_to_vnts[signature]) {
      this.signature_to_vnts[signature].push(vnt);
    } else {
      this.signature_to_vnts[signature] = [vnt];
    }
  }

  update_signature_value(
    name: string,
    param_types: string[],
    value: ExpressionSequence
  ) {
    const matched_vnt = this.signature_to_vnts[name].filter((vnt) =>
      _.isEqual(vnt.type.param_types, param_types)
    );

    if (!matched_vnt) {
      throw new Error("Something is wrong with algo");
    }
    matched_vnt[0].value = value;
  }

  get_signature_vnts(name: string): FuncValAndType[] {
    return this.signature_to_vnts[name];
  }

  is_signature_declaration_allowed(name: string, vnt: FuncValAndType) {
    // Only allowed if there is no existing function with same name and parameter types.
    return (
      Object.values(this.signature_to_vnts[name]).filter((existing_vnt) =>
        _.isEqual(existing_vnt, vnt)
      ).length === 0
    );
  }

  lookup_signature(name: string, arg_types: string[]) {
    // Functions with same name and same parameter length.
    const overloaded_funcs = this.signature_to_vnts[name].filter(
      (vnt) => vnt.type.param_types.length === arg_types.length
    );

    // TODO: Add multiple dispatch here.
    // const type_distance_scores = [...overloaded_funcs].map((func: FuncValAndType) => )
    return overloaded_funcs[-1];
  }
}
