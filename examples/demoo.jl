abstract type Shape end
struct Rectangle <: Shape 
end
struct Circle <: Shape 
end
struct Square <: Shape 
end 

r = Rectangle()
sq = Square() 
c = Circle()
 
# Add function using "quadrilateral" union.
function intersect(quad::Union{Square, Rectangle}, shape::Shape)
    return "Quad x Shape"
end

function intersect(shape1::Shape, shape2::Shape) # fallback method 
    return "Shape x Shape"
end
println(intersect(r, c)) 
println(intersect(sq, c)) 
println(intersect(c, c)) # falls back 