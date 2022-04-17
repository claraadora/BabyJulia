struct A {T}
    x::T
    y::T
end 

struct B {T <: Real}
    x::T
    y::T
end 

struct B2 {T} <: B {T}
    x::T
    y::T
end

struct B3 {T} <: B {<: Real}
    x::T
    y::T
end 

a = A("x", "y")
b = B(1, 2)
b2 = B2(1, 2)
b3 = B3(1, 2)
b3.x # 1
