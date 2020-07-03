const { workerData, parentPort } = require('worker_threads')
const blockchain = require("./blockchain.js");

let hash = blockchain.hashBlock(workerData.block_data, workerData.timestamp, workerData.prevHash, workerData.index);
parentPort.postMessage({ "nonce": hash.nonce, "index": workerData.index });

parentPort.on("message", message => {
	if(message === "exit") {
		parentPort.close();
		process.exit();
	}
})