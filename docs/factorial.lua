function factorial(n)
    if n < 0 then
        return nil
    end

    local result = 1
    for i = 2, n do
        result = result * i
    end

    return result
end

print("10!=", factorial(10))
