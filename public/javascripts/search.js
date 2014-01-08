var Search = function(){
  var selectors = {
    userForm: {
      form: "#user-form",
      user: "#user-form .username",
      submit: "#user-form .submit"
    },
    repositoryForm: {
      form: "#repository-form",
      repository: "#repository-form .repositoryname",
      submit: "#repository-form .submit"
    }
  };
  
  var redirectToUserPage = function(){
    window.location.href = "/" + $(selectors.userForm.user).val();
    return false;
  }

  var redirectToRepositoryPage = function(){
    window.location.href = "/~packages/" + $(selectors.repositoryForm.repository).val();
    return false;
  }

  this.init = function(){
    $(selectors.userForm.form).submit(redirectToUserPage);
    $(selectors.userForm.submit).click(redirectToUserPage);
    $(selectors.repositoryForm.form).submit(redirectToRepositoryPage);
    $(selectors.repositoryForm.submit).click(redirectToRepositoryPage);
  }
};

var search = new Search();

$(function(){
  search.init();
});


