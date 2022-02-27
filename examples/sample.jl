x = 3
x::Int64 = 100 

function myplus(x, y)
    return x
end 

function myplus(x::Int64)
    return x
end 

function myplus(x::Int64, y)::Int64
    return x
end 

myplus(1,3)

animal.roar 

abstract type Cat end 
abstract type Cat <: Mammal end

