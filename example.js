const Buzz = require("./index.js")


// Initialize Buzz controller
const buzz = new Buzz({});

// Idle animation which turns on each LED in turn.
var flashIndex = -1;
var ls = [false,false,false,false]
setInterval(function() { // PWM
    buzz.light(ls)
    buzz.light(lightState)
},10)

setInterval(function() {
    flashIndex += 1
    ls = [false,false,false,false]
    ls[flashIndex % 10] = true
}, 100)


// Light controllers with a button pressed down
var lightState = [false,false,false,false]

buzz.on("buttondown",function(event) {
    console.log(`Button ${event.button} on controller ${event.controllerId} down`)
    lightState[event.controllerId] = true
    buzz.light(lightState)
})
buzz.on("buttonup",function(event) {
    console.log(`Button ${event.button} on controller ${event.controllerId} up`)
    lightState[event.controllerId] = false
    buzz.light(lightState)
})


console.log("Ready! Press a button on any controller!")