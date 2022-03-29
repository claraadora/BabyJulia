# 1. VarDef
x = true # atypes = null
y::Union{String, Int64, Bool} = 100 # atypes = ["String","Int64","Bool"]
z::Union{String} = "hey" # atypes = ["String"]

# 2. funcDef param atype and return type
# param atypes = ["Float64", "Int64"]
# return_types = ["String", "Bool"]
function f(x::Union{Float64, Int64})::Union{String, Bool}
  return x
end

# 3. absType supertype
abstract type Animal end # super_type_names = null
abstract type Mammal <: Animal end # super_type_names = ["Animal"]
abstract type Feline <: Union{Animal, Mammal} end # super_type_names = ["Animal", "Mammal"]

# 4. structDef supertype and field atype
# super_type_names = ["Animal", "Mammal", "Feline"]
# x.atypes = ["Feline"]
struct Cat <: Union{Animal, Mammal, Feline}
  x::Union{Feline}
end

