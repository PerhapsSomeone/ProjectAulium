const blockchain = require("./blockchain.js");

blockchain.initBlockchain();


blockchain.addNewBlock("Moin");
blockchain.addNewBlock("Hallo");
blockchain.addNewBlock("Wie geht's?");
blockchain.addNewBlock("Gut!");
blockchain.addNewBlock("Schön :)");

let blockList = blockchain.getAllBlocks();

blockList.forEach((el) => {
	console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
	console.log("Hash: " + el.hash);
	console.log("Previous hash: " + el.prevHash);
	console.log("Message: " + el.data);
	console.log("Timestamp: " + el.timestamp);
	console.log("Index: " + el.index);
});

console.log(blockchain.verifyChainIntegrity() ? "Check passed!" : "Check failed!");
