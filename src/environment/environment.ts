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

  constructor(env_frames: EnvFrame[] = []) {
    this.env_frames = env_frames;
  }

  // External APIs
  extend(names: string[]) {
    this.env_frames.push(new EnvFrame(names));
  }

  clone() {
    const env_frames_shallow_copy = [...this.env_frames];
    return new EnvStack(env_frames_shallow_copy);
  }

  lookup_name(name: string) {
    let frame = this.find_nearest_frame(name);
    return frame.get(name)[0];
  }

  lookup_fnames(name: string): FuncValAndType[] {
    let frame = this.find_nearest_frame(name);
    return frame.get(name) as FuncValAndType[];
  }

  assign_name(name: string, value: Primitive | Object, type: string) {
    let frame = this.find_nearest_frame(name);
    frame.assign_name(name, value, type);
  }

  assign_fname(
    name: string,
    value: ExpressionSequence | Function,
    param_types: string[],
    param_names: string[],
    return_type: string,
    env_stack: EnvStack
  ) {
    let frame = this.find_nearest_frame(name);
    frame.assign_fname(
      name,
      value,
      param_types,
      param_names,
      return_type,
      env_stack
    );
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
      if (this.env_frames[i].has(name)) return this.env_frames[i];
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

  has(name: string) {
    return name in this.name_to_vals;
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
    value: ExpressionSequence | Function,
    param_types: string[],
    param_names: string[],
    return_type: string,
    env_stack: EnvStack
  ) {
    // TODO: add checks here
    const vnt_arr = this.get(name);
    vnt_arr.push({
      value,
      param_types,
      param_names,
      return_type,
      env_stack,
    });
  }
}
