const HID = require("node-hid");
const os = require("os")

/*
    Howdy!
    
    Welcome to node-buzz, a Node.js library for controlling the USB controllers for the Playstation 2 quiz game 'Buzz!'
    The Playstation 3 version might work but I haven't tested it.

    Terminology used:
        Buzz Device - One Buzz device, thse have 4 Buzz controllers, and connect to the PC with one USB connector.
        Buzz Controller - These are the actual controller objects, that have 4 coloured answer buttons, 1 big red confirm button, and an LED inside the big red button.
*/

class BuzzController {
    constructor(device,id) {
        this.device = device
        this.id = id
    }
}

class BuzzDevice {
    /*
        Construct a 'Buzz' device object. One 'Buzz' controller object corresponds to one physical 'Buzz' device, which contains 4 'Buzz' controllers.

    */
    constructor(opts) {
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

    }
}
module.exports = BuzzDevice