var handlebars = require('handlebars');
var log = require('winston');
var q = require('q');
var requireall = require('require-all');
var scriptrunner = require('./scriptrunner.js');

module.exports = {
    getAll: getAll,
    execute: execute
};

var commands = requireall(__dirname + '/commands');
log.debug('All commands: ' + require('util').inspect(commands));

function getAll() {
    return commands;
}

function execute(name, params) {
    var data = {name: name, params: params};
    log.info('Executing command: ' + require('util').inspect(data));

    return getCommand(data)
        .then(processArguments)
        .then(scriptrunner)
        .then(logSuccess, logError);
}

function getCommand(data) {
    if (commands.hasOwnProperty(data.name)) {
        data.command = commands[data.name];
        return q(data);
    }

    return q.reject('No command with the specified name!');
}

function processArguments(data) {
    for (var key in data.params) {
        // TODO: validate
    }

    var template = handlebars.compile(data.command.script);

    return template(data.params);
}

function logSuccess(result) {
    log.debug('Successfully executed command: ' + result);
    return result;
}

function logError(error) {
    log.warn('Command execution error: ' + error);
    return q.reject(error);
}
