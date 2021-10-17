const { Sensor } = require("johnny-five");

module.exports.startSensor1 = () => {
  return new Sensor.Digital(8)
}

module.exports.startSensor2 = () => {
  return new Sensor.Digital(7)
  // return new Sensor.Analog('A0')
}
