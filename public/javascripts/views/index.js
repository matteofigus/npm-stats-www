var selectors = {
  userForm: {
    form: "#user-form",
    user: "#user-form .username",
    submit: "#user-form .submit"
  }
};

$(function(){
  $(selectors.userForm.form).submit(redirectToUserPage);
  $(selectors.userForm.submit).click(redirectToUserPage);
});

var redirectToUserPage = function(){
  window.location.href = "/" + $(selectors.userForm.user).val();
  return false;
}