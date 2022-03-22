function is_one(x)
  return x == 1
end

function is_greater(x, y)
  return x > y
end

function g(x)
  y = is_one(x) ? x * 2 : "x - 2"
  return is_greater(x, y) ? x : y
end

println(g(1)) # type instability: line 10 (x * 2 is an Int64, "x - 2" is a string)
println(g(5)) # type instability: line 10 and line 11 (bcs y will return a string, but x is an Int64)
