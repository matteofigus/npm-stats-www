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

  registry.module(repoName).downloads(function(err, data){
    if(err)
      res.json(400, { error: true, message: "api error", details: err});
    else {
      var mapped = [];
      
      for(var i = 0; i < data.length; i++)
        mapped.push([data[i].date, data[i].value]);

      res.json(mapped);
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