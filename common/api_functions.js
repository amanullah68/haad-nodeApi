var constants = require("./constants.js");
var bitcoin = require("bitcoinjs-lib");
var querystring = require("querystring");
const http = require("http");
var crypto = require("crypto");


var log4js = require("log4js");
log4js.configure({
	appenders: [
		{ type: "console" },
		{ type: "file", filename: "logs/logdata.log", category: "output" }
	]
});
var logger = log4js.getLogger("output");
var broadcast;
var asset;
var api_functions = {
	get_all_notifications: async function(bitcoin_address, callback) {
		return callback(null, "done");
	},
	issue_assets_units: function(
		sender_bitcoin_address,
		receiver_bitcoin_address,
		sender_wif,
		metadata,
		callback
	) {
		issue_assets(
			sender_bitcoin_address,
			receiver_bitcoin_address,
			sender_wif,
			metadata,
			function(err, body) {
				if (err) {
					logger.error("error4: " + err);
					return callback("error 5", err);
				} else {
					asset = JSON.parse(body);
					return callback(null, asset);
				}
			}
		);
	},

	// add this one
	check_tx_confirmation: function(txHash, callback) {
		check_tx(txHash, function(err, body) {
			if (err) {
				logger.error("error4: " + err);
				return callback("error 5", err);
			} else {
				asset = JSON.parse(body);
				return callback(null, asset);
			}
		});
	},
	get_asset_units: function(assetid, txid, index, callback) {
		var info = getFromApi(
			"assetmetadata",
			assetid + "/" + txid + ":" + index,
			function(err, body) {
				if (err) {
					logger.error("error4: " + err);
					return callback("error 5", err);
				} else {
					return callback(null, body);
				}
			}
		);
		return info;
	}, //end of get_asset_units
	transfer_asset_units: function(
		assetId,
		txId,
		archive_address,
		sender_bitcoin_address,
		sender_wif,
		requester,
		callback
	) {
		var send_asset = {
			from: [sender_bitcoin_address],
			fee: 5000,
			to: [
				{
					address: archive_address,
					amount: 1,
					assetId: assetId
				}
			]
		};

		postToApi("sendasset", send_asset, function(err, body) {
			if (err) {
				logger.error("error 9: " + err);
				callback(err, null);
			} else {
				var sign = signTx(body.txHex, sender_wif);
				var data_params = {
					txHex: sign
				};
				postToApi("broadcast", data_params, function(err, body) {
					if (err) {
						logger.error("error 45: " + err);
						callback(err, null);
					} else {
						logger.info("archive broadcast: ", body);
						logger.info("sender bitcoin address: ", sender_bitcoin_address);
						logger.info("archive address: ", archive_address);
						logger.info("asset Id: ", assetId);
						logger.info("requester: ", requester);
						logger.info("", "");

						broadcast = body;
						callback(null, broadcast);
					}
				});
			}
		});
	}, //end of transfer_asset_units

	generate_address: function(callback) {
		var key = bitcoin.ECKey.makeRandom();
		var address = key.pub.getAddress(bitcoin.networks.testnet).toString();
		var wif = key.toWIF();
		return callback(address, wif);
	}
};
module.exports = api_functions;

//add here new function

async function check_tx(txHash, callback) {
	const initiateContractData = querystring.stringify({
		txHash: txHash
	});
	console.log('here1');

	return await postToApi(
		"/ethereum/contract/getTransactionReceipt",
		initiateContractData,
		async function(err, body) {
			if (err) {
				callback(err);
			} else {
				callback(null, body);
			}
		}
	);
}

async function issue_assets(
	sender_bitcoin_address,
	receiver_bitcoin_address,
	sender_wif,
	metadata,
	callback
) {
	var applicant;

	var keyy = "uswbweb23212312b3jb3j1b2j3b12jb31b2jb13jb131j2b3j1b3";
	// Birth Certificate start
	if (metadata.assetId == 0) {
		const abi = '[{\"constant\":false,\"inputs\":[{\"name\":\"approvel1\",\"type\":\"string\"},{\"name\":\"status1\",\"type\":\"string\"},{\"name\":\"owner1\",\"type\":\"address\"}],\"name\":\"HAADApprovel\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getEmiratesId\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"status\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getNumberOfFetus\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getInfo1\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getInfo\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"},{\"name\":\"\",\"type\":\"address\"},{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"string\"},{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getBabyNameAR\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getRelationship\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"baby_name_en\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"number_of_fetus1\",\"type\":\"string\"},{\"name\":\"date_of_birth1\",\"type\":\"string\"},{\"name\":\"status1\",\"type\":\"string\"},{\"name\":\"haad_offical1\",\"type\":\"address\"}],\"name\":\"nurseUpdate\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getBabyNameEN\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"notification_id\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"owner1\",\"type\":\"address\"},{\"name\":\"baby_name_en1\",\"type\":\"string\"},{\"name\":\"baby_name_ar1\",\"type\":\"string\"},{\"name\":\"hospital_born1\",\"type\":\"string\"},{\"name\":\"applicant_name1\",\"type\":\"string\"},{\"name\":\"telephone1\",\"type\":\"string\"},{\"name\":\"emirates_id1\",\"type\":\"string\"},{\"name\":\"relationship1\",\"type\":\"string\"},{\"name\":\"address_area1\",\"type\":\"string\"},{\"name\":\"nurse1\",\"type\":\"address\"},{\"name\":\"status1\",\"type\":\"string\"},{\"name\":\"notification_id1\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"}]';

		if (metadata.issuer === "user") {
			var contract = require("../contracts/birthCertificate");

			var owner1 = receiver_bitcoin_address;
			const baby_name_en1 = metadata.newborn_info.name_en;
			const baby_name_ar1 = metadata.newborn_info.name_ar;
			const hospital_born1 = metadata.newborn_info.hospital;
			var applicant_name1;
			var relationship1;

			if (applicant == null || applicant == undefined) {
				if (
					metadata.father_info.last_name != null ||
					metadata.father_info.last_name != undefined
				) {
				} else {
					applicant_name1 = metadata.father_info.first_name;
				}
				relationship1 = "Father";
			} else {
				applicant_name1 = applicant;
				relationship1 = applicant;
			}
			const telephone1 = metadata.mother_info.phone_no;
			const emirates_id1 = metadata.mother_info.emirates_id;
			const address_area1 = metadata.mother_info.permanent_residence_city;
			const nurse1 = receiver_bitcoin_address;
			const status1 = "nurse_reviewed";
			const notification_id1 = metadata.n_id;

			const params = {
				owner1: sender_wif,owner1,
				baby_name_en1: await encryptValue(keyy,baby_name_en1),
				baby_name_ar1: await encryptValue(keyy,baby_name_ar1),
				hospital_born1: await encryptValue(keyy,hospital_born1),
				applicant_name1: await encryptValue(keyy,applicant_name1),
				telephone1: await encryptValue(keyy,telephone1),
				emirates_id1: await encryptValue(keyy,emirates_id1),
				relationship1: await encryptValue(keyy,relationship1),
				address_area1: await encryptValue(keyy,address_area1),
				nurse1:sender_bitcoin_address,nurse1,
				status1: await encryptValue(keyy,status1),
				notification_id1: await encryptValue(keyy,notification_id1)
			};

			const b = JSON.stringify(params);
			const postData = querystring.stringify({
				params: b,
				contractName: contract.contractName,
				fileData: contract.fileData,
				address: sender_bitcoin_address,
				privateKey: sender_wif
			});

			return await postToApi(
				"/ethereum/contract/deploy",
				postData,
				async function(err, body) {
					if (err) {
						callback(err);
					} else {
						callback(null, body);
					}
				}
			);
		} else if (metadata.issuer === "nurse") {
			const txHash = metadata.tx_hash;
			const number_of_fetus = metadata.newborn_info.number_of_fetus;
			const date_of_birth = metadata.birth_info.dob_in_letters;
			const haad_offical = receiver_bitcoin_address;

			const params = {
				number_of_fetus1: await encryptValue(keyy,number_of_fetus),
				date_of_birth1: await encryptValue(keyy,date_of_birth),
				status1: await encryptValue(keyy,"submitted"),
				haad_offical1: haad_offical
			};

			const b = JSON.stringify(params);
			const initiateContractData = querystring.stringify({
				params: b,
				abi: abi,
				txHash: txHash,
				method: "nurseUpdate",
				address: sender_bitcoin_address,
				privateKey: sender_wif
			});

			console.log('initiate contract', initiateContractData)

			return await postToApi(
				"/ethereum/contract/setContractMethod",
				initiateContractData,
				async function(err, body) {
					if (err) {
						callback(err);
					} else {
						callback(null, body);
					}
				}
			);
		} else if (metadata.issuer === "HAAD") {
			const txHash = metadata.tx_hash;
			const approvel1 = metadata.application_status;
			const status1 = metadata.application_status;
			const updateowner = receiver_bitcoin_address;

			const params = {
				approve11: await encryptValue(keyy,approvel1),
				status1: await encryptValue(keyy,status1),
				owner1: updateowner
			};

			const b = JSON.stringify(params);
			const initiateContractData = querystring.stringify({
				params: b,
				abi: abi,
				txHash: txHash,
				method: "HAADApprovel",
				address: sender_bitcoin_address,
				privateKey: sender_wif
			});

			return await postToApi(
				"/ethereum/contract/setContractMethod",
				initiateContractData,
				async function(err, body) {
					if (err) {
						callback(err);
					} else {
						callback(null, body);
					}
				}
			);
		} else {
			callback(null, "User not found");
		}
	}

	// Death Certificate start from here
	else if (metadata.assetId == 1) {
		const abi =
			'[{\"constant\":true,\"inputs\":[],\"name\":\"getValues\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"status\",\"outputs\":[{\"name\":\"\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"late_name_en\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"approvel1\",\"type\":\"bytes10\"},{\"name\":\"status1\",\"type\":\"bytes32\"},{\"name\":\"owner1\",\"type\":\"address\"}],\"name\":\"HAADApprovel\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"notification_id\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"a1\",\"type\":\"string\"},{\"name\":\"mortery1\",\"type\":\"address\"}],\"name\":\"physicianUpdate\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getLateNameEN\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"status1\",\"type\":\"bytes32\"},{\"name\":\"owner1\",\"type\":\"address\"}],\"name\":\"MorteryUpdate\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"owner1\",\"type\":\"address\"},{\"name\":\"notification_id1\",\"type\":\"string\"},{\"name\":\"late_name_en1\",\"type\":\"string\"},{\"name\":\"late_name_ar1\",\"type\":\"string\"},{\"name\":\"emirates_id1\",\"type\":\"string\"},{\"name\":\"nationality1\",\"type\":\"string\"},{\"name\":\"martial_status1\",\"type\":\"string\"},{\"name\":\"family_name1\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"}]';
		if (metadata.issuer === "user") {
			var contract = require("../contracts/deathCertificate");

			console.log(metadata);
			var owner1 = receiver_bitcoin_address;
			const notification_id1 = metadata.notification_id;
			const late_name_en1 = metadata.deceased_info.name_en;
			const late_name_ar1 = metadata.deceased_info.name_ar;
			const emirates_id1 = metadata.deceased_info.emirates_id;
			const nationality1 = metadata.deceased_info.nationality;
			const martial_status1 = metadata.deceased_info.marital_status;
			const family_name1 = metadata.deceased_info.family_name;

			const params = {
				owner1: owner1,
				notification_id1: await encryptValue(keyy,notification_id1),
				late_name_en1: await encryptValue(keyy,late_name_en1),
				late_name_ar1: await encryptValue(keyy,late_name_ar1),
				emirates_id1: await encryptValue(keyy,emirates_id1),
				nationality1: await encryptValue(keyy,nationality1),
				martial_status1: await encryptValue(keyy,martial_status1),
				family_name1: await encryptValue(keyy,family_name1)
			};

			// const params = {
			// 	owner1: owner1,
			// 	notification_id1: notification_id1,
			// 	late_name_en1: late_name_en1,
			// 	late_name_ar1: late_name_ar1,
			// 	emirates_id1: emirates_id1,
			// 	nationality1: nationality1,
			// 	martial_status1: martial_status1,
			// 	family_name1: family_name1
			// };

			console.log('params..........',params);
			const b = JSON.stringify(params);
			const postData = querystring.stringify({
				params: b,
				contractName: contract.contractName,
				fileData: contract.fileData,
				address: sender_bitcoin_address,
				privateKey: sender_wif
			});

			return await postToApi(
				"/ethereum/contract/deploy",
				postData,
				async function(err, body) {
					if (err) {
						callback(err);
					} else {
						callback(null, body);
					}
				}
			);
		} else if (metadata.issuer === "physician") {
			const txHash = metadata.tx_hash;
			console.log(txHash);
			const phone_no1 = metadata.deceased_info.mobile_no;
			const date_of_death1 = metadata.deceased_info.date_of_death.toString();
			const time_of_death1 = metadata.deceased_info.time_of_death.toString();
			const location_of_death_city1 =
				metadata.deceased_info.location_of_death_city;
			const place_of_death1 = metadata.deceased_info.place_of_death;
			const death_notification_entity1 =
				metadata.deceased_info.death_notification_entity;
			const refer_doc_forensic1 = metadata.deceased_info.refer_doc_forensic;
			const underlying_cause1 = metadata.deceased_info.underlying_cause;
			const intermediate_cause1 = metadata.deceased_info.intermediate_cause;
			const other_significant_conditions1 =
				metadata.deceased_info.other_significant_conditions;
			const additional_info_about_cause1 =
				metadata.deceased_info.additional_info_about_cause;
			const search_icd_11 = metadata.deceased_info.search_icd_1;
			const search_icd_22 = metadata.deceased_info.search_icd_2;
			const search_icd_33 = metadata.deceased_info.search_icd_3;
			const search_icd_44 = metadata.deceased_info.search_icd_4;
			const physician_full_name1 = metadata.deceased_info.physician_full_name;
			const physician_license_no1 = metadata.deceased_info.physician_license_no;
			const examine_date1 = metadata.deceased_info.examine_date.toString();
			const examine_time1 = metadata.deceased_info.examine_time.toString();
			const hospital_name1 = metadata.deceased_info.hospital_name;
			const status1 = "physician reviewed";
			const mortery1 = receiver_bitcoin_address;

			const values = [];
			values.push(phone_no1);
			values.push(date_of_death1);
			values.push(time_of_death1);
			values.push(location_of_death_city1);
			values.push(place_of_death1);
			values.push(death_notification_entity1);
			values.push(refer_doc_forensic1);
			values.push(underlying_cause1);
			values.push(intermediate_cause1);
			values.push(other_significant_conditions1);
			values.push(additional_info_about_cause1);
			values.push(search_icd_11);
			values.push(search_icd_22);
			values.push(search_icd_33);
			values.push(search_icd_44);
			values.push(physician_full_name1);
			values.push(physician_license_no1);
			values.push(examine_date1);
			values.push(examine_time1);
			values.push(hospital_name1);
			values.push(status1);

			const a = values.toString();
			const params = {
				values: await encryptValue(keyy,a),
				mortery1: mortery1
			};

			const b = JSON.stringify(params);
			const initiateContractData = querystring.stringify({
				params: b,
				abi: abi,
				txHash: txHash,
				method: "physicianUpdate",
				address: sender_bitcoin_address,
				privateKey: sender_wif
			});

			return await postToApi(
				"/ethereum/contract/setContractMethod",
				initiateContractData,
				async function(err, body) {
					if (err) {
						callback(err);
					} else {
						console.log("body:", body);
						callback(null, body);
					}
				}
			);
		} else if (metadata.issuer === "mortuary") {
			const txHash = metadata.tx_hash;

			const status1 = "pending";
			const owner1 = receiver_bitcoin_address;

			const params = {
				status1: await encryptValue(keyy,status1),
				owner1: owner1
			};

			const b = JSON.stringify(params);
			const initiateContractData = querystring.stringify({
				params: b,
				abi: abi,
				txHash: txHash,
				method: "MorteryUpdate",
				address: sender_bitcoin_address,
				privateKey: sender_wif
			});

			return await postToApi(
				"/ethereum/contract/setContractMethod",
				initiateContractData,
				async function(err, body) {
					if (err) {
						callback(err);
					} else {
						callback(null, body);
					}
				}
			);
		} else if (metadata.issuer === "haad") {
			const txHash = metadata.tx_hash;
			const status1 = "Approved by Haad";
			const owner1 = receiver_bitcoin_address;

			const params = {
				approvel1: await encryptValue(keyy,"Approved"),
				status1: await encryptValue(keyy,status1),
				owner1: owner1
			};

			const b = JSON.stringify(params);
			const initiateContractData = querystring.stringify({
				params: b,
				abi: abi,
				txHash: txHash,
				method: "HAADApprovel",
				address: sender_bitcoin_address,
				privateKey: sender_wif
			});

			return await postToApi(
				"/ethereum/contract/setContractMethod",
				initiateContractData,
				async function(err, body) {
					if (err) {
						callback(err);
					} else { 
						callback(null, body);
					}
				}
			);
		} else {
			callback(err);
		}
	}
} //issue_assets

async function postToApi(api_endpoint, json_data, callback) {
	console.log('here');
	const options = {
		hostname: constants.TEST_NET_API_URL,
		port: 3002,
		path: api_endpoint,
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			authorization:
				"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGF5eWFiQGdtYWlsLmNvbSIsInBlcm1pc3Npb25MZXZlbCI6MjA0OCwicHJvdmlkZXIiOiJlbWFpbCIsIm5hbWUiOiJUYXl5YWIgQ2hvaGFuIiwiaWF0IjoxNTc3Njg1NTc1fQ.-X04t7fWb9WpYk-ohhQ6OcBnebjFCt9QMsE0tr7o8Ow",
			"Content-Length": Buffer.byteLength(json_data)
		}
	};
  
	const req = await http.request(options, async res => {
		res.setEncoding("utf8");
		await res.on("data", async chunk => {
			return callback(null, chunk);
		});
	});

	await req.on("error", e => {
		return callback("error1", e.message);
	});

	req.write(json_data);

} //end of postToApi

const encryptValue = async(Keyy, value) => {
	var mykey = crypto.createCipher('aes-128-cbc', Keyy);
	var mystr = mykey.update(value, 'utf8', 'hex')
	mystr += mykey.final('hex');
	return mystr;
}

async function getFromApi(api_endpoint, param, callback) {
	const options = {
		hostname: constants.TEST_NET_API_URL,
		port: 3002,
		path: api_endpoint + "/" + param,
		method: "GET",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			authorization:
				"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGF5eWFiQGdtYWlsLmNvbSIsInBlcm1pc3Npb25MZXZlbCI6MjA0OCwicHJvdmlkZXIiOiJlbWFpbCIsIm5hbWUiOiJUYXl5YWIgQ2hvaGFuIiwiaWF0IjoxNTc3Njg1NTc1fQ.-X04t7fWb9WpYk-ohhQ6OcBnebjFCt9QMsE0tr7o8Ow"
		}
	};
	const req = await http.request(options, async res => {
		res.setEncoding("utf8");
		await res.on("data", async chunk => {
			return callback(null, chunk);
		});
	});

	await req.on("error", e => {
		return callback("error1", e.message);
	});
} //end of getFromApi

function signTx(unsignedTx, WIF) {
	var privateKey = bitcoin.ECKey.fromWIF(WIF);

	var tx = bitcoin.Transaction.fromHex(unsignedTx);
	var insLength = tx.ins.length;
	for (var i = 0; i < insLength; i++) {
		tx.sign(i, privateKey);
	}
	return tx.toHex();
}


