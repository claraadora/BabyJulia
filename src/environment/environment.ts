import {
  Expression,
  FuncValAndType,
  is_declaration,
  is_function_definition,
  Primitive,
  ValAndType,
  VarValAndType,
} from "./../types/types";
import {
  ExpressionSequence,
  FunctionDefinition,
  VariableDefinition,
} from "../types/types";
import * as _ from "lodash";

export class EnvStack {
  env_frames: EnvFrame[];

  constructor() {
    this.env_frames = [];
  }

  // External APIs
  lookup_name(name: string) {
    let frame = this.find_nearest_frame(name);
    return frame.get(name)[0];
  }

  lookup_fnames(name: string) {
    let frame = this.find_nearest_frame(name);
    return frame.get(name);
  }

  extend(names: string[]) {
    this.env_frames.push(new EnvFrame(names));
  }

  assign_name(name: string, value: Primitive | Object, type: string) {
    let frame = this.find_nearest_frame(name);
    frame.assign_name(name, value, type);
  }

  assign_fname(
    name: string,
    value: ExpressionSequence,
    param_types: string[],
    return_type: string
  ) {
    let frame = this.find_nearest_frame(name);
    frame.assign_fname(name, value, param_types, return_type);
  }

  // Private
  pop() {
    return this.env_frames.pop();
  }

  push(frame: EnvFrame) {
    return this.env_frames.push(frame);
  }

  find_nearest_frame(name: string): EnvFrame {
    const N = this.env_frames.length;

    for (let i = N - 1; i >= 0; i--) {
      if (name in this.env_frames[i]) return this.env_frames[i];
    }
    throw new Error("Name is not found!");
  }
}

class EnvFrame {
  name_to_vals: {
    [name: string]: ValAndType[];
  };
  constructor(names: string[]) {
    this.name_to_vals = {};
    names.forEach((name) => (this.name_to_vals[name] = []));
  }

  get(name: string) {
    return this.name_to_vals[name];
  }

  assign_name(name: string, value: Primitive | Object, type: string) {
    let vnt_arr = this.get(name);

    // TODO: add checks here
    if (vnt_arr.length === 0) vnt_arr.push({ value, type });
    else vnt_arr[0] = { value, type };
  }

  assign_fname(
    name: string,
    value: ExpressionSequence,
    param_types: string[],
    return_type: string
  ) {
    // TODO: add checks here
    let vnt_arr = this.get(name);
    vnt_arr.push({ value, param_types, return_type });
  }
}
