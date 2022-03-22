A = [1, 2, 3]
B = [4, 5, 6]
C = [1 2 3; 3 4 5 ; 6 7 8]
D = [7 8 ; 9 10]

println(A) # [1,2,3]
println(B) # [4,5,6]
println(C) # [[1,2,3], [3,4,5], [6,7,8]]
println(C[3,3]) # 8
println(D) # [[7,8], [9,10]]
println(D[1,2]) # 8
size(D)
D
# expected: [[7,8], [9,10]]