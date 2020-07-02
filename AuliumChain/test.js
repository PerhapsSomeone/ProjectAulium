const blockchain = require("./blockchain.js");

blockchain.initBlockchain();


blockchain.addNewBlock([
	{
		"type": "post",
		"content": "Test1"
	}
]);
blockchain.addNewBlock([
	{
		"type": "post",
		"content": "Test2"
	}
]);
blockchain.addNewBlock([
	{
		"type": "post",
		"content": "Test3"
	}
]);
blockchain.addNewBlock([
	{
		"type": "post",
		"content": "Test4"
	}
]);

let blockList = blockchain.getAllBlocks();

blockList.forEach((el) => {
	console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
	console.log("Hash: " + el.hash);
	console.log("Previous hash: " + el.prevHash);
	console.log("Data: " + JSON.stringify(el.data));
	console.log("Timestamp: " + el.timestamp);
	console.log("Nonce: " + el.nonce);
	console.log("Index: " + el.index);
});

console.log(blockchain.verifyChainIntegrity() ? "Check passed!" : "Check failed!");
