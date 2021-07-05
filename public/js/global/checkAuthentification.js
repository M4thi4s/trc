function checkAuthentification(onSuccess, onError){

  if(onSuccess==false){
    onSuccess=function(){
      document.location.href="/account/";
    }
  }

  if(onError==false){
    onError=function(){
      document.location.href="/login/";
    }
  }

  //CHECK AUTHENTIFICATION
  requestServer("POST",
  "auth/checkAuthentification",
  false,
  true,
  onSuccess,
  onError )
}
