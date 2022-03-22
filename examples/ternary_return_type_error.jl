function g(x)::Bool
  return x > 1 ? 2 : 10
end

println(g(1)) # Error: The atype of function g is Bool, but it returns value of type Int64
