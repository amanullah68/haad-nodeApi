var define = require("node-constants")(exports);
// define is a function that binds "constants" to an object (commonly exports)

// a single constant
//define("PI", 3.14);

// or multiple
define({
    TEST_NET_API_URL: 'localhost',
    SALT: 'iuyeDjlk8973',
    HASH_KEY: '56fb7774301cea6561fd65850bd84ab1'
});
