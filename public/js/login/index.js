function getData(){
  return {
    /*username:($("#username_i").val()),*/
    email:($("#email_i").val()),
    password:($("#password_i").val())
  }
}

function request(url,callback){
  requestServer("POST",
  url,
  JSON.stringify(getData()),
  false,  //Headers
  function(res){  //onSuccess
    callback(res);
  },
  function(err){  //onError
    console.log(err);
    alert(err.responseText);
  });
};

window.onload = function(){

  checkAuthentification(false,null);

  $("#signup").click(function(){
    request("auth/signup",function(res){
      $("#login").click();
    });
  });

  $("#login").click(function(){
    request("auth/login",function(res){
      localStorage.setItem('token', res.token);
      localStorage.setItem('userid', res.userid);
      document.location.href="/account/";
    });
  });
}
