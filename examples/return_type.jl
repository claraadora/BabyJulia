function is_one(x)::Bool
  return x == 1
end

function is_not_one(x)::String
  a = 2 + 4
  return x != 1
end

println(is_one(1)) # true
is_not_one(1) # Error: The atype of function is_not_one is String, but it returns value of type Bool
