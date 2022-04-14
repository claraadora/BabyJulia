mat_A = [1 1; 1 1]
mat_B = [1 2; 3 4]

#  mat_A     mat_B
# | 1 1 |   | 1 2 | 
# | 1 1 |   | 3 4 |

# mat_A x mat_B
# | 4 6 |
# | 4 6 |

function matrix_mult(A,B)
    result = [0 0; 0 0]
    numRowA = size(A)[1] 
    numRowB = size(B)[1] 
    numColB = size(B)[2]

    # Iterate through rows of A.
    for i = 1:numRowA
        # Iterate through cols of B. 
        for j in 1:numColB
            # Iterate through rows of B. 
            for k = 1:numRowB
                result[i,j] = result[i,j] + (A[i,k] * B[k,j])
            end
        end
    end
    return result
end

matrix_mult(mat_A, mat_B) # [4 6; 4 6]
