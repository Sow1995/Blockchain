// Use
const axios = require('axios');
const crypto = require('crypto');

// Settings
const getUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain/next';
const postUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain';
const user = 'Leon 0955849';

getBlockAndStartMining();

// Functions

	// Axios Get Request
	function getBlockAndStartMining(){
		axios.get(getUrl)
		.then(r => {
			let blockInfo = r.data;
			if (blockInfo.open === true){
				let lastBlockString = createLastBlockString(blockInfo);
				let hashOfLastBlock = createLastBlockHash(lastBlockString);
				let newBlockString = createNewBlockString(hashOfLastBlock, blockInfo);
				let noncefound = findNonceWithNumbers(newBlockString);
				postNonce(noncefound);
				getBlockAndStartMining();
			}else{
				console.log('Blockchain is closed for ' + Math.round(blockInfo.countdown / 1000) + 's');
				setTimeout(() => getBlockAndStartMining(), (blockInfo.countdown / 10));
			}
		})
		.catch(e => {
			 console.log(e);
		});
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
			}else{
				console.log(n + ' is (probably) not the right nonce! See message below');
				console.log(response.data.message);
			}
		})
		.catch(function (e) {
			console.log(e.response.data);
		});
	}
	
	// Functions
	function createLastBlockString(b){
		return b.blockchain.hash + b.blockchain.data[0].from + b.blockchain.data[0].to + b.blockchain.data[0].amount + b.blockchain.data[0].timestamp + b.blockchain.timestamp + b.blockchain.nonce;
	}

	function createLastBlockHash(lastBlockString){
		return to265(mod10sha(lastBlockString));
	}

	function createNewBlockString(h, b){
		return h + b.transactions[0].from + b.transactions[0].to + b.transactions[0].amount + b.transactions[0].timestamp + b.timestamp;
	}

	function findNonceWithNumbers(d){
		for( let i = 1500; 1 == 1; i++){
			nonce = 'https://coins.cmgt.dev?v=kMlLz7stjwc?' + i + '&name=Leon%200955849';
			//nn = 'https://www.youtube.com/watch?v=kMlLz7stjwc?' + i + '????CHECK-OUT->>>>>>>>>https://COINS.CMGT.DEV' ; 
			let w = to265(mod10sha(d + nonce));
			if(isThisAZero(w, nonce)){
				return nonce;
			}
		};
	}

	function to265(d){
		return crypto.createHash('sha256').update(d).digest('hex');
	}

	function isThisAZero(hash, nonce){
		if (hash.slice(0,4) == '0000'){
			return nonce;
		}
	}
	
	

	// Convert data to sha265
	function mod10sha(data){
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
		return lastString;
	}