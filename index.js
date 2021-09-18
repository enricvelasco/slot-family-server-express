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
  origins: ["http://localhost:3000"]
});



app.use(cors());
app.options('*', cors());

const board = new Board();

board.on("ready", () => {
  console.log('board-READY')

  const sensor1 = startSensor1()
  const sensor2 = startSensor2()

  sensor1.on("change", function(val) {
    console.log('SENSOR-1::::>', val);
    val === 0 && customSocket.emit("Sensor1", 'FINISH_LAP_SENSOR_1"');
  });

  sensor2.on("change", function(val) {
    console.log('SENSOR-2::::>', val);
    // customSocket.emit("Sensor2", 'SENSOR_2');
    val === 0 && customSocket.emit("Sensor2", 'FINISH_LAP_SENSOR_2"');
  });

});

app.use(express.static(__dirname + '/public'));

app.listen('8080', function() {
  console.log('Servidor web escuchando en el puerto 8080');
});

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

/*******************/
let customSocket = null

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

/* app.post('/start-lap-sensors', (req, res) =>{
  const sensor1 = startSensor1()
  const sensor2 = startSensor2()

  sensor1.on("change", function(val) {
    console.log('SENSOR-1::::>', val);
    val === 0 && customSocket.emit("Sensor1", 'FINISH_LAP_SENSOR_1"');
  });

  sensor2.on("change", function(val) {
    console.log('SENSOR-2::::>', val);
    // customSocket.emit("Sensor2", 'SENSOR_2');
    val === 0 && customSocket.emit("Sensor2", 'FINISH_LAP_SENSOR_2"');
  });

  res.end()
}) */

//Whenever someone connects this gets executed
io.on("connection", (socket) => {
  console.log("New client connected");
  customSocket = socket
  // interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

http2.listen(8000, function() {
  console.log('listening on *:8000');
});

