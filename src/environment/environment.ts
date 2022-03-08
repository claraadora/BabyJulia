import {
  Expression,
  FuncValAndType,
  is_function_definition,
  is_variable_definition,
  VarValAndType,
} from "./../types/types";
import {
  ExpressionSequence,
  FunctionDefinition,
  is_declaration,
  ValAndType,
  VariableDefinition,
} from "../types/types";
import _ from "lodash";

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

class Environment {
  frames: EnvironmentFrame[];
  constructor() {
    this.frames = [];
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
        new_env_frame.upsert_noncallable_name(name, vnt)
      );

    // Add the frame into the environment stack.
    this.frames.push(new_env_frame);
  }

  pop_env() {
    return this.frames.pop();
  }
  //   pop_env;
  //   addnamevaltype;
  //   getval;
}

class EnvironmentFrame {
  noncallables_to_vnts: { [name: string]: VarValAndType };
  callables_to_vnts: { [name: string]: FuncValAndType[] };

  constructor() {
    this.noncallables_to_vnts = {};
    this.callables_to_vnts = {};
  }

  // Non-callables.
  upsert_noncallable_name(name: string, vnt: VarValAndType) {
    if (!this.is_upsert_noncallable_name_allowed(name, vnt))
      throw new Error("Invalid declaration");
    this.noncallables_to_vnts[name] = vnt;
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
}
