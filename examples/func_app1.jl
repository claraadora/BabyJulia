x = 3
function f()
    x = 5
    function g()
        x = 7
        function h()
            return x
        end
        return h()
    end
    return g()
end
f() # 7
