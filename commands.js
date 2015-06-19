var handlebars = require('handlebars');
var log = require('winston');
var path = require('path');
var q = require('q');
var scriptrunner = require('./scriptrunner.js');

module.exports = {
    getAll: getAll,
    execute: execute
};

var commands = [
   {
      name:'diskspace',
      description:'Returns disk space usage data.',
      script: 'df -h'
   },
   {
      name:'is_proc_running',
      description:'Checks if the specified process is running.',
      script: 'ps aux | grep {{name}}',
      args:[
         'name'
      ]
   },
   {
      name:'list_incomplete_torrents',
      description:'Lists incomplete torrents.',
      script: 'ls -l /data/shared/temp/rtorrent/incomplete/'
   },
   {
      name:'startservice',
      description:'Starts the specified service.',
      script: 'service {{name}} start',
      args:[
         'name'
      ]
   },
   {
      name:'stopservice',
      description:'Stops the specified service.',
      script: 'service {{name}} stop',
      args:[
         'name'
      ]
   },
   {
      name:'syslog',
      description:'Returns the last 100 lines of syslog',
      script: 'tail -n 100 /var/log/syslog | tac'
   },
   {
      name:'uptime',
      description:'Runs the uptime command.',
      script: 'uptime'
   }
];

function getAll() {
    return commands;
}

function execute(name, params) {
    var data = {name: name, params: params};
    log.info('Executing command: ' + require('util').inspect(data));

    return getCommand(data)
        // .then(extractScriptName)
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
