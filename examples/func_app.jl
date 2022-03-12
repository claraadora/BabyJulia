x = 3
function f()
    function g()
        function h()
            return x
        end
        return h()
    end
    return g()
end
f()
