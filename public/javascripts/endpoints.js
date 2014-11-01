window.endpoints = {
  repositoriesByUser: function(username){
    return '/~repositories/' + username;
  },
  downloadsByRepository: function(repository, checkItExists){
    return '/~info/' + repository + (checkItExists ? "?checkItExists=true" : "");
  }
};