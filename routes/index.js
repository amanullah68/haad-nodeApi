var express = require('express');
var router = express.Router();
//var products = require('./products.js');
//var issueAndTransfer = require('./issue_and_transfer.js');
var user = require('../main/user.js');

//var generate_address = require('../main/generate_address.js');
//var generate_encryption_keys = require('../main/generate_encryption_keys.js');
/*
 * Routes that can be accessed by any one
 */

//router.post('/generate_address', generate_address.generate_address);
//router.post('/generate_encryption_keys', generate_encryption_keys.generate_encryption_keys);

/*
 * Routes that can be accessed only by authenticated users
 */
//router.get('/api/v1/products', products.getAll);
//router.get('/api/v1/product/:id', products.getOne);
//router.post('/api/v1/product/', products.create);
//router.put('/api/v1/product/:id', products.update);
//router.delete('/api/v1/product/:id', products.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */

/*
 * For users
 */

router.post('/send_info', user.send_info);
router.post('/update_info', user.status_updation);
router.post('/fetch_notifications', user.get_notifications);
router.post('/get_all_notifications', user.get_all_notifications);

//router.get('/get_me', user.get);
/*
*
 */
module.exports = router;
