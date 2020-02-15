// Use
const axios = require('axios');
const crypto = require('crypto');

// Settings
const getUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain/next';
const postUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain';

// Const
const user = 'Leon de Klerk';
const nonce = null;

// Excecute
mod10sha('dit is 1011111111')


// Functions

	// Mine a block
	function mineBlock(){
		//mine block
	}

	// Get next block
	function getNextBlock() {
		axios.get(getUrl)
		.then(function (block) {
			return block
		})
		.catch(function (error) {
			console.log(error)
		});
	}
	
	// Post nonce to blockchain
	function postNonce() {
		axios.post(postUrl, {
			user: user,
			nonce: nonce
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

		let lastArray = []
		for (let i = 0; i < (multipleOfTenArray.length - 1); i++){
			for (let o = 0; o < 10; o++){
				lastArray.push(multipleOfTenArray[i][o] + multipleOfTenArray[(i+1)][o])
			}
		}

		let lastString = lastArray.toString().replace(/,/g, '');
		


		console.log('Multiple of 10 array:')
		console.log(multipleOfTenArray)
		console.log(lastString)

	}