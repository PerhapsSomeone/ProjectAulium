const blockchain = require("./blockchain.js");
const server = require('http').createServer();
const io = require('socket.io')(server);

server.listen(3000);

io.on('connection', (socket) => {
	console.log('A user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

blockchain.initBlockchain();

let eventBucket = [];
let lastBlockCreationTime = -1;
let lastBlockDone = true;

function addEvent(eventName, eventData) {

}

function createNewBlockCheck() {
	if(eventBucket.length > 10 && lastBlockDone) {
		lastBlockCreationTime = Date.now();

	}
}

setInterval(createNewBlockCheck, 1000 * 30);

