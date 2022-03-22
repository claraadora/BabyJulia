import * as _ from "lodash";

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
  