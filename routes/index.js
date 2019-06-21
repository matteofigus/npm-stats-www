var npmStats = require('npm-stats-patched');
var _ = require('lodash');

var from = function(){
  var d = new Date();
  d.setHours(d.getHours() - 30);
  return d;
};

var to = function(){
  var d = new Date();
  d.setHours(d.getHours() - 24);
  return d;
};

var registry = npmStats("https://replicate.npmjs.com/");

var getUpdated = function(callback){
  registry.listByDate({ since: from(), until: to() }, function(err, r){
    if(err){ return callback(err); }

    var result = _(r)
      .chain()
      .map(function(item){
        return item.name;
      })
      .uniq()
      .value();

    callback(null, result);
  });
};

exports.index = function(req, res){

  getUpdated(function(err, updatedModules){
    res.render('index', {
      title: 'Npm-stats',
      username: '',
      repository: '',
      updatedModules: updatedModules || []
    });
  });
};