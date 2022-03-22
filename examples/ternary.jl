function is_one(x)
  return x == 1
end

function f(x)
  y = is_one(x) ? x * 2 : "x + 2"
  return y
end

println(f(1)) # 1
println(f(5)) # x + 2