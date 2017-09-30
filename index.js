function findIndex(args, arg) {

    var len = args.length,
        i = 0;

    for (; i < len; i++) {
        if (args[i].match(arg)) {
            return i;
        }
    }

    return -1;

};
var hi = findIndex(process.argv, '--host');
var httpsi = findIndex(process.argv, '--https');
var pi = findIndex(process.argv, '--port');

var host = (hi === -1 ? '--host=localhost' : process.argv[hi]).split('=')[1];
var port = (pi === -1 ? '--port=4200' : process.argv[pi]).split('=')[1];
var protocol = httpsi === -1 ? 'http': 'https';

var socket = require('socket.io-client')(protocol + '://' + host + ':' + port);
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