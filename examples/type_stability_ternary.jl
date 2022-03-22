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

# type instability: line 10 (x * 2 is an Int64, "x - 2" is a string)
# Type unstable!
#     Consequent 2 is of type Int64,
#     whereas alternative x - 2 is of type String
println(g(1)) # 2

# type instability: line 10 and line 11 (bcs y will return a string, but x is an Int64)
# Type unstable!
#     Consequent 10 is of type Int64,
#     whereas alternative x - 2 is of type String
# Type unstable!
#     Consequent 5 is of type Int64,
#     whereas alternative x - 2 is of type String
println(g(5)) # x - 2
