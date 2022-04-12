import * as _ from "lodash";
import { ParametricType, PlainType, Type } from "../types/types";

const LIST_OF_BUILT_IN_TYPES_WITH_THEIR_PARENTS: [string, string][] = [
  ["Number", "Any"],
  ["AbstractString", "Any"],
  ["String", "AbstractString"],
  ["Real", "Number"],
  ["Integer", "Real"],
  ["Bool", "Integer"],
  ["Signed", "Integer"],
  ["Int64", "Signed"],
  ["Vector", "Any"],
  ["AbstractFloat", "Real"],
  ["Float64", "AbstractFloat"],
];

export class TypeGraph {
  root: TypeNode;
  node_map: Object;

  constructor() {
    // Add root.
    this.root = new TypeNode("Any", null);
    this.node_map = { Any: this.root };

    // Add built-in types.
    this.prepopulate();
  }

  // Prepopulate type graph with built-in types.
  prepopulate() {
    for (let [
      node_name,
      parent_name,
    ] of LIST_OF_BUILT_IN_TYPES_WITH_THEIR_PARENTS) {
      this.add_node(node_name, parent_name);
    }
  }

  // Get node by name.
  get_node(node_name: string): TypeNode {
    return this.node_map[node_name];
  }

  // Create and add node with name `node_name` and parent `parent_name`.
  add_node(node_name: string, parent_name: string = "Any") {
    if (node_name in this.node_map) {
      throw new Error(`Type ${node_name} already exists in the graph.`);
    }

    if (!(parent_name in this.node_map)) {
      throw new Error("Parent type does not exist in the graph");
    }

    let parent_node = this.get_node(parent_name ?? "Any");
    let new_node = new TypeNode(node_name, parent_node);

    parent_node.children.add(new_node);
    new_node.parent = parent_node;

    this.node_map[node_name] = new_node;
  }

  is_connected(node1: Type, node2: Type): boolean {
    return (
      this.get_distance_from(node1, node2) !== Number.MAX_VALUE ||
      this.get_distance_from(node2, node1) !== Number.MAX_VALUE
    );
  }

  is_parent_of(parent: Type, child: Type): boolean {
    if (!this.is_connected(parent, child)) {
      return false;
    }

    return this.get_distance_from(child, parent) !== Number.MAX_VALUE;
  }

  condense_union(union: Type[]): Type[] | PlainType {
    let condensed_union = [...union];
    let is_condensible = true;

    while (is_condensible) {
      const initial_count = condensed_union.length;
      for (let i = 0; i < condensed_union.length; i++) {
        for (let j = i + 1; j < condensed_union.length; j++) {
          let a = condensed_union[i];
          let b = condensed_union[j];

          if (this.is_parent_of(a, b)) {
            _.remove(condensed_union, (x) => x === b);
          } else if (this.is_parent_of(b, a)) {
            _.remove(condensed_union, (x) => x === a);
          }
        }
      }

      if (initial_count === condensed_union.length) {
        is_condensible = false;
      }
    }

    if (condensed_union.length === 1) {
      return condensed_union[0] as PlainType;
    }

    return condensed_union;
  }

  // Get distance from child node to parent node by traversing up the graph. If unreachable, -1 is returned.
  // Basically a `subtype(t1, t2)` function which outputs how specific the two types are (lower value means more specific) when t1 <: t2 and Number.MAX_VALUE otherwise.
  // Note that child_type cannot be a union type.
  get_distance_from(child_type: Type, parent_type: Type) {
    // string - string
    if (TypeUtil.is_plain(child_type) && TypeUtil.is_plain(parent_type)) {
      const child_node = this.get_node(child_type);
      const parent_node = this.get_node(parent_type);

      let ptr: TypeNode | null = child_node;
      let distance = 0;
      while (ptr && ptr !== parent_node) {
        ptr = ptr.parent;
        distance++;
      }
      return ptr === parent_node ? distance : Number.MAX_VALUE;
    }

    // string - union
    if (TypeUtil.is_plain(child_type) && TypeUtil.is_union(parent_type)) {
      // Return the shortest distance (most specific type) from the condensed union.
      let condensed_parent_union = this.condense_union(parent_type);

      if (TypeUtil.is_plain(condensed_parent_union)) {
        condensed_parent_union = [condensed_parent_union];
      }

      console.log("condensed: ", condensed_parent_union);
      let shortest_dist = Number.MAX_VALUE;
      for (let paren_type of condensed_parent_union) {
        // TODO:
        shortest_dist = Math.min(
          shortest_dist,
          this.get_distance_from(child_type, paren_type)
        );
      }
      return shortest_dist;
    }

    return Number.MAX_VALUE;
  }
}

export class TypeUtil {
  static is_plain(type: Type): type is PlainType {
    return typeof type === typeof "string";
  }

  static is_union(type: Type): type is Type[] {
    return Array.isArray(type);
  }

  static is_parametric(type: Type): type is ParametricType {
    return !Array.isArray(type) && typeof type === typeof {};
  }

  static get_base_name(type: Type) {
    if (this.is_plain(type)) {
      return type;
    } else if (this.is_parametric(type)) {
      return type.base;
    }
    throw Error("Can't get base name of union type!");
  }
}
class TypeNode {
  name: string;
  children: Set<TypeNode>;
  parent: TypeNode | null;

  constructor(node_name: string, parent_node: TypeNode | null) {
    this.name = node_name;
    this.children = new Set();
    this.parent = parent_node;
  }
}
