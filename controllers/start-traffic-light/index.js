const { Led } = require("johnny-five");

const allReds = val => {
  redLed1(val)
  redLed2(val)
  redLed3(val)
  redLed4(val)
  redLed5(val)
}

const allLights = (val) => {
  allReds(val)
  yellowLed(val)
  greenLed(val)
}

const redLed1 = (val = true) => {
  let led = new Led(13);
  val ? led.on() : led.off()
}

const redLed2 = (val = true) => {
  let led = new Led(12);
  val ? led.on() : led.off()
}

const redLed3 = (val = true) => {
  let led = new Led(11);
  val ? led.on() : led.off()
}

const redLed4 = (val = true) => {
  let led = new Led(10);
  val ? led.on() : led.off()
}

const redLed5 = (val = true) => {
  let led = new Led(9);
  val ? led.on() : led.off()
}

const greenLed = (val = true) => {
  const led = new Led(3);
  val ? led.on() : led.off()
}

const yellowLed = (val = true) => {
  const led = new Led(2);
  val ? led.on() : led.off()
}

module.exports.startTrafficLight = async () => {
  return new Promise(function(resolve, reject) {
    allLights()
    setTimeout(() => {
      allLights(false)
      yellowLed()
      setTimeout(() => {
        yellowLed(false)
        redLed1()
        setTimeout(() => {
          redLed2()
          setTimeout(() => {
            redLed3()
            setTimeout(() => {
              redLed4()
              setTimeout(() => {
                redLed5()
                setTimeout(() => {
                  allLights(false)
                  resolve()
                }, 3000)
              }, 1500)
            }, 1500)
          }, 1500)
        }, 1500)
      }, 3000)
    }, 2500);
  })
}
