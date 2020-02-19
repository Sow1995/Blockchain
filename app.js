// Use
const axios = require('axios');
const crypto = require('crypto');

// Settings
const getUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain/next';
const postUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain';

// Const
const user = 'Leon';

/////////

//getNextBlock()

// Functions

	// Mine a block

	// Get next block
	function getNextBlock() {
		axios.get(getUrl)
		.then((block) => {
			if (block.data.open == true) {
				let lastBlockString = block.data.blockchain.hash + block.data.blockchain.data[0].from + block.data.blockchain.data[0].to + block.data.blockchain.data[0].amount + block.data.blockchain.data[0].timestamp + block.data.blockchain.timestamp + block.data.blockchain.nonce
				console.log(lastBlockString)
				let hashOfLastBlock = to265(mod10sha(lastBlockString));
				console.log(hashOfLastBlock)
				let newBlockString = hashOfLastBlock + block.data.transactions[0].from + block.data.transactions[0].to + block.data.transactions[0].amount + block.data.transactions[0].timestamp + block.data.timestamp
				console.log(newBlockString)
				let newBlockStringWithNonce = ''
				for( let nonce = 0; 1 == 1; nonce++){
					newBlockStringWithNonce = newBlockString + nonce
					newBlockStringWithNonce = to265(mod10sha(newBlockStringWithNonce));
					let isThisAZero = newBlockStringWithNonce.slice(0,4)
					if (isThisAZero == '0000'){
						postNonce(nonce)
					}
				}
			}else{
			console.log('Blockchain is closed for ' + (block.data.countdown / 1000) + 's')
			setTimeout(() => getNextBlock(), (block.data.countdown / 10))
			}
		})
		.catch(function (error) {
			return console.log(error)
		});
	}
	
	// Post nonce to blockchain
	function postNonce(n) {
		axios.post(postUrl, {
			user: user,
			nonce: n
		})
		.then(function (response) {
			console.log(response.data.message)
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