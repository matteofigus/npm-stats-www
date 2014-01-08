window.endpoints = {
  repositoriesByUser: function(username){
    return '/~repositories/' + username;
  },
  downloadsByRepository: function(repository, checkItExists){
    return '/~downloads/' + repository + (checkItExists ? "?checkItExists=true" : "");
  }
};