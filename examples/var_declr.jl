x = 3
y::Int64 = 100 
x::Bool = true

function myplus(x, y)
    x = 5
    y::Int64 = 10
    return x
end 

plus = myplus(1, 2)
