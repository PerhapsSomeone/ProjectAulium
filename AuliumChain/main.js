const blockchain = require("./blockchain.js");
const server = require('http').createServer();
const io = require('socket.io')(server);

server.listen(3000);

io.on('connection', (socket) => {
	console.log('A user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	socket.on("MINING_BLOCK_SUBMISSION", (data) => {
		if(data === undefined) return;
		console.log("Received nonce submission! " + JSON.stringify(data));
		processBlockHashSubmission(data.index, data.nonce)
	});

});

blockchain.initBlockchain();

let eventBucket = [];
let lastBlockDone = true;

let blockInProgress = undefined;

function addEvent(eventName, eventData) {
	eventBucket.push({"type": eventName, "eventData": eventData});
}

function processBlockHashSubmission(index, nonce) {
	if(index !== blockInProgress.index) return false;

	if(nonce === undefined) return false;

	let localComputedHash = blockchain.hashBlock(blockInProgress.block_data,
		blockInProgress.timestamp,
		blockInProgress.prevHash,
		blockInProgress.index,
		nonce,
		true).hash;

	if(!blockchain.isHashValid(localComputedHash)) return false;

	lastBlockDone = true;
	let fullBlock = blockchain.hashBlock(blockInProgress.block_data,
		blockInProgress.timestamp,
		blockInProgress.prevHash,
		blockInProgress.index,
		nonce,
		true)
	blockchain.blocks.push(fullBlock);
	io.sockets.emit("MINING_ASSIGNMENT_DONE", {"index": index});
	io.sockets.emit("BLOCKCHAIN_NEW_BLOCK", fullBlock);
}

function createNewBlockCheck() {
	if(eventBucket.length > 10 && lastBlockDone) {
		lastBlockDone = false;
		blockData = eventBucket;
		eventBucket = [];

		blockInProgress = {
			"block_data": blockData,
			"prevHash": blockchain.getLastHash(blockchain.blocks),
			"index": blockchain.blocks.length,
			"timestamp": Date.now()
		}

		io.sockets.emit("MINING_ASSIGNMENT_NEW_BLOCK", blockInProgress);
		console.log("New mining task distributed.")
	} else {
		if(blockInProgress === undefined) return;
		io.sockets.emit("MINING_ASSIGNMENT_REPEAT", blockInProgress);
		console.log("Mining task re-broadcasted.")
	}
}

setInterval(createNewBlockCheck, 1000 * 20);

function mockData() {
	for(let i = 0; i < 20; i++) {
		addEvent("post", { "content": "yeet" });
	}
}

setInterval(mockData, 1000 * 5);
