const convert = require('./toword');

test("Check number to word conversions", () => {
    expect(convert(14)).toBe("fourteen");
    expect(convert(67)).toBe("sixty seven");
});
