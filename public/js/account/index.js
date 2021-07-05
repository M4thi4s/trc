var global_data={
  indicators_url:"/json/indicators_global_config.json",
  pattern_url:"/json/pattern.json",
  indicators:{},
  pattern:{}
}

var strategy_list={};
var quot_file_list={};
var strat_res={};

/* FONCTION STEP 1 */
function load_indicators_pattern(callback){
  request1 = new XMLHttpRequest();
  request1.open('GET', global_data.indicators_url);
  request1.responseType = 'text'; // now we're getting a string!
  request1.send();

  request1.onload = function() {
    var indiTXT = request1.response; // get the string from the response
    global_data.indicators = JSON.parse(indiTXT); // convert it to an object

    request2 = new XMLHttpRequest();

    request2.open('GET', global_data.pattern_url);
    request2.responseType = 'text'; // now we're getting a string!
    request2.send();

    request2.onload = function() {
      var patternTXT = request2.response; // get the string from the response
      global_data.pattern = JSON.parse(patternTXT); // convert it to an object
      callback();
    }
  }
}

function display_strat_info(id){

  var b = -1;
  for(var a=0; a<quot_file_list.length; a++)
    if(quot_file_list[a]._id==id)
      b=a;

  if(b==-1)
    alert("error quotation file not found")
  else{
    var str="date : "+quot_file_list[b].date+"</br>";
    str+="interval : "+quot_file_list[b].interval+"</br>";
    str+="number of instrument: "+quot_file_list[b]["length"]+"</br>";
    str+="instru list: </br>";

    var instruA=JSON.parse(quot_file_list[b].instru);

    for(var a=0; a<instruA.length; a++)
      str+=instruA[a]+", ";

    document.getElementById('right_side').innerHTML=str;
  }
}

function main(){
  //CHECK LOGIN
  checkAuthentification(
    function(res){ //onSuccess
      console.log("utilisateur -> ok");

      requestServer("GET",
      "strategy/listJSON",
      false,
      true,
      function(res){
        strategy_list=res;
        if(res.length==0)
          alert("no strategy found")
        else{

          requestServer("GET",
          "quotfile/list",
          false,
          true,
          function(quotfile){  //onSuccess

            quot_file_list=quotfile;

            var idCounter=0;
            for(var a in res){

              var json=JSON.parse(res[a].json);

              var tr=document.createElement("tr");

              var id = document.createElement("td");
              id.innerHTML=idCounter;
              id.id=a;

              var date = document.createElement("td");
              var dateOBJ = new Date(parseInt(res[a].date));
              date.innerHTML=dateOBJ.toDateString();

              var indicatorsListArray=[];
              var patternListArray=[];

              //GET TYPE BETWEEN INDICATORS AND PATTERN
              console.log(json)

              var indicatorsListStr="";
              var patternListStr="";

              for(var indi in json.parameter.indicators){
                indicatorsListStr+=" "+indi

                var first=true;
                for(var opt in json.parameter.indicators[indi]){
                  if(first){
                    indicatorsListStr+=" ("
                    first=false;
                  }
                  else
                    indicatorsListStr+=", "

                  indicatorsListStr+=opt+" : "+json.parameter.indicators[indi][opt];
                }
                if(first==false)
                  indicatorsListStr+=")";
              }

              for(var pattern in json.parameter.pattern)
                patternListStr+=pattern+"</br>"

              var indicators = document.createElement("td");
              indicators.innerHTML=indicatorsListStr;

              var pattern = document.createElement("td");
              pattern.innerHTML=patternListStr;

              var minOfTickTd = document.createElement("td");
              minOfTickTd.innerHTML=json.global_settings.minimum_of_data;

              var nbOfDataToConfirmStratTd = document.createElement("td");
              nbOfDataToConfirmStratTd.innerHTML=json.global_settings.number_of_data_for_strategy;

              var displaytd = document.createElement("td");
              displaytd.className="action";

              displaytd.setAttribute("onclick","document.getElementById('right_side').innerHTML='<p>"+JSON.stringify(json)+"</p>';");

              var displayIMG = document.createElement("img");
              displayIMG.src="/img/view.svg";
              displayIMG.className="filter_img_red";
              displaytd.appendChild(displayIMG);


              var exectd = document.createElement("td");
              exectd.className="action quot_file";

              var select_exec= document.createElement("select");
            //  select_exec.id="select_quot_file";
              for(var quotNb=0; quotNb<quotfile.length; quotNb++){
                var opt_exec = document.createElement("option");
                opt_exec.value=quotNb;
                opt_exec.innerHTML=quotfile[quotNb].date+" | "+quotfile[quotNb].interval+"m";
                opt_exec.id=quotfile[quotNb]._id;
                select_exec.appendChild(opt_exec);
              }

              exectd.appendChild(select_exec);

              var execInfoIMG = document.createElement("img");
              execInfoIMG.src="/img/information.svg";
              execInfoIMG.className="filter_img_red";

              execInfoIMG.onclick=function(img){
                var quotNb=-1;
                for(var childNb=0; childNb<img.srcElement.parentElement.childNodes.length; childNb++)
                  if(img.srcElement.parentElement.childNodes[childNb].nodeName=="SELECT")
                    var quotNb=img.srcElement.parentElement.childNodes[childNb].value;
                if(quotNb==-1)
                  var str="error : select node not found";
                else
                  display_strat_info(quot_file_list[quotNb]._id);
              }

              exectd.appendChild(execInfoIMG);

              var execIMG = document.createElement("img");
              execIMG.src="/img/test.svg";
              execIMG.className="filter_img_red";

              execIMG.onclick=function(img){
                // NEED : id strat selected, id quotfile selected

                var idStrat=-1
                if(img.srcElement.parentElement.parentElement.childNodes[0].id)
                  idStrat=img.srcElement.parentElement.parentElement.childNodes[0].id;

                var idQuotFile=-1;
                var valueQuotFileOption=img.srcElement.parentElement.childNodes[0].value;
                for(var optNb=0; optNb<img.srcElement.parentElement.childNodes[0].childNodes.length; optNb++){
                  if(img.srcElement.parentElement.childNodes[0].childNodes[optNb].value==valueQuotFileOption){
                    idQuotFile=img.srcElement.parentElement.childNodes[0].childNodes[optNb].id;
                  }
                }

                if(idQuotFile==-1)
                  alert("error quotFile ID not found in SELECT element")
                else if(idStrat==-1)
                  alert("error ID strat not found in TABLE element")
                else{
                  document.getElementById('right_side').innerHTML="execution strat with : </br>|-> id strat : "+idStrat+"</br>|->id quotFile : "+idQuotFile;

                  requestServer("POST",
                  "strategy/exec",
                  JSON.stringify({idStrat:idStrat,idQuotFile:idQuotFile}),
                  true,
                  function(res){  //onSuccess
                    console.log(res);
                  },
                  function(err){
                    document.getElementById('right_side').innerHTML="error : "+JSON.stringify(err);
                  });

                }
              }

              exectd.appendChild(execIMG);


              tr.appendChild(id);
              tr.appendChild(date);
              tr.appendChild(indicators);
              tr.appendChild(pattern);
              tr.appendChild(minOfTickTd);
              tr.appendChild(nbOfDataToConfirmStratTd);
              tr.appendChild(displaytd);
              tr.appendChild(exectd);

              (document.getElementById("table_strategy")).appendChild(tr);
              idCounter++;
            }

            var tr=document.createElement("tr");
            var td=document.createElement("td");
            td.colSpan=8;
            td.innerHTML="NEW STRATEGY &nbsp;<img class=\"filter_img_white\" src=\"/img/addDir.svg\"/>";
            td.onclick=function(){
              document.location.href="/strategy_creator/";
            }
            tr.appendChild(td);

            (document.getElementById("table_strategy")).appendChild(tr);
          });
        }

      },
      function(err){  //onError
        if(err.status==404){
          var tr=document.createElement("tr");
          var td=document.createElement("td");
          td.colSpan=8;
          td.innerHTML="NEW STRATEGY &nbsp;<img class=\"filter_img_white\" src=\"/img/addDir.svg\"/>";
          td.onclick=function(){
            document.location.href="/strategy_creator/";
          }
          tr.appendChild(td);

          (document.getElementById("table_strategy")).appendChild(tr);
        }
        else
          alert("error while loading strategy");
      });

      requestServer("GET",
      "strategy/listCSV",
      false,
      true,
      function(strat_resReceived){
        strat_res=strat_resReceived;

        for(strat_resNb=0; strat_resNb<strat_res.length; strat_resNb++){

          var tr=document.createElement("tr");
          tr.id=strat_res[strat_resNb]._id

          var td_ID=document.createElement("td");
          td_ID.innerHTML=strat_resNb;

          var td_strat=document.createElement("td");
          td_strat.id=strat_res[strat_resNb].strategyid;
          td_strat.className="action";

          var td_stratInfoIMG = document.createElement("img");
          td_stratInfoIMG.src="/img/information.svg";
          td_stratInfoIMG.className="filter_img_red";

          td_stratInfoIMG.onclick=function(img){
            var e=document.getElementById(img.srcElement.parentElement.id);
            if(e!=null){
              var counter = 0;
              var step    = 0.05;
              function anim_step(){
                counter+=step;

                if(counter>=1)
                  step = -step;

                e.style.backgroundColor="rgba(255, 0, 0, "+counter+")";



                if(counter>=0)
                  requestAnimationFrame(anim_step);
              }
              requestAnimationFrame(anim_step);
            }
            else
              alert("error, strat not found in list");
          }

          td_strat.appendChild(td_stratInfoIMG);

          var td_quot=document.createElement("td");
          td_quot.id=strat_res[strat_resNb].quotfileid;
          td_quot.className="action";

          var td_quotInfoIMG = document.createElement("img");
          td_quotInfoIMG.src="/img/information.svg";
          td_quotInfoIMG.className="filter_img_red";

          td_quotInfoIMG.onclick=function(img){
            var e=img.srcElement.parentElement.id;
            console.log(e);
            if( e!=null )
              display_strat_info(e);
            else
              alert("error, strat not found in list");
          }

          td_quot.appendChild(td_quotInfoIMG);

          var td_size=document.createElement("td");
          td_size.innerHTML=strat_res[strat_resNb].size;

          var td_date=document.createElement("td");
          var dateOBJ = new Date(parseInt(strat_res[strat_resNb].date));
          td_date.innerHTML=dateOBJ.toDateString();

          var td_down=document.createElement("td");
          td_down.className="action";

          var td_down_IMG=document.createElement("img");
          td_down_IMG.src="/img/download.svg";
          td_down_IMG.className="filter_img_red";

          td_down.onclick=function(el){
            var strat_res_id_selected=el.srcElement.parentElement.parentElement.id;

            console.log(strat_res_id_selected);

            requestServer("POST",
            "strategy/downCSV",
            JSON.stringify({stratresid:strat_res_id_selected}),
            true,
            function(strat_res_received){
              var str=strat_res_received.data;

              var newLine=true;
              var firstLine=true;
              var newTd=true;

              var table=document.createElement("table");
              var tr=document.createElement("tr");
              for(var strNb=0; strNb<str.length; strNb++){

                if(str[strNb]=='\n')
                  firstLine=false;

                if(firstLine && newTd)
                  var td=document.createElement("th");
                else if(newTd)
                  var td=document.createElement("td");

                newTd=false;

                if(str[strNb]==';'){
                  newTd=true;
                  tr.appendChild(td);
                }
                else if(str[strNb]=='\n'){
                  table.appendChild(tr);
                  tr=document.createElement("tr");
                }
                else
                  td.innerHTML+=str[strNb]

              }
              document.getElementById('right_side').innerHTML="";
              var h2=document.createElement("h2");
              h2.innerHTML="Results :";
              document.getElementById('right_side').appendChild(h2);
              document.getElementById('right_side').appendChild(table);

              var encodedUri = encodeURI("data:text/csv;charset=utf-8,"+str);
              var link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "results_data.csv");
              document.body.appendChild(link); // Required for FF

              link.click(); // This will download the data file named "my_data.csv".

            },
            function(err){
              document.getElementById('right_side').innerHTML="error : "+JSON.stringify(err);
            });
          }

          td_down.appendChild(td_down_IMG);

          tr.appendChild(td_ID);
          tr.appendChild(td_strat);
          tr.appendChild(td_quot);
          tr.appendChild(td_size);
          tr.appendChild(td_date);
          tr.appendChild(td_down);

          (document.getElementById("table_strategy_result")).appendChild(tr);
        }

      },
      function(err){
        console.log(err);
      });

    },
    false //LET DEFAULT REDIRECTION
  )
}

document.addEventListener("DOMContentLoaded", function(){
  load_indicators_pattern(main);
});
