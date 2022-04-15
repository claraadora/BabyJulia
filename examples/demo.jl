abstract type Shape end
struct Rectangle <: Shape 
end
struct Circle <: Shape 
end

r1 = Rectangle()
r2 = Rectangle() 
c = Circle()

function intersect(rectangle::Rectangle, circle::Circle)
    return "Rectangle x Circle "
end
function intersect(rectangle1::Rectangle, rectangle2::Rectangle)
    return "Rectangle x Rectangle"
end
function intersect(shape1::Shape, shape2::Shape) # fallback method 
    return "Shape x Shape"
end 

println(intersect(r1, c)) 
println(intersect(r1, r2)) 
println(intersect(c, c)) # falls back 