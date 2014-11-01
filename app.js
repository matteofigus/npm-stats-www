/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 

  if(process.env.NODETIME_ACCOUNT_KEY) {
    var nodetime = require('nodetime');
    nodetime.profile({
      accountKey: process.env.NODETIME_ACCOUNT_KEY,
      appName: 'My Application Name' // optional
    });

    app.use(nodetime.expressErrorHandler());
  }
}

var home = require('./routes/index');
var user = require('./routes/user');

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
