var superagent = require('superagent');
var npmStats = require('npm-stats');

exports.index = function(req, res){
  res.render('user', { title: 'Stats for ' + req.params.username, username: req.params.username, repository: '' });
};

exports.repository = function(req, res){
  res.render('repository', { title: 'Stats for ' + req.params.repository, username: '', repository: req.params.repository });
};

exports.info = function(req, res){
  var repoName = req.params.repository;
  if(!repoName)
    return res.json(500, { error: true, message: "not valid repository"});

  var registry = npmStats();

  registry.module(repoName).info(function(err, data){
    if(err)
      res.json(500, { error: true, message: (err.reason === 'missing' ? "The module is missing" : err.reason), details: err });
    else {

      var ctime = (data.time && data.time.created) ? data.time.created : (data.ctime || '2009-01-01T00:00:00Z'),
          cdate = (new Date(ctime)).toISOString().split('T')[0],
          nowDate = (new Date()).toISOString().split('T')[0],
          url = "https://api.npmjs.org/downloads/range/" + cdate + ":" + nowDate + "/" + repoName,
          maintainers = data.maintainers;

      superagent.get(url).end(function(err, response){

        if(err || response.body.error)
          return res.json({
            error: true,
            message: err || response.body.error
          });

        var data = response.body.downloads,
            mappedDownloads = [],
            mappedMaintainers = [];
        
        for(var i = 0; i < data.length; i++)
          mappedDownloads.push([data[i].day, data[i].downloads]);

        for(var i = 0; i < maintainers.length; i++)
          mappedMaintainers.push(maintainers[i].name);

        res.json({
          downloads: mappedDownloads,
          maintainers: mappedMaintainers
        });
      });
    }
  });
};

exports.repositories = function(req, res){
  var userName = req.params.username;
  if(!userName)
    return res.json(500, { error: true, message: "not valid username"});

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