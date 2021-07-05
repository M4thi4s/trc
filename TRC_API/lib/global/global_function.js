module.exports = {
  open_file : function(fs,path,callback,dataToSend,verbose){
    try{
      fs.readFile(path, "utf8", function (err,data) {
        if (err){
          if(verbose)
            console.log("err (utils : open file): "+err); return 1;
        }

        else{
          if(dataToSend)
            callback(data,dataToSend);
          else
            callback(data);
        }
      });
    }
    catch{
      callback(1);
    }
  },

  organize_data : function(string,settingData,callback){

    if(settingData.line_to_start_counter!=undefined)
      var line_to_start_counter=settingData.line_to_start_counter

    else
      var line_to_start_counter=0;

    var lineString = string.split(/\r\n|\n/);

    var headers = lineString[line_to_start_counter].split(",");

    var lines = [];

    for (var i=line_to_start_counter+1; i<lineString.length; i++) {

      var data = lineString[i].split(",");

      var tarr = {};
      for (var j=0; j<headers.length; j++)
        if(data[j]!="" && data[j]!=undefined){
          tarr[headers[j]]=data[j];
        }

      if(Object.keys(tarr).length!=0)
        lines.push(tarr);

    }

    if(callback)
      callback(lines);

    else
      return lines;
  },

  check_connection : function(address,callback){
    require('dns').resolve(address, function(err) {
      if (err) {
        callback(1);
      } else {
        callback(0);
      }
    });

  },

  append_file : function(fs, file_name, data, callback){

    if (fs.existsSync(file_name)){
      fs.unlinkSync(file_name);
      console.log("file exist --> remove");
    }

    fs.appendFile(file_name, data,  function(err) {
      if (err){
        console.log("err (utils append file) : "+err);
        if(callback)
          callback(1);
      }

      else
        if(callback)
          callback(0);
    });
  },

  delete_three_last_number : function(int){
    int = int.toString();
    int = int.slice(0, -3);
    int = parseInt(int);

    return int;
  },

  tick_to_string_date : function(nb){
    var date = new Date(parseFloat(nb+"000"));

    var string_date="";
    string_date+=date.getDate()+"/";
    string_date+=(date.getMonth()+1)+"/";
    string_date+=date.getFullYear();

    return string_date;
  },

  run_script : function(scriptPath, childProcess, callback){

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });


  },

  request : function(Request, hostname, path, cookie, callback, data_to_send){

    if(cookie!=0)
      Request.cookie=cookie;

    Request(hostname+path, function (error, response, body) {
      if(error)
        callback(1, 0);
      else{
        if(data_to_send)
          callback(0, body, dataToSend);

        else
          callback(0, body);
      }
    });

  },

  random_color:function(id,dictionnary){
    if(dictionnary==1)
      var c=["red","green","yellow","cyan","white","gray"];

    else
      var c=["black","red","green","yellow","blue","magenta","cyan","white","gray","grey"];

    if(id!=undefined){
      while(id>c.length-1){
        id-=c.length;
      }
      return c[id];
    }
    else
      return c[Math.floor(Math.random() * c.length)];
  },

  return_time:function(){
    var t   = new Date();
    var t_d = t.getDate();
    var t_m = t.getMonth()+1;
    var t_y = t.getFullYear();

    return t_d+"_"+t_m+"_"+t_y;
  },

  timeConverter: function(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
}
