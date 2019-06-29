window.endpoints = {
  repositoriesByUser: function(username){
    return '/~repositories/' + username;
  },
  downloadsByRepository: function(repository, checkItExists){
    var encoded = encodeURIComponent(repository);
    return '/~info/' + encoded + (checkItExists ? "?checkItExists=true" : "");
  }
};