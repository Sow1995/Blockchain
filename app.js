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
axios.get(getUrl)
.then(function (newBlock) {

})
.catch(function (error) {
	console.log(error)
});


// Functions

	// Mine a block
	function mineBlock(){
		//mine block
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