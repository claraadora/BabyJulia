function id(x)
  return x == 1 ? 100 : "no one"
end

println(id(1))
println(id(100))
println(id("hi"))
println(id(true))