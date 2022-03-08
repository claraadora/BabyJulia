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
