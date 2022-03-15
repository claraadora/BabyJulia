A = [1, 2, 3]
B = [4, 5, 6]
C = [1 2; 3 4; 5 6]
D = [1 1; 1 1]

function matrix_mult(A,B)
    sum = 0
    sizeA = size(A)
    sizeB = size(B)

    numRowA = sizeA[1] 
    numRowB = sizeB[1] 
    numColB = sizeB[2]
    
    println(numRowA) # 3
    println(numRowB) # 2
    println(numColB) # 2 
    # Iterate through rows of A.
    for i = 1:numRowA
        # Iterate through cols of B. 
        for j in 1:numColB
            # Iterate through rows of B. 
            for k = 1:numRowB
                sum = sum + (A[i,k] * B[k,j])
                println("A")
                println(A[i,k])
                println(B[k,j])
                println(sum)
            end
            println("B")
            println(sum)
        end
        println("C")
        println(sum)
    end
    return sum 
end

matrix_mult(C, D) # 42
