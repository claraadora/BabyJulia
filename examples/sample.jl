x = 3
x::Int64 = 100 

function myplus(x, y)
    x = 5
    y::Int64 = 10
    return x
end 

function myplus(x::Int64)
    x = 3
    return x
end 

function myplus(x::Int64, y::String)::String
    x = 3 
    y = "Hello!"
    return y 
end 

myplus(1,3)
myplus("1", true, false)
myplus(animal)

animal.roar 

abstract type Cat end 
abstract type Cat <: Mammal end

struct Foo 
    bar
    baz::Int
    qux::Bool
end 

struct Lion <: Cat 
    maneColor 
    roar::String 	
end
