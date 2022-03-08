const LIST_OF_BUILT_IN_TYPES_WITH_THEIR_PARENTS: [string, string][] = [
  ["Number", "Any"],
  ["AbstractString", "Any"],
  ["String", "AbstractString"],
  ["Real", "Number"],
  ["Integer", "Real"],
  ["Bool", "Integer"],
  ["Signed", "Integer"],
  ["Int64", "Signed"],
];

class TypeGraph {
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
      throw new Error("Type already exists in the graph.");
    }

    if (!(parent_name in this.node_map)) {
      throw new Error("Parent type does not exist in the graph");
    }

    let parent_node = this.get_node(parent_name ?? "Any");
    let new_node = new TypeNode(node_name, parent_node);
    parent_node.children.add(new_node);
  }

  // Get distance from child node to parent node by traversing up the graph.
  get_distance_from(child_node_name: string, parent_node_name: string) {
    const child_node = this.get_node(child_node_name);
    const parent_node = this.get_node(parent_node_name);

    let ptr: TypeNode | null = child_node;
    let distance = 0;
    while (ptr && child_node !== parent_node) {
      ptr = ptr.parent;
      distance++;
    }
    return distance;
  }

  get_total_distance_from(
    child_type_names: string[],
    parent_type_names: string[]
  ) {
    const N = child_type_names.length;
    let total_distance = 0;

    for (let i = 0; i < N; i++) {
      total_distance += this.get_distance_from(
        child_type_names[i],
        parent_type_names[i]
      );
    }
    return total_distance;
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
