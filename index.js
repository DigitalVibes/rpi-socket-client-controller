var socket = require('socket.io-client')('http://192.168.1.111:4200');
const five = require('johnny-five');
const raspi = require('raspi-io');
const board = new five.Board({
	io: new raspi()
});

var relay;

board.on('ready', function() {
	relay = new five.Pin("P1-13");
});

socket.on('connect', function(){
	console.log('Connected');
	socket.emit('join', 'I am bulb');
});
socket.on('control', function(data){
	
	if (data === "on") {
		console.log('Switching the bulb on');
		relay.low();
	} else if (data === "off") {
		console.log('Switching the bulb off');
		relay.high();
	}
});
socket.on('disconnect', function(){
	console.log('Disconnected');
});