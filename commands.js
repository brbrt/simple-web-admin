var log = require('winston');
var path = require('path');
var q = require('q');
var scriptrunner = require('./scriptrunner.js');

module.exports = {
    getAll: getAll,
    execute: execute
};

var commands = [
    { name: 'diskspace', description: 'Return disk space usage data.' },
    { name: 'syslog', description: 'Returns the last 100 lines of syslog' },
    { name: 'startservice', description: 'Starts the specified service.', args: ['name'] },
    { name: 'stopservice', description: 'Stops the specified service.', args: ['name'] },
    { name: 'uptime', description: 'Runs the uptime command.' }
];

function getAll() {
    return commands;
}

function execute(name, params) {
    var data = {name: name, params: params};
    log.info('Executing command: ' + require('util').inspect(data));

    return getCommand(data)
        .then(extractScriptName)
        .then(processArguments)
        .then(scriptrunner)
        .then(logSuccess, logError);
}

function getCommand(data) {
    for (var i = 0; i < commands.length; i++) {
        if (commands[i].name === data.name) {
            data.command = commands[i];
            return q(data);
        }
    }

    return q.reject('No command with the specified name!');
}

function extractScriptName(data) {
    data.script = path.resolve(__dirname, 'scripts/', data.command.name + '.sh');
    return q(data);
}

function processArguments(data) {
    var args = [];

    for (var key in data.params) {
        // TODO: validate
        args.push(data.params[key]);
    }

    data.args = args;

    return q(data);
}

function logSuccess(result) {
    log.debug('Successfully executed command: ' + result);
    return result;
}

function logError(error) {
    log.warn('Command execution error: ' + error);
    return q.reject(error);
}
