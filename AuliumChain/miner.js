let socket = require('socket.io-client')('http://localhost:3000');
let blockchain = require("./blockchain");
const { Worker } = require('worker_threads')

function runService(workerData) {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./miner_core.js', { workerData });
		worker.on('message', resolve);
		worker.on('error', reject);
		worker.on('exit', (code) => {
			if (code !== 0)
				reject(new Error(`Worker stopped with exit code ${code}`));
		})
	})
}

socket.on('connect', function() {
	console.log("Connected.")
});

socket.on('disconnect', function() {
	console.log("Disconnected.")
});

let blockTask = undefined;
let blockFound = false;
let nonce = undefined;

socket.on("MINING_ASSIGNMENT_NEW_BLOCK", function (block) {
	blockTask = block;
	blockFound = false;
	runWorker(blockTask);
});

function postNonce(nonce, index) {
	socket.emit("MINING_BLOCK_SUBMISSION", { "nonce": nonce, "index": index });
}

async function runWorker(blockData) {
	const result = await runService(blockData)
	if(result === undefined) return;
	console.log("Sending nonce submission: " + JSON.stringify(result));
	if(result.index !== blockTask.index) return;

	postNonce(result.nonce, result.index);
}
