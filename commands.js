var log = require('winston');
var q = require('q');
var scriptrunner = require('./scriptrunner.js');

module.exports = {
    getAll: getAll,
    execute: execute
};

var commands = [
    { name: 'sample', description: 'Sample command'},
    { name: 'syslog', description: 'Returns the lass 100 lines of syslog'},
    { name: 'uptime', description: 'Runs the uptime command.'}
];

function getAll() {
    return commands;
}

function execute(name) {
    log.info('Executing command: ' + name);

    return getCommand(name)
        .then(extractScriptName)
        .then(scriptrunner)
        .then(logSuccess, logError);
}

function getCommand(name) {
    for (var i = 0; i < commands.length; i++) {
        if (commands[i].name === name) {
            return q(commands[i]);
        }
    }

    return q.reject('No command with the specified name!');
}

function extractScriptName(command) {
    return 'scripts/' + command.name + '.sh';
}

function logSuccess(result) {
    log.info('Successfully executed command: ' + result);
    return result;
}

function logError(error) {
    log.warn('Command execution error: ' + error);
    return q.reject(error);
}
