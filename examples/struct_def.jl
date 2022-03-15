abstract type Mammal end 

struct Cat <: Mammal 
    name::String
    age::Int64
    isFemale::Bool
end 

struct Human <: Mammal
    name::String
    height::Int64
    isAlive::Bool	
end

kitty = Cat("Kitty", 1, true)
obama = Human("Michelle Obama", 180, true)

println(kitty.name)
println(kitty.age)
println(kitty.isFemale)
obama
