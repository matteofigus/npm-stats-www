var connect = require('connect');
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

var home = require('./routes/index');
var user = require('./routes/user');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('json spaces', 0);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env'))
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// API
app.get('/~info/:repository', user.info);
app.get('/~repositories/:username', user.repositories);

// REDIR ROUTE
app.get('/~redir', function(req, res){
  var route = (req.query.action == 'user' ? '/' + req.query.username : '/~packages/' + req.query.repositoryname);
  res.redirect(route);
});

// WEBSITE ROUTES
app.get('/', home.index);
app.get('/~packages/:repository', user.repository);
app.get('/:username', user.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
