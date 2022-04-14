# 1. VarDef
x = true
y::Union{String, Int64, Bool} = 100
z::Union{String} = "hey"

# 2. funcDef param atype and return type
function f(x::Union{Float64, Int64, Real})::Union{String, Int64}
  return "hello"
end

function f(x::Union{Float64, Int64})::Union{Real}
  return 123
end

# 3. absType supertype
abstract type Animal end
abstract type Mammal <: Animal end
abstract type Feline <: Union{Animal, Mammal} end 

# 4. structDef supertype and field atype
struct Cat <: Union{Animal, Mammal, Feline}
  x::Union{Feline}
end

# string - union
f(1) # expected: 123

