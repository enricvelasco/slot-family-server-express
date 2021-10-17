const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Board } = require("johnny-five");
const {startTrafficLight, yellowLed} = require( "./controllers/start-traffic-light");
const { startSensor1, startSensor2 } = require('./controllers/lap-sensor')

const app = express();
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const socket = new Server(server);

const http2 = require('http').Server(app);
// const io = require('socket.io')(http);

const io = require("socket.io")(http2, {
  origins: [
    "http://localhost:3000",
    "https://slot-family.vercel.app/"
  ]
});



app.use(cors());
app.options('*', cors());

const board = new Board();

let customSocket = null
let sensor1 = null
let sensor2 = null

let laps1 = 0
let laps2 = 0

board.on("ready", () => {
  console.log('board-READY')
  try {
    sensor1 = startSensor1()
    sensor2 = startSensor2()

    /*sensor1 && sensor1.on("change", function(val) {
      // console.log('SENSOR-1::::>', val);
      val === 0 && laps1++
      console.log('LAPS-1:::', laps1)
    });

    sensor2 && sensor2.on("change", function(val) {
      // console.log('SENSOR-2::::>', val);
      val === 0 && laps2++
      console.log('LAPS-2:::', laps2)
    });*/
  } catch (e) {
    console.log('SENSOR_EVENTS_ERROR', e)
  }


});

app.use(express.static(__dirname + '/'));

app.listen('8080', function() {
  console.log('Servidor web escuchando en el puerto 8080');
});

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

/*******************/


app.post('/start-traffic-light', (req, res) =>{
  startTrafficLight()
    .then(() => {
      res.end()
    })
})

app.post('/basic-race-info', (req, res) =>{
  customSocket.emit("new-basic-race",  req.body);
})

app.post('/start-yellow-light', (req, res) =>{
  yellowLed()
  res.end()
})

let isDisabledSensor2 = false
let isDisabledSensor1 = false

//Whenever someone connects this gets executed
io.on("connection", (socket) => {
  // console.log("New client connected");
  customSocket = socket
  // interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // clearInterval(interval);
  });

  sensor1 && sensor1.on("change", function(val) {
    if (val === 0) {
      !isDisabledSensor1 && customSocket.emit("Sensor1", 'FINISH_LAP_SENSOR_1"');
      isDisabledSensor1 = true
    } if (val === 1) {
      isDisabledSensor1 = false
    }
  });

  sensor2 && sensor2.on("change", function(val) {
    if (val === 0) {
      console.log('SENSOR_2',isDisabledSensor2)
      !isDisabledSensor2 && customSocket.emit("Sensor2", 'FINISH_LAP_SENSOR_2"');
      isDisabledSensor2 = true
    } if (val === 1) {
      isDisabledSensor2 = false
    }
  });
});

http2.listen(8000, function() {
  console.log('listening on *:8000');
});

