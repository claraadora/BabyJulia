import {
  Expression,
  FuncValAndType,
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

    // Upsert each function's name and unassigned ValueAndType to the new frame.
    [...expressionSeq.expressions]
      .filter((expr: Expression) => is_function_definition(expr))
      .map((funcdef: FunctionDefinition) => [
        funcdef.name,
        make_unassigned_callable_vnt(funcdef),
      ])
      .forEach(([name, vnt]: [string, FuncValAndType]) =>
        new_env_frame.upsert_callable_name(name, vnt)
      );

    // Upsert each non-function's name and unassigned ValueAndType to the new frame.
    [...expressionSeq.expressions]
      .filter((expr) => is_variable_definition(expr))
      .map((vardef: VariableDefinition) => [
        vardef.name,
        make_unassigned_noncallable_vnt(vardef),
      ])
      .forEach(([name, vnt]: [string, VarValAndType]) =>
        new_env_frame.upsert_noncallable_name_vnt(name, vnt)
      );

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
      const vnt_map = curr_frame.noncallables_to_vnts;

      if (name in vnt_map) {
        return vnt_map[name];
      }
    }
    throw new Error("Looking up non-existing name!!"); // TODO: change to a better error msg
  }

  lookup_signature(name: string, arg_types: string[]) {
    // Traverse from the top of the stack frame
    for (let i = name.length - 1; i >= 0; i--) {
      const curr_frame = this.frames[i];
      const vnt_map = curr_frame.noncallables_to_vnts;

      if (name in vnt_map) {
        return vnt_map[name];
      }
    }
    throw new Error("Looking up non-existing name!!"); // TODO: change to a better error msg
  }

  get_curr_frame() {
    return this.frames[this.frames.length - 1];
  }

  update_name(name: string, value: Primitive) {
    const curr_frame = this.get_curr_frame();
    curr_frame.update_name(name, value);
  }

  update_signature(
    name: string,
    param_types: string[],
    value: ExpressionSequence
  ) {
    const curr_frame = this.get_curr_frame();
    curr_frame.update_signature(name, param_types, value);
  }
}

class EnvironmentFrame {
  noncallables_to_vnts: { [name: string]: VarValAndType };
  callables_to_vnts: { [name: string]: FuncValAndType[] };

  constructor() {
    this.noncallables_to_vnts = {};
    this.callables_to_vnts = {};
  }

  // Non-callables.
  upsert_noncallable_name_vnt(name: string, vnt: VarValAndType) {
    if (!this.is_upsert_noncallable_name_allowed(name, vnt))
      throw new Error("Invalid declaration");
    this.noncallables_to_vnts[name] = vnt;
  }

  update_name(name: string, value: Primitive) {
    this.noncallables_to_vnts[name].value = value;
  }

  get_noncallable_vnt(name: string): VarValAndType {
    return this.noncallables_to_vnts[name];
  }

  is_upsert_noncallable_name_allowed(name: string, vnt: VarValAndType) {
    return (
      !(name in this.noncallables_to_vnts) ||
      this.noncallables_to_vnts[name].type === "Any" ||
      this.noncallables_to_vnts[name].type === vnt.type
    );
  }

  lookup_noncallable_name(name: string) {
    return this.noncallables_to_vnts[name];
  }

  // Callables.
  upsert_callable_name(name: string, vnt: FuncValAndType) {
    if (!this.is_upsert_callable_name_allowed(name, vnt))
      throw new Error("Invalid declaration");

    if (this.callables_to_vnts[name]) {
      this.callables_to_vnts[name].push(vnt);
    } else {
      this.callables_to_vnts[name] = [vnt];
    }
  }

  update_signature(
    name: string,
    param_types: string[],
    value: ExpressionSequence
  ) {
    const matched_vnt = this.callables_to_vnts[name].filter((vnt) =>
      _.isEqual(vnt.type.param_types, param_types)
    );

    if (!matched_vnt) {
      throw new Error("Something is wrong with algo");
    }
    matched_vnt[0].value = value;
  }

  get_callable_vnts(name: string): FuncValAndType[] {
    return this.callables_to_vnts[name];
  }

  is_upsert_callable_name_allowed(name: string, vnt: FuncValAndType) {
    return (
      Object.values(this.callables_to_vnts[name]).filter((existing_vnt) =>
        _.isEqual(existing_vnt, vnt)
      ).length === 0
    );
  }

  lookup_signature(name: string, arg_types: string[]) {
    // Functions with same name and same parameter length.
    const overloaded_funcs = this.callables_to_vnts[name].filter(
      (vnt) => vnt.type.param_types.length === arg_types.length
    );

    // TODO: Add multiple dispatch here.
    // const type_distance_scores = [...overloaded_funcs].map((func: FuncValAndType) => )
    return overloaded_funcs[-1];
  }
}
