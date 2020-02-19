// Use
const axios = require('axios');
const crypto = require('crypto');
const { performance } = require('perf_hooks');

// Settings
const getUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain/next';
const postUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain';

// Const
const user = 'Leon 0955849';

/////////
let t0 = performance.now();
getBlockAndStartMining()

// Functions

	// Axios Get Request
	function getBlockAndStartMining(){
		axios.get(getUrl)
		.then(r => {
			let blockInfo = r.data
			if (blockInfo.open === true){
				let lastBlockString = createLastBlockString(blockInfo)
				let hashOfLastBlock = createLastBlockHash(lastBlockString)
				let newBlockString = createNewBlockString(hashOfLastBlock, blockInfo)
				let noncefound = findNonceWithNumbers(newBlockString)
				postNonce(noncefound)
			}else{
				console.log('Blockchain is closed for ' + (blockInfo.countdown / 1000) + 's')
				setTimeout(() => getBlockAndStartMining(), (blockInfo.countdown / 10))
			}
		})
		.catch(e => {
			 console.log(e)
		});
	}
	
	// Functions
	function createLastBlockString(blockInfo){
		return blockInfo.blockchain.hash + blockInfo.blockchain.data[0].from + blockInfo.blockchain.data[0].to + blockInfo.blockchain.data[0].amount + blockInfo.blockchain.data[0].timestamp + blockInfo.blockchain.timestamp + blockInfo.blockchain.nonce
	}

	function createLastBlockHash(lastBlockString){
		return to265(mod10sha(lastBlockString))
	}

	function createNewBlockString(hashOfLastBlock, blockInfo){
		return hashOfLastBlock + blockInfo.transactions[0].from + blockInfo.transactions[0].to + blockInfo.transactions[0].amount + blockInfo.transactions[0].timestamp + blockInfo.timestamp
	}

	function findNonceWithNumbers(newBlockString){
		for( let nonce = 0; 1 == 1; nonce++){
			let newBlockStringWithNonce = to265(mod10sha(newBlockString + nonce));
			if(isThisAZero(newBlockStringWithNonce, nonce)){
				return nonce
			}
		}
	}

	function isThisAZero(hash, nonce){
		if (hash.slice(0,4) == '0000'){
			return nonce
		}else{
			false
		}
	}

	function postNonce(n) {
		axios.post(postUrl, {
			user: user,
			nonce: n
		})
		.then(function (response) {
			if(response.data.message === 'blockchain accepted, user awarded'){
				console.log('Succesfully mined the block!')
				console.log('Used nonce: ' + n)
				let t1 = performance.now();
				console.log("Finding the nonce took: " + (t1 - t0) + " milliseconds.");
				getBlockAndStartMining()
			}else{
				console.log(n + ' is (probably) not the right nonce! See message below')
				console.log(response.data.message)
				var t1 = performance.now();
				console.log("Finding the nonce took: " + (t1 - t0) + " milliseconds.");
				getBlockAndStartMining()
			}
		})
		.catch(function (e) {
			console.log(e)
		});
	}
	
	

	// Convert data to sha265
	function to265(data){
		return crypto.createHash('sha256').update(data).digest('hex');
	}

	function mod10sha(data){
		data = data.replace(/\s+/g, '');

		let numberArray = []
		data.split('').forEach(function (n) {
			if(!(isNaN(n))){
				numberArray.push(n)
			}else{
				numberArray.push(n.charCodeAt(0));
			}
		});

		let splitArray = []
		for (let val of numberArray) {
			val.toString().split('').forEach(function (n){
				splitArray.push(parseInt(n))
			})
		}

		
		let counted = splitArray.length
		let howMuch = 10 - (counted%10)
		for (let i = 0; i < howMuch; i++) {
			splitArray.push(i)
		}
		
		let multipleOfTenArray = []
        while (splitArray.length) {
			multipleOfTenArray.push(splitArray.splice(0, 10));
		}

		function mod10(collection, summary) {
			if (collection.length === 0) {
				return summary
			}
			return mod10(collection, addition(summary, ...collection.splice(0, 1)))
		}
		
		function addition(arr1, arr2) {
			let arr = [];
		
			for (let i = 0; i < 10; i++) {
				arr.push((arr1[i] + arr2[i]) % 10)
			}
			return arr;
		}
		let lastArray = mod10(multipleOfTenArray, ...multipleOfTenArray.splice(0, 1));
		let lastString = ''
		for(let i = 0; i < lastArray.length; i++){
			lastString+=lastArray[i]
		}
		return lastString
	}