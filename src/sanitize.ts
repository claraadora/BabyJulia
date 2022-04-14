import * as _ from "lodash";
import { Value } from "./types/types";

export function sanitize(node: any) {
  if (!_.isObject(node)) {
    return;
  }

  for (let key in node) {
    if (_.isArray(node[key])) {
      node[key] = node[key].filter((val: any) => val);
      node[key].forEach((val: any) => sanitize(val));
    } else {
      sanitize(node[key]);
    }
  }
}

export function format_2d_array(values: Value[]) {
  let str = "[";
  for (let i = 0; i < values.length; i++) {
    const values_in_row = values[i] as Value[];
    const arr_vals = values_in_row.join(" ");
    str += arr_vals;
    if (i < values.length - 1) {
      str += "; ";
    }
  }
  str += "]";
  return str;
}
