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

myplus(1, "yeay") # Can't have two equally specific functions.
myplus(1) # Can't have two equally specific functions.
myplus(1, 6) # 3
myplus(1, 2 , 3) # 3
# myplus("s1", "s2") # 5 --> correct