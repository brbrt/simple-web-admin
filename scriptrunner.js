var log = require('winston');
var q = require('q');
var spawn = require('child_process').spawn;

module.exports = run;

function run(script, args) {
    args = args || [];

	log.debug('Running script=' + script + ' with args=' + JSON.stringify(args));

	var deferred = q.defer();

	var proc = spawn(script, args);

	var out = '', err = '';

	proc.stdout.on('data', function onMsg(data) {
	    out += data;
	});

	proc.stderr.on('data', function onErr(data) {
	    err += data;
	});

	proc.on('error', function onError(err) {
		deferred.reject(err);
	});

	proc.on('close', function onClose(code) {
		if (code === 0) {
			deferred.resolve(out);
		} else {
			deferred.reject(err);
		}
	});

	return deferred.promise;
}
