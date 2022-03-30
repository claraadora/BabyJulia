mat_A = [1 1; 1 1]
mat_B = [1 2; 3 4]

#  mat_A     mat_B
# | 1 1 |   | 1 2 | 
# | 1 1 |   | 3 4 |

# mat_A x mat_B
# | 4 6 |
# | 4 6 |

function matrix_mult(A,B)
    sum = 0
    sizeA = size(A)
    sizeB = size(B)

    numRowA = sizeA[1] 
    numRowB = sizeB[1] 
    numColB = sizeB[2]

    # Iterate through rows of A.
    for i = 1:numRowA
        # Iterate through cols of B. 
        for j in 1:numColB
            sum = 0 
            # Iterate through rows of B. 
            for k = 1:numRowB
                sum = sum + (A[i,k] * B[k,j])
            end
            # println(sum)
        end
    end
end

matrix_mult(mat_A, mat_B) # [4 6; 4 6]
