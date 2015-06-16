var express = require('express');
var log = require('winston');
var commands = require('./commands.js');

var app = express();

app.get('/', function (req, resp) {
  resp.send('Hello Pi!');
});

app.get('/command', function (req, resp) {
  resp.json(commands.getAll());
});

app.post('/command/:name', function (req, resp) {
    commands
        .execute(req.params.name)
        .then(function success(output) {
            resp.send(output);
        })
        .catch(function error(err) {
            resp.status(500);
            resp.send(err);
        });
});

var server = app.listen(12121, function () {
  var host = server.address().address;
  var port = server.address().port;

  log.info('bpi-webif app listening at http://%s:%s', host, port);
});
