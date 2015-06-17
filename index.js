var express = require('express');
var expressHbs = require('express-handlebars');
var log = require('winston');
var commands = require('./commands.js');

var app = express();

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.get('/', function(req, res){
    var data = {commands: commands.getAll()};
    res.render('commands', data);
});

app.get('/command', function (req, resp) {
    resp.json(commands.getAll());
});

app.post('/command/:name', function (req, resp) {
    commands
        .execute(req.params.name)
        .then(function success(output) {
            resp.header('Content-Type', 'text/plain');
            resp.send(output);
        })
        .catch(function error(err) {
            resp.header('Content-Type', 'text/plain');
            resp.status(500);
            resp.send(err);
        });
});

var server = app.listen(12121, function () {
  var host = server.address().address;
  var port = server.address().port;

  log.info('bpi-webif app listening at http://%s:%s', host, port);
});
