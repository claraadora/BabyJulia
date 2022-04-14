function is_one(x)::Bool
  return x == 1
end

function is_not_one(x)::Bool
  a = 2 + 4
  return x != 1
end

println(is_one(1)) # expected: true
is_not_one(1) # expected: false
