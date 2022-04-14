function f()
  A = [1, 5, 3]
  return A
end

function g()
  return ["a", "b"]
end

f()[1] # expected: 1
f()[2] # expected: 5
g()[2] # expected: "b"
