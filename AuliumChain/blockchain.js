const sha3 = require('js-sha3').sha3_224;

const blockchain = (function(){
	let blocks = []

	const initBlockchain = () => {
		const data = 'Genesis! The beginning of the chain. Great things will follow.'
		const timestamp = new Date()
		const previousHash = 0
		const index = 0

		addBlock(hashBlock(data, timestamp, previousHash, index));
	}

	const hashBlock = (data, timestamp, prevHash, index, nonce = undefined) => {
		let hash = '';
		let originalNonce = '';

		console.time("Block " + index);
		while( !isHashValid(hash) ){
			let input = `${data}${timestamp}${prevHash}${index}${nonce}`
			hash = sha3(input)
			originalNonce = nonce;
			nonce = Array(32+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 32);
		}
		console.timeEnd("Block " + index);

		return {
			hash,
			data,
			timestamp,
			prevHash,
			index,
			nonce: originalNonce
		};
	}

	const addBlock = (block) => blocks.push(block);

	const getLastHash = blocks => blocks.slice(-1)[0].hash;

	const getLastBlock = blocks => blocks.slice(-1)[0]

	const isHashValid = hash => hash.startsWith('0000') // Difficulty

	const addNewBlock = data => {
		const index = blocks.length
		const previousHash = getLastHash(blocks)
		addBlock(hashBlock(data, new Date(), previousHash, index))
	}

	const getAllBlocks = () => blocks

	const importBlockchain = (blockchain) => {
		blocks = blockchain;
	}

	const verifyChainIntegrity = () => {

		for(let i = blocks.length - 1; i > 1; i--) {
			console.log(`${blocks[i].prevHash} === ${blocks[i-1].hash}`)
			if(blocks[i].prevHash !== blocks[i-1].hash) {
				return false;
			}
			if(!isHashValid(blocks[i].hash)) return false;
		}

		console.log("Hash-chain integrity confirmed. Verifying hashes...");

		for(let i = 0; i < blocks.length - 1; i++) {
			let blockHash = hashBlock(
				blocks[i].data,
				blocks[i].timestamp,
				blocks[i].prevHash,
				blocks[i].index,
				blocks[i].nonce).hash;

			if(blockHash !== blocks[i].hash) {
				return false;
			}

			console.log(`${blockHash} === ${blocks[i+1].prevHash}`);

			if(blockHash !== blocks[i+1].prevHash) {
				return false;
			}
		}


		return true;
	}

	return {
		initBlockchain,
		getLastHash,
		blocks,
		hashBlock,
		getAllBlocks,
		addNewBlock,
		importBlockchain,
		verifyChainIntegrity
	}
})()

module.exports = blockchain
