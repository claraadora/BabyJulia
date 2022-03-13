A = [1, 2, 3]
B = [4, 5, 6]
C = [1 2; 3 4; 5 6]
D = [7 8 ; 9 10]

function matrix_mult(A,B)
  numRowB = size(B)[1]
    for i = 1:2
        for j in 1:size(B)[2] # numColB
            sum = 0
            for k = 1:numRowB
                sum = sum + A[i,k] * B[k, j]
            end
            println(sum)
        end
    end
end

println(matrix_mult(C, D))
