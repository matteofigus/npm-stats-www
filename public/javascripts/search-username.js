var SearchByUsername = function(){
  var selectors = {
    userForm: {
      form: "#user-form",
      user: "#user-form .username",
      submit: "#user-form .submit"
    }
  };
  
  var redirectToUserPage = function(){
    window.location.href = "/" + $(selectors.userForm.user).val();
    return false;
  }

  this.init = function(){
    $(selectors.userForm.form).submit(redirectToUserPage);
    $(selectors.userForm.submit).click(redirectToUserPage);
  }
};

var search = new SearchByUsername();

$(function(){
  search.init();
});


