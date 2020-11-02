var encryptAndDecrypt = require('../common/encrypt_and_decrypt.js');
var api_functions = require('../common/api_functions.js');
// var request = require('request');
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/logdata.log', category: 'output' }
    ]
});
var logger = log4js.getLogger('output');
var encrypt = {
    get_all_notifications: function (req, res) {
        // console.log('1');
        get_all(req, res);
    },
    decrypt: function (req, res) {
        // console.log('2');
        decryption(req, res);
    }, //end of decrypt
    get_notifications: function (req, res) {
        // console.log('3');
        get_information(req, res);
    },//end of get_info
    encrypt: function (req, res) {
        // console.log('4');
        encryption(req, res);
    },
    send_info: function (req, res) {
        // console.log('5');
        send_information(req, res);
    },
    status_updation: function (req, res) {
        // console.log('6');
        updation(req, res);
    },
    get: function (req, res) {
        /*    res.json({
                "status": 322343
            })
    */
    }
}; //end of var encrypt

// 
updation = async (req, res) => {
    // console.log('updation');
    // console.log('body', req.body.txHash);
    var txHash = req.body.txHash;
    
    api_functions.check_tx_confirmation(txHash, function (err, body) {
        if (err) logger.error('error 567: ', err);
        else {
            // changes made here as project is shifted to ethereum from Bitcoin , comment the code of if/else
            // console.log('archive',req.body.archive_address);
            if (req.body.archive_address) {
                // console.log('here in user.js line 58', body);
                res.json({
                    status: 200,
                    txid: body,
                });
            }
            else {
                res.json({
                    status: 200,
                    txid: body,
                });
            }
        }
    });

}

function send_information(req, res) {
    var sender_bitcoin_address = req.body.sender;
    var receiver_bitcoin_address = req.body.receiver;
    var metadata = req.body.metadata;
    //console.log(metadata);
    //res.json({"bye": "bye"});
    var sender_wif = req.body.sender_wif;
    //encrypt the user info

    api_functions.issue_assets_units(sender_bitcoin_address, receiver_bitcoin_address, sender_wif, metadata, function (err, body, asset) {
        console.log('body...............',body);
        
        if (err) logger.error('error 567: ', err);
        else {
            // changes made here as project is shifted to ethereum from Bitcoin , comment the code of if/else
            // console.log('archive',req.body.archive_address);
            // console.log('txId', body.txHash);
            if(body.status == 0) {
                res.json({
                    status: 201,
                    txid: body,
                });
            }
            else if (body.status == 1) {
                // console.log('here');
                res.json({
                    status: 200,
                    txid: body,
                });
            }
            else {
                console.log('aaaaaaaaaaaaa..................',body);
                // console.log('txId', body.txHash);
                res.json({
                    status: 201,
                    txid: err,
                });
            }
        }
    });

}//end of send_information

function done(rows, res) {
    // console.log('inside of done function');
    // console.log(rows);
    res.json({
        "status": 404,
        "info": "resource not found"
    });
}//end of done
function decryption(private_key, encrypted_info) {
    var decryptedInfo = encryptAndDecrypt.decrypt(private_key, encrypted_info);
    return decryptedInfo.toString();
}

function get_information(req, res) {
    var asset_id = req.body.asset_id;
    // console.log('1 ' + req.body.asset_id);
    var tx_id = req.body.tx_id;
    // console.log('2 ' + req.body.tx_id);
    api_functions.get_asset_units(asset_id, tx_id, 0, function (err, body) {
        var metadata = body.metadataOfIssuence;
        //converting string into json object
        res.json({
            status: 200,
            metadata: metadata,
        });

    });
}//end of get_information

function get_all(req, res) {
    var bitcoin_address = req.body.bitcoin_address;
    // console.log('bit address ' + bitcoin_address);
    api_functions.get_all_notifications(bitcoin_address, function (err, body) {
        if (err) {
            logger.error('error1: ' + err);
            res.json({
                "status": 403,
                "error": "no asset found"
            })
        }
        else {
            var assetId = [];
            var txId = [];
            for (var i = 0; i < body.utxos.length; i++) {
                if (body.utxos[i].value == 600) {
                    assetId.push(body.utxos[i].assets[0].assetId);
                    txId.push(body.utxos[i].assets[0].issueTxid);
                }
            } //end of for loop

            if (assetId.length == 0) {
                res.json({
                    "status": 200,
                    "assets": []
                })
            }
            else {
                var arr = [];
                var chk_arr = [];
                var count = 0;
                for (var j = 0; j < assetId.length; j++) {
                    chk_arr.push('1');
                    api_functions.get_asset_units(assetId[j], txId[j], 0, function (err, bodyy) {
                        if (err) {
                            // console.log(err);
                        }
                        var metadata = bodyy.metadataOfIssuence;
                        arr.push(metadata);
                        chk_arr.pop();
                        if (++count == assetId.length && chk_arr.length == 0) {
                            res.json({
                                "status": 200,
                                "assets": arr
                            })
                        }
                    });
                }//end of forloop
            }//end of else
        }
    });
}//end of get_all

function search_and_tranfer_to_archive(req, res) {
    var notification_id = req.body.notification_id;
    var archive_address = req.body.archive_address;
    var sender_bitcoin_address = req.body.sender;
    var sender_wif = req.body.sender_wif;
    // console.log('notificatiob id', notification_id);
    // console.log('archive address', archive_address);
    // console.log('sender bitcoin', sender_bitcoin_address);
    // console.log('sender wif', sender_wif);
    api_functions.get_all_notifications(sender_bitcoin_address, function (err, body) {
        if (err) {
            logger.error('error 444: ' + err);
            res.json({
                "status": 210,
                "message": 'some error occured'
            })
        }
        var assetId = [];
        var txId = [];

        // console.log('body:', body);

        for (var i = 0; i < body.utxos.length; i++) {
            if (body.utxos[i].value == 600) {
                assetId.push(body.utxos[i].assets[0].assetId);
                txId.push(body.utxos[i].assets[0].issueTxid);
            }
        } //end of for loop

        if (assetId.length == 0) {
            res.json({
                "status": 210,
                "message": 'no asset exist'
            })
        }//end of if

        else {
            var arr = [];
            var chk_arr = [];
            var count = 0;
            for (var j = 0; j < assetId.length; j++) {
                api_functions.get_asset_units(assetId[j], txId[j], 0, function (err, bodyy) {
                    if (err) {
                        logger.error('error 444: ' + err);
                        res.json({
                            "status": 210,
                            "message": 'some error occured'
                        })
                    }
                    var metadata = bodyy.metadataOfIssuence;
                    count = count + 1;
                    if (metadata.data.notification_id == notification_id) {
                        chk_arr.push('1');
                        api_functions.transfer_asset_units(bodyy.assetId, bodyy.issuanceTxid, archive_address,
                            sender_bitcoin_address, sender_wif,
                            function (err, bodyy) {
                                if (err) {
                                    logger.error('error in tranfer: ', err);
                                }
                                chk_arr.pop();
                                if (count == assetId.length && chk_arr.length == 0) {
                                    res.json({
                                        "status": 200,
                                        "message": 'success'
                                    })
                                }
                            });  //end of transfer function
                    }

                });
            }//end of forloop
        }//end of else
    });//end of get_all_notifications
}//end of search_and_tranfer_to_archive


module.exports = encrypt;
module.send_info;
module.get_info;
module.get_all_notifications;