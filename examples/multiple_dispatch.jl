function f(x::Number)
    return "Less specific"
end

function f(x::Real)
    return "More specific"
end

f(1)