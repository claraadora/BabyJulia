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
 
# Uses a "quadrilateral" union.
function intersect(quad::Union{Square, Rectangle}, shape::Shape)
  return "Quad x Shape"
end
# function intersect(not_really_quad::Union{Square, Rectangle, Shape}, shape::Shape)
#   return "Shape x Shape"
# end
function intersect(shape1::Shape, shape2::Shape) # fallback method 
  return "Shape x Shape"
end
println(intersect(r, c)) # prints "Quad x Shape"
println(intersect(sq, c)) # prints "Quad x Shape"
intersect(c, c) # prints "Shape x Shape"
