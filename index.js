var bodyParser = require('body-parser');
var express = require('express');
var expressHbs = require('express-handlebars');
var path = require('path');
var log = require('winston');

var config = require('./config.js');
var commands = require('./commands.js');

var app = express();

app.set('views', path.resolve(__dirname + '/views'));
app.set('view engine', 'hbs');
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'index.hbs', layoutsDir:app.get('views')}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    var data = {commands: commands.getAll()};
    res.render('commands', data);
});

app.get('/command', function (req, resp) {
    resp.json(commands.getAll());
});

app.post('/command/:name', function (req, resp) {
    commands
        .execute(req.params.name, req.body)
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

var server = app.listen(config('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  log.info('bpi-webif app listening at http://%s:%s', host, port);
});
