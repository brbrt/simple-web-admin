var nconf = require('nconf');
var winston = require('winston');
var path = require('path');


// Wrap nconf.get function.
module.exports = getConfig;

function getConfig(key) {
    return nconf.get(key);
}


// First consider commandline arguments and environment variables, respectively.
// E.g. node index.js --port 4080
nconf.argv().env();


// Provide default values for settings not provided above.
nconf.defaults({
    port: 4000,
    debug: false
});


// Set default log level based on config.
var level = getConfig('debug') ? 'debug' : 'info';
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {level: level});
