function is_one(x)
  return x == 1
end

function g(x)
  y = is_one(x) ? x * 2 : x - 2
  return x < y ? x : y
end

println(g(1)) 
println(g(5)) 
