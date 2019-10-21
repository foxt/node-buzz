const HID = require("node-hid");
const os = require("os")
const EventEmitter = require("events")

/*
    Howdy!
    
    Welcome to node-buzz, a Node.js library for controlling the USB controllers for the Playstation 2 quiz game 'Buzz!'
    The Playstation 3 version might work but I haven't tested it.

    Terminology used:
        Buzz Device - One Buzz device, thse have 4 Buzz controllers, and connect to the PC with one USB connector.
        Buzz Controller - These are the actual controller objects, that have 4 coloured answer buttons, 1 big red confirm button, and an LED inside the big red button.
*/


function bufferToBString(array) {
    var bitsPerByte=8,string="";function repeat(r,t){if(0===r.length||t<=1)return 1===t?r:"";for(var e="",n=r;t>0;)1&t&&(e+=n),t>>=1,n+=n;return e}function lpad(r,t,e){return repeat(t,e-r.length)+r}Array.prototype.forEach.call(array,function(r){string+=lpad(r.toString(2),"0",bitsPerByte)});return string
}

function bStringToArray(bstring) {
    var s = bstring.split("");var a = [];for (var c of s) { a.push(c == "1") };return a
}

class BuzzController  {
    constructor(id,hid) {
        this.id = id
        this.hid = hid
        this.blue = false;this.orange = false; this.green = false; this.yellow = false; this.red = false
    }
    _handleButtonPress(event) {
        var controller = event[this.id]
        for (btn in controller) { this[btn] = event[btn] }

    }
}

class BuzzDevice extends EventEmitter {
    /*
        Construct a 'Buzz' device object. One 'Buzz' controller object corresponds to one physical 'Buzz' device, which contains 4 'Buzz' controllers.

    */
    constructor(opts) {
        super()
        opts = opts || {}
        this.opts = opts
        if (os.platform() == "linux" && opts.driver) {
            HID.setDriverType(opts.driver)
        }
        if (opts.usbPath) {
            this.device = new HID.HID(opts.usbPath)
        } else {
            this.device = new HID.HID(1356,4096)
        }
        var obj = this
        this.device.on("data",function(buffer) {
            obj.handleButtonPress(buffer)
        })
        this.lastEvent = [{blue: false,orange: false,green: false,yellow: false,red: false,},{blue: false,orange: false,green: false,yellow: false,red: false},{blue: false,orange: false,green: false,yellow: false,red: false},{blue: false,orange: false,green: false,yellow: false,red: false}]
    }
    handleButtonPress(buffer) {
        var array = bStringToArray(bufferToBString(buffer))
        var controllerState = [
            {
                blue: array[19],
                orange: array[20],
                green: array[21],
                yellow: array[22],
                red: array[23],
            },
            {
                blue: array[30],
                orange: array[31],
                green: array[16],
                yellow: array[17],
                red: array[18]
            },
            {
                blue: array[25],
                orange: array[26],
                green: array[27],
                yellow: array[28],
                red: array[29]
            },
            {
                blue: array[36],
                orange: array[37],
                green: array[38],
                yellow: array[39],
                red: array[24]
            }
        ]
        for (var i in controllerState) {
            for (var x in controllerState[i]) {
                if (controllerState[i][x] != this.lastEvent[i][x]) {
                    if (controllerState[i][x] == true) {
                        this.emit("buttondown",{
                            controllerId: i,
                            controller: controllerState[i],
                            button: x,
                        })
                    } else {
                        this.emit("buttonup",{
                            controllerId: i,
                            controller: controllerState[i],
                            button: x,
                        })
                    }
                }
            }
        }
        this.lastEvent = controllerState
    }
    light(lightState) {
        this.device.write([0,0,
            lightState[0] ? 255 : 0,
            lightState[1] ? 255 : 0,
            lightState[2] ? 255 : 0,
            lightState[3] ? 255 : 0,
        0,0])
    }
}
module.exports = BuzzDevice