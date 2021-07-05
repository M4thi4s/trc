function requestServer(method, url, jsonSTR, headers, onSuccess, onError){
  if(headers){
    headers=function(request) { //Headers
      request.setRequestHeader("token", localStorage.getItem('token'));
      request.setRequestHeader("userid", localStorage.getItem('userid'));
    }
  }
  
  $.ajax({
    type: method,
    url: "/api/"+url,
    beforeSend: headers,
    data: jsonSTR,
    success: onSuccess,
    error:onError,
    dataType: "json",
    contentType : "application/json"
  });
}
