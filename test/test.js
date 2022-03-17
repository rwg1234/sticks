var convert = require('convert');
var incrementSticks = require('incrementSticks');
var StickCounter = require('StickCounter');

test("Check number to word conversions", () => {
    expect(convert(14)).toBe("fourteen");
    expect(convert(67)).toBe("sixty seven");
});
test("check stick increment works", () => {
    expect(incrementSticks(2)).toBe(StickCounter + 2);
});