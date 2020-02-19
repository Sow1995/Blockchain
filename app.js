// Use
const axios = require('axios');
const crypto = require('crypto');
const { performance } = require('perf_hooks');

// Settings
const getUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain/next';
const postUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain';
const user = 'Leon 0955849';

// Timers
let t0;
let t1;
let t2;
let t3;
let t4;
let t5;
/////////

getBlockAndStartMining();

// Functions

	// Axios Get Request
	function getBlockAndStartMining(){
		t0 = performance.now();
		axios.get(getUrl)
		.then(r => {
			let blockInfo = r.data;
			if (blockInfo.open === true){
				let lastBlockString = createLastBlockString(blockInfo);
				let hashOfLastBlock = createLastBlockHash(lastBlockString);
				let newBlockString = createNewBlockString(hashOfLastBlock, blockInfo);
				let noncefound = findNonceWithNumbers(newBlockString);
				//postNonce(noncefound);
				console.log('nonce: ' + noncefound);
				t1 = performance.now();
				console.log("Checking the blockchain took: " + (t1 - t0) + " milliseconds.");
				console.log("Counting for the nonce: " + (t5 - t4) + " milliseconds.");
				getBlockAndStartMining();
			}else{
				console.log('Blockchain is closed for ' + (blockInfo.countdown / 1000) + 's');
				t1 = performance.now();
				console.log("Checking the blockchain took: " + (t1 - t0) + " milliseconds.");
				setTimeout(() => getBlockAndStartMining(), (blockInfo.countdown / 10));
			}
		})
		.catch(e => {
			 console.log(e);
		});
	}
	
	// Functions
	function createLastBlockString(blockInfo){
		return blockInfo.blockchain.hash + blockInfo.blockchain.data[0].from + blockInfo.blockchain.data[0].to + blockInfo.blockchain.data[0].amount + blockInfo.blockchain.data[0].timestamp + blockInfo.blockchain.timestamp + blockInfo.blockchain.nonce;
	}

	function createLastBlockHash(lastBlockString){
		return to265(mod10sha(lastBlockString));
	}

	function createNewBlockString(hashOfLastBlock, blockInfo){
		return hashOfLastBlock + blockInfo.transactions[0].from + blockInfo.transactions[0].to + blockInfo.transactions[0].amount + blockInfo.transactions[0].timestamp + blockInfo.timestamp;
	}

	function findNonceWithNumbers(newBlockString){
		t4 = performance.now()
		for( let nonce = 0; 1 == 1; nonce++){
			let newBlockStringWithNonce = to265(mod10sha(newBlockString + nonce));
			if(isThisAZero(newBlockStringWithNonce, nonce)){
				t5 = performance.now()
				return nonce;
			}
		};

		// t4 = performance.now()
		// let nonce = 0;
		// let hashedNewBlock = '12345';
		
		// while (hashedNewBlock.slice(0,4) !== '0000') {
		// 	nonce++
		// 	hashedNewBlock = to265(mod10sha(newBlockString + nonce));
			
		// }
		// t5 = performance.now()
		// return nonce
	}

	function to265(data){
		return crypto.createHash('sha256').update(data).digest('hex');
	}

	function isThisAZero(hash, nonce){
		if (hash.slice(0,4) == '0000'){
			return nonce;
		}
	}

	function postNonce(n) {
		axios.post(postUrl, {
			user: user,
			nonce: n
		})
		.then(function (response) {
			if(response.data.message === 'blockchain accepted, user awarded'){
				console.log('Succesfully mined the block!');
				console.log('Used nonce: ' + n);
				t1 = performance.now();
				console.log("Finding the nonce took: " + (t1 - t0) + " milliseconds.");
				console.log("mod10sha took: " + (t3 - t2) + " milliseconds.");
				getBlockAndStartMining();
			}else{
				console.log(n + ' is (probably) not the right nonce! See message below');
				console.log(response.data.message);
				t1 = performance.now();
				console.log("Finding the nonce took: " + (t1 - t0) + " milliseconds.");
				console.log("mod10sha took: " + (t2 - t2) + " milliseconds.");
				getBlockAndStartMining();
			}
		})
		.catch(function (e) {
			console.log(e);
		});
	}
	
	

	// Convert data to sha265
	function mod10sha(data){
		t2 = performance.now();
		data = data.replace(/\s+/g, '');

		let numberArray = []
		data.split('').forEach(function (n) {
			if(!(isNaN(n))){
				numberArray.push(n);
			}else{
				numberArray.push(n.charCodeAt(0));
			}
		});

		let splitArray = []
		for (let val of numberArray) {
			val.toString().split('').forEach(function (n){
				splitArray.push(parseInt(n));
			})
		};

		let howMuch = 10 - (splitArray.length%10);
		for (let i = 0; i < howMuch; i++) {
			splitArray.push(i);
		}
		
		let multipleOfTenArray = []
        while (splitArray.length) {
			multipleOfTenArray.push(splitArray.splice(0, 10));
		}

		function mod10(collection, summary) {
			if (collection.length === 0) {
				return summary;
			}
			return mod10(collection, addition(summary, ...collection.splice(0, 1)));
		}
		
		function addition(arr1, arr2) {
			let arr = [];
		
			for (let i = 0; i < 10; i++) {
				arr.push((arr1[i] + arr2[i]) % 10);
			}
			return arr;
		}
		let lastArray = mod10(multipleOfTenArray, ...multipleOfTenArray.splice(0, 1));
		let lastString = '';
		for(let i = 0; i < lastArray.length; i++){
			lastString+=lastArray[i];
		}
		t3 = performance.now();
		return lastString;
	}