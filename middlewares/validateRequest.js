var constants = require('../common/constants.js');
//var validateUser = require('../routes/auth').validateUser;
module.exports = function(req, res, next) {
  /*  console.log(req.body);
    //console.log(req.query);
    //console.log(req.headers);*/
    var key = (req.body && req.body.key) || (req.query && req.query['key']) || req.headers['key'];
    // console.log(key);
    // console.log('user invoked');
    if (key == constants.HASH_KEY) {
                       next(); // To move to next middleware
                            } else {
                                res.status(403);
                                res.json({
                                    "status": 403,
                                    "message": "Not Authorized"
                                });
                                return;
                            }

};
