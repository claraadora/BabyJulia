function g(x)
  return x ? x : 10
end

println(g(1)) # Error: Non-boolean (Int64) used in boolean context
