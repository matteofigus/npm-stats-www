var superagent = require('superagent');
var npmStats = require('npm-stats');

exports.index = function(req, res){
  res.render('user', { title: 'Stats for ' + req.params.username, username: req.params.username, repository: '' });
};

exports.repository = function(req, res){
  res.render('repository', { title: 'Stats for ' + req.params.repository, username: '', repository: req.params.repository });
};

exports.downloads = function(req, res){
  var repoName = req.params.repository;
  if(!repoName)
    res.json(500, { error: true, message: "not valid repository"});

  var registry = npmStats();

  registry.module(repoName).info(function(err, data){
    if(err)
      res.json({ error: true, message: (err.reason == 'missing' ? "The module is missing" : err.reason), details: err });
    else {

      var url = "https://api.npmjs.org/downloads/range/" + (new Date(data.time.created)).toISOString().split('T')[0] +":" + (new Date()).toISOString().split('T')[0] + "/" + repoName;

      superagent.get(url).end(function(response){

        if(data.error)
          return res.json({
            error: true,
            message: data.error
          });

        var data = response.body.downloads,
            mapped = [];
        
        for(var i = 0; i < data.length; i++)
          mapped.push([data[i].day, data[i].downloads]);

        res.json(mapped);
      });
    }
  });
};

exports.info = function(req, res){
  var repoName = req.params.repository;
  if(!repoName)
    res.json(500, { error: true, message: "not valid repository"});

  var registry = npmStats();

  registry.module(repoName).info(function(err, data){
    res.json(err ? err : data);
  });
};

exports.repositories = function(req, res){
  var userName = req.params.username;
  if(!userName)
    res.json(500, { error: true, message: "not valid username"});

  var registry = npmStats();

  registry.user(userName).list(function(err, data){
    if(err)
      res.json(400, { error: true, message: "api error", details: err});
    else {
      var mapped = [];

      for(var i = 0; i < data.length; i++)
        if(data[i] && data[i] != '')
          mapped.push(data[i]);

      res.json(mapped);
    }
  });
};