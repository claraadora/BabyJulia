function myplus(x, y)
    x = 5
    y::Int64 = 10
    return x
end 

function myplus(x::Int64)
    x = 3
    return x
end 

function myplus(x::Int64, y::String)::Union{String, Int64, Real}
    x = 3 
    y = "Hello " * y
    return y
end 

println(myplus(1, "Johanna")) # "Hello Johanna"
println(myplus(1)) # 3
println(myplus(1, 6)) # 5 
myplus("s1", "s2") # 5
