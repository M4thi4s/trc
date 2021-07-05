module.exports={
  change:function(){
    rl.question("\n <-> interval : <->\n 0 -> 1m\n 1 -> 2m\n 2 -> 5m\n 3 -> 15m\n 4 -> 30m\n 5 -> 60m\n 6 -> 90m\n  --> NB : ", function(id) {
      if(isNaN(id)==false){
        var p=parseInt(id);
        switch(p){
          case 0:
            console.log("OK -> interval = 1m");
            Parameter.interval_in_minutes="1m";
          break;
          case 1:
            console.log("OK -> interval = 2m");
            Parameter.interval_in_minutes="2m";
          break;
          case 2:
            console.log("OK -> interval = 5m");
            Parameter.interval_in_minutes="5m";
          break;
          case 3:
            console.log("OK -> interval = 15m");
            Parameter.interval_in_minutes="15m";
          break;
          case 4:
            console.log("OK -> interval = 30m");
            Parameter.interval_in_minutes="30m";
          break;
          case 5:
            console.log("OK -> interval = 60m");
            Parameter.interval_in_minutes="60m";
          break;
          case 6:
            console.log("OK -> interval = 90m");
            Parameter.interval_in_minutes="90m";
          break;
          default:
            console.log("ERROR -> id not found, (5m selected)");
            Parameter.interval_in_minutes="5m";
          break;
        }
      }
      else{
        console.log("ERROR -> id not found, (5m selected)");
        Parameter.interval_in_minutes="5m";
      }

      prompt();
    });
  }
}
