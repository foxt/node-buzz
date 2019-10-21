const Buzz = require("./index.js")

const buzz = new Buzz({
    driver: "hidraw",
    usbPath: "/dev/hidraw6"
});
buzz.device.on("data",function(array) {
    var bitsPerByte = 8;
var string = "";

function repeat(str, num) {
    if (str.length === 0 || num <= 1) {
        if (num === 1) {
            return str;
        }

        return '';
    }

    var result = '',
        pattern = str;

    while (num > 0) {
        if (num & 1) {
            result += pattern;
        }

        num >>= 1;
        pattern += pattern;
    }

    return result;
}

function lpad(obj, str, num) {
    return repeat(str, num - obj.length) + obj;
}

Array.prototype.forEach.call(array, function (element) {
    string += lpad(element.toString(2), "0", bitsPerByte);
});

console.log(string);
})
console.log(buzz.device)
