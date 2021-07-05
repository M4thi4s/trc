var global_data={
  indicators_url:"/json/indicators_global_config.json",
  pattern_url:"/json/pattern.json",
  indicators:{},
  pattern:{},
  menu_active:false,
  strat:{
    indicators:{},
    pattern:{}
  },
  last_parameter:{
    type_of_display:-1,
    //nb_tick_strat
  },
  str:""
}

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

function refresh_card_value(i){
  var type=i.srcElement.parentNode.classList[0];
  var name=i.srcElement.parentNode.classList[1];

  for(var a=0; a<i.srcElement.parentNode.children.length; a++){
    var e=i.srcElement.parentNode.children[a];
    if(e.localName=="input"){
      var v=e.value;
      var parameter=e.placeholder;

      if(v != "" && isNaN(v)==false)
        global_data.strat[type][name][parameter]=v;
      else
        global_data.strat[type][name][parameter]=undefined;
    }
  }
}

function remove_card(i){
  var type=i.srcElement.classList[0];
  var name=i.srcElement.classList[1];
  delete global_data.strat[type][name];
  i.srcElement.parentNode.remove();
}

function createIndicatorsOrPatternCard(type, name, parameter){
  (document.getElementById("indicators_pattern_list")).remove();

  global_data.strat[type][name]={};

  global_data.menu_active=false;

  var cont=document.getElementById("p1-main-container");
  var card=document.createElement("div");

  card.classList.add(type);
  card.classList.add(name);
  card.classList.add("card");

  var p=document.createElement("p")
  p.innerHTML=name;
  card.appendChild(p);

  if(parameter.option){
    for(var a=0; a<parameter.option.length; a++){
      global_data.strat[type][name][parameter.option[a]]=undefined;
      var input=document.createElement("input");
      input.type="number";
      input.placeholder=parameter.option[a];
      card.appendChild(input);
    }

    var input=document.createElement("button");
    input.type="submit";
    input.innerHTML="send parameter";
    input.onclick=refresh_card_value;
    card.appendChild(input);
  }

  var button=document.createElement("button");
  button.classList.add(type);
  button.classList.add(name);
  button.classList.add("remove");
  button.innerHTML="X";
  button.onclick=remove_card;
  card.appendChild(button);

  cont.appendChild(card);

}

function patternOrIndicatorSelected(i){
  var choice=i.srcElement.className;
  for(var indi in global_data.indicators){
    if(indi==choice)
      createIndicatorsOrPatternCard("indicators",choice,global_data.indicators[choice]);
  }
  for(var pat in global_data.pattern){
    if(pat==choice)
      createIndicatorsOrPatternCard("pattern",choice,global_data.pattern[choice]);
  }

}

function create_indicators_or_pattern_list(type){
  if(global_data.menu_active==false){
    var table=document.createElement("table");
    table.id="indicators_pattern_list";

    var row_nb=0;

    (table.createTHead(0)).innerHTML="name";

    for(var a in global_data[type]){
      tr=table.insertRow(row_nb);
      row_nb++;
      td=tr.insertCell(0);
      td.innerHTML=a;
      tr.className=a;
      td.className=a;

      tr.onclick=patternOrIndicatorSelected;

    }

    var cont=document.getElementById("p1-main-container");
    cont.appendChild(table);
    global_data.menu_active=true;
  }
  else
    alert("please select indicators/pattern before choose an other");
}

function select_and_config_page(){
  var but=document.getElementsByClassName("p1-bottom-menu-choice");
  for(var a=0; a<but.length; a++){
    but[a].onclick=function(i){
      create_indicators_or_pattern_list(i.srcElement.name)
    }
  }
}

function generate_strategy_settings(){
  console.log(global_data.strat);
  for(var a in global_data.strat.indicators){

  }
/*
  global_settings:{
    minimum_of_data:18,
    number_of_data_for_strategy:3,
    //possibility of programming system for downloading quotation by adding an interval parameter
  },

  specificalIndicatorsSettings:{ //check indicators list at => ../lib/global/indicators/indicators_global_config.json
    Stochastic:{
      parameter:{period:14,operatoralPeriod:3}
    },
    RSI:{
      parameter:{period:14},
    },
  },*/
}

function change_last_parameter_button_display(i){

  for(var a=0; a<i.srcElement.parentElement.children.length; a++)
    if(i.srcElement.parentElement.children[a].type=="button")
      i.srcElement.parentElement.children[a].style.backgroundColor="transparent";

  if(i.srcElement.id=="last_parameter_graphical")
    global_data.last_parameter.type_of_display="graphical"
  else if(i.srcElement.id=="last_parameter_code")
    global_data.last_parameter.type_of_display="code"

  i.srcElement.style.backgroundColor="var(--main-bg-color)";

}

function set_local_storage(){
  console.log(global_data);
}

function check_last_parameter_button_display(e){

  if(global_data.last_parameter.type_of_display==-1)
    alert("error : please select a displaying format")
  else{
    var number_of_tick_for_strat=(document.getElementById("last_parameter_number_tick")).value;

    if(number_of_tick_for_strat != "" && isNaN(number_of_tick_for_strat)==false){
      if(parseInt(number_of_tick_for_strat)>0){

        global_data.last_parameter.nb_tick_strat=parseInt(number_of_tick_for_strat);


        var str="global_settings:{\n";
        str+="&nbsp;&nbsp;number_of_data_for_strategy : "+number_of_tick_for_strat+"\n";
        str+="},\n";

        str+="specificalIndicatorsSettings:{\n";
        var first=true;
        for(var indiName in global_data.strat.indicators){
          if(!first)
            str+=",\n";
          first=false;

          str+="&nbsp;&nbsp;"+indiName+":{";
          str+="parameter:{";

          for(var keyNb=0; keyNb<Object.keys(global_data.strat.indicators[indiName]).length; keyNb++){
            str+="\n&nbsp;&nbsp;&nbsp;&nbsp;"+Object.keys(global_data.strat.indicators[indiName])[keyNb]+":"+global_data.strat.indicators[indiName][Object.keys(global_data.strat.indicators[indiName])[keyNb]];
            if(keyNb<Object.keys(global_data.strat.indicators[indiName]).length-1)
              str+=",";
          }
          str+="\n&nbsp;&nbsp;}}"
        }
        str+="\n},\n";
        str+="specificalIndicatorsPattern:[";
        first=true;
        for(var patName in global_data.strat.pattern)
          if(patName!=undefined){
            if(!first)
              str+=","
            str+="'"+patName+"'";
            first=false;
          }
        str+="],\n";

        global_data.str="module.exports={\n\n"+str+"\n\n";

        (document.getElementById("last_parameter_right_code")).innerHTML=str;

        var next_step=create_el("button","className","next_step_bt");
        next_step.onclick=function(){clear_display();init_step_2();};
        next_step.innerHTML="next step => ";
        (document.getElementById("last_parameter_send")).after(next_step);
      }
      else
        alert("error : number of tick for strat <= 0 OR min of data <= 2");
    }
    else
      alert("error : please choose number of tick")
  }
  //CHECK AND START GENERATING STRATEGY PARAMETER
/*
  var str="global_settings";

  for(var a=indiName in global_data.strat.indicators){

  }*/
}

function display_last_parameter(){

  var html = [
    '<div id="last_parameter_left">',
    '<p> select your creator displaying format </p>',
    '<button type="button" name="graphical" id="last_parameter_graphical" class="p1-bottom-menu-button" id="graphical">graphical</button>',
    '<button type="button" name="code" id="last_parameter_code" class="p1-bottom-menu-button">code</button></br>',
    '<p> Enter how many tick you need to send at every tick for confirm your strat (>0)</p>',
    '<input type="number" name="minTickNumber" id="last_parameter_number_tick" class="p1-bottom-menu-button" placeholder=2></input></br>',
    '<p> Enter how many tick minimum you need to calculate your indicators/patterns (>2)</p></br>',
    '<button type="submit" name="send" class="p1-bottom-menu-button" id="last_parameter_send">send</button>',
    '</div>',
    '<div id="last_parameter_right">',
    '<p id="last_parameter_right_title">parameter results : </p></br>',
    '<p id="last_parameter_right_code"></p>',
    '</div>',
  ].join("\n");

  var cont=document.createElement("div");

  cont.innerHTML=html;
  cont.id="last_parameter";

  (document.getElementById("display_div")).appendChild(cont);

  (document.getElementById("last_parameter_graphical")).onclick=change_last_parameter_button_display;
  (document.getElementById("last_parameter_code")).onclick=change_last_parameter_button_display;
  (document.getElementById("last_parameter_send")).onclick=check_last_parameter_button_display;
}

function finish_config_indicators_and_pattern(){
  //verifier qu'il y a au moins un indicateur
  var noUndefined=true;

  var isThereMoreThanOneIndicatorsOrPattern=false;
  for(var a in global_data.strat)
    for(var b in global_data.strat[a])
      isThereMoreThanOneIndicatorsOrPattern=true;

  if(isThereMoreThanOneIndicatorsOrPattern==true){
    for(var a in global_data.strat){
      for(var b in global_data.strat[a]){
        if(Object.keys(global_data.strat[a][b]).length>0){
          for(var c in global_data.strat[a][b]){
            if(global_data.strat[a][b][c]==undefined)
              noUndefined=false;
          }
        }
      }
    }
    if(noUndefined==true){
      var cont=document.getElementById("display_div");
      while (cont.firstChild)
        cont.removeChild(cont.lastChild);

      display_last_parameter();
    }
    else
      alert("there are undefined parameters, check that you have sent all your parameters")
  }
  else
    alert("please select at least one indicator / pattern");
}

/* FONCTION STEP 2 */
var step_2={
  ele:{      //global element
    lt_d:{  //left top
      title:"TAKE POSITION BULLISH",
      alias:"tp_bul",
      menu:{
        bp:[]
      }
      //global_div
      //title_p
      //tick_div
      //menu_div
      /*
      tick1{
        div
        title
        default_msg
        constraint:{}
      }, ...
      menu{
        select
        bp:[
          tick1,
          tick2,
          tick3,
        ]
      }
      */
    },
    rt_d:{  //right top
      title:"TAKE POSITION BEARISH",
      alias:"tp_bea",
      menu:{
        bp:[]
      }

    },
    lb_d:{  //left bottom
      title:"CLOSE POSITION FROM BULLISH",
      alias:"cp_bul",
      menu:{
        bp:[]
      }

    },
    rb_d:{  //right bottom
      title:"CLOSE POSITION FROM BEARISH",
      alias:"cp_bea",
      menu:{
        bp:[]
      }

    }
  },

  tp_bul:[    //take pos from bullish
    /* fonctionnement :
    TICKXX:[
        indi:nomXXX,
        constraint:[
          {
            key : nomXXX,
            operator : XXX,
            value : XXX
          },
          {},
      ]

    }
    */

  ],
  tp_bea:[],  //take pos from bearish
  cp_bul:[],  //close pos from bullish
  cp_bea:[],  //close pos from bearish

};

var is_data_send=false;

function step_2_finish(){

  //AJAX REQUEST

  var jsonOBJ={
    parameter:{
      indicators:global_data.strat.indicators,
      pattern:global_data.strat.pattern
    },
    strat:{
      tp_bul:step_2.tp_bul,
      tp_bea:step_2.tp_bea,
      cp_bul:step_2.cp_bul,
      cp_bea:step_2.cp_bea
    }
  }
  //TODO REMETTRE CHECK
  if(is_data_send==false){
    is_data_send=true
    requestServer("POST",
    "createstrat",
    JSON.stringify(jsonOBJ),
    true,
    function(res){  //onSuccess
      console.log(res);
      document.location.href="/account/";
    },
    function(err){  //onError
      console.log(err);
      is_data_send=false;
      alert(err.responseJSON.error);
    });
  }
  else
    alert("data already send, please wait for server response");

  //clear_display();
  //step_3(global_data.str);
}

//only print data and start step 4
function step_3(str){
  var str_container_element=document.createElement("div");
  str_container_element.id="code"
  str_container_element.innerHTML="<h2>Your code</h2>  <pre>  <code>"+str+"\n\n</code>  </pre>";
  (document.getElementById("display_div")).appendChild(str_container_element)

  check_again_code();

}

function step_4(){
  console.log("start sending data");
}

function repair_str(str){
  //replace nbsp=>" "
  for(var a=0; a<str.length-6; a++){
    if(str[a]+str[a+1]+str[a+2]+str[a+3]+str[a+4]+str[a+5]=="&nbsp;"){
      var str1 = str.substr(0,a);
      str1+=" ";
      str1+=str.substr(a+6,str.length-1)
      str=str1;
      a=0;
    }
  }
  return str;
}

function init_step_2(){

  var style=document.createElement("style");
  style.innerHTML="button:hover, input:hover, select:hover, img.indi-delete:hover,  button:focus, input:focus, select:focus, img.indi-delete:focus{    background-color: var(--main-bg-color);    color:var(--main-txt-color);    cursor: pointer;   }";
  document.body.appendChild(style);

  //creation div
  step_2.ele.lt_d.global_div=create_el("div","className","left-top");
  step_2.ele.rt_d.global_div=create_el("div","className","right-top");
  step_2.ele.lb_d.global_div=create_el("div","className","left-bottom");
  step_2.ele.rb_d.global_div=create_el("div","className","right-bottom");

  //creation titre section
  for(var side in step_2.ele){
    step_2.ele[side].title_p=create_el("p","className","display-menu-title");
    step_2.ele[side].title_p.innerHTML=step_2.ele[side].title;
    step_2.ele[side].global_div.appendChild(step_2.ele[side].title_p);
  }

  //creation tick section
  for(var side in step_2.ele){

    step_2.ele[side].tick_div=create_el("div","className","tick-list");

    for(var tick_nb=0; tick_nb<global_data.last_parameter.nb_tick_strat; tick_nb++){
      step_2.ele[side]["tick"+tick_nb]={};

      step_2.ele[side]["tick"+tick_nb].constraint={};

      step_2.ele[side]["tick"+tick_nb].div=create_el("div","className","tick"+tick_nb);

      step_2.ele[side]["tick"+tick_nb].title=create_el("p","className","tick-title");
      step_2.ele[side]["tick"+tick_nb].title.innerHTML="tick "+tick_nb;
      step_2.ele[side]["tick"+tick_nb].title.title="the last tick represents the last price value, the other ticks are there to detect trend reversals";

      step_2.ele[side]["tick"+tick_nb].div.appendChild(step_2.ele[side]["tick"+tick_nb].title);

      step_2.ele[side]["tick"+tick_nb].default_msg=create_el("p","className","default-tick-title");
      step_2.ele[side]["tick"+tick_nb].default_msg.innerHTML="VALIDATE BY DEFAULT";
      step_2.ele[side]["tick"+tick_nb].default_msg.id="v_"+side+tick_nb;
      step_2.ele[side]["tick"+tick_nb].div.appendChild(step_2.ele[side]["tick"+tick_nb].default_msg);

      step_2.ele[side].tick_div.appendChild(step_2.ele[side]["tick"+tick_nb].div);
    }

    step_2.ele[side].global_div.appendChild(step_2.ele[side].tick_div);

  }

  //creation menu
  for(var side in step_2.ele){
    step_2.ele[side].menu_div=create_el("div","className","display-bottom-menu");

    step_2.ele[side].menu.select=create_el("select","className","select-ind");
    //no difference between indicators and pattern
    for(var indiName in global_data.strat.indicators){
      var opt=create_el("option","innerHTML",indiName);
      opt.value=indiName;
      step_2.ele[side].menu.select.appendChild(opt);
    }

    for(var pattern in global_data.strat.pattern){
      var opt=create_el("option","innerHTML",pattern);
      opt.value=pattern;
      step_2.ele[side].menu.select.appendChild(opt);
    }

    step_2.ele[side].menu_div.appendChild(step_2.ele[side].menu.select);

    for(var tick_nb=0; tick_nb<global_data.last_parameter.nb_tick_strat; tick_nb++){
      step_2.ele[side].menu.bp.push(create_el("button","className","add"));

      var el_courant=step_2.ele[side].menu.bp[step_2.ele[side].menu.bp.length-1];

      el_courant.innerHTML="tick "+tick_nb;
      el_courant.onclick="tick "+tick_nb;

      //add indi
      el_courant.setAttribute("onclick"," var indi=get_indi_onclick(this); if(indi!=1){create_constraint('"+side+"',"+tick_nb+",indi);}; ");

      step_2.ele[side].menu_div.appendChild(step_2.ele[side].menu.bp[step_2.ele[side].menu.bp.length-1]);
    }

    step_2.ele[side].global_div.appendChild(step_2.ele[side].menu_div);
  }

  //display template
  for(var side in step_2.ele)
    (document.getElementById("display_div")).appendChild(step_2.ele[side].global_div)

  //last send div
  var divSend=create_el("div","className","send");
  var divSendBT=create_el("button","className","but")
  divSendBT.innerHTML="SEND";

  divSendBT.setAttribute("onclick","step_2_finish();");

  divSend.appendChild(divSendBT)

  var dp=document.getElementById("display_div")
  dp.appendChild(divSend);

  //init step_2.XX_XXX[XX]
  for(var side in step_2.ele){
    alias=step_2.ele[side].alias;
    for(var tick_nb=0; tick_nb<global_data.last_parameter.nb_tick_strat; tick_nb++)
      step_2[alias].push({});
  }

}

function get_indi_onclick(bp){
  for(var a=0; a<bp.parentElement.childNodes.length; a++){
    if(bp.parentElement.childNodes[a].className[0]="select-ind"){
      if(bp.parentElement.childNodes[a].value!="" && bp.parentElement.childNodes[a].value!=undefined){
        return bp.parentElement.childNodes[a].value;
      }
    }
  }
  alert("error : select element not found")
  return 1;
}

function generate_option_element(parent, name, is_indicator, first_use){ //if first_use=0 => first use

  var p_name=create_el("p","innerHTML",name);

  var select=create_el("select","className","select-ind");

  if(is_indicator==false)
    var compatible_operator=["==","!="];
  else
    var compatible_operator=["<","<=","==",">=",">","!="];
  for(var a=0; a<compatible_operator.length; a++){
    var opt=create_el("option","value",compatible_operator[a]);
    opt.innerHTML=compatible_operator[a];
    select.appendChild(opt);
  }

  var input=create_el("input","type","text");
  input.className="indi-input";
  if(is_indicator==false)
    input.placeholder="true/false";
  else
    input.placeholder="Nb/O/H/L/C/V";

  if(first_use==0){
    parent.appendChild(p_name);
    parent.appendChild(select);
    parent.appendChild(input);

    var bt=create_el("button","className","indi-input-add");
    bt.innerHTML="+";
    bt.setAttribute("onclick","generate_option_element(this.parentNode, '"+name+"', "+is_indicator+", 1)");

    parent.appendChild(bt);
    parent.appendChild(document.createElement("br"));

  }
  else{
    //PARCOURIR ENFANT DU PARENT, QUAND NAME=p.innerHTML => inserer avant +, inserer br, inserer les element
    console.log(parent);
    var find=false;
    for(var childNb=0; childNb<parent.childNodes.length; childNb++){
      console.log(parent.childNodes[childNb]);

      if(parent.childNodes[childNb].nodeName=="P" && find==false){
        if(parent.childNodes[childNb].innerHTML==name){
          find=true;
        }
      }
      if(find==true){
        console.log(parent.childNodes[childNb].className);
        if(parent.childNodes[childNb].nodeName=="BUTTON" && parent.childNodes[childNb].className=="indi-input-add"){

          parent.insertBefore(input,parent.childNodes[childNb]);

          parent.insertBefore(select,parent.childNodes[childNb]);

          parent.insertBefore(p_name,parent.childNodes[childNb]);

          parent.insertBefore(document.createElement("br"),parent.childNodes[childNb]);

          break;
        }
      }
    }
  }

}

function validate_strat(side, name, tickNb, this_){

  var parentNode=this_.parentNode.childNodes;

  var step=0;   //0 = paragraph(name), 1=select(operator), 2=input(number), 3=br(next)

  var obj={
    /*
    key:{
      operator:[]
      nb:[]
    }
    */
  }
  var current_name=0;

  for(var childNb=0; childNb<parentNode.length; childNb++){

    if(step==0 && parentNode[childNb].nodeName=="P" && current_name==0){
      current_name=parentNode[childNb].innerHTML;
      if(obj[current_name]==undefined){
        obj[current_name]={
          operator:[],
          nb:[]
        }
      }
      step=1;
    }
    else if(step==1 && parentNode[childNb].nodeName=="SELECT" && parentNode[childNb].className=="select-ind" && current_name!=0){
      //add check
      if(parentNode[childNb].value!=""){
        obj[current_name].operator.push(parentNode[childNb].value);
        step=2;
      }
      else{
        alert("you must write a value by option - select operator")
        return 1;
      }
    }
    else if(step==2 && parentNode[childNb].nodeName=="INPUT" && parentNode[childNb].className=="indi-input" && current_name!=0){
      //add check
      if(parentNode[childNb].value!=""){
        obj[current_name].nb.push(parentNode[childNb].value);
        current_name=0;
        step=3;
      }
      else{
        alert("you must write a value by option - value input")
        return 1;
      }
    }
    else if(step==3 && parentNode[childNb].nodeName=="BR" && current_name==0)
      step=0;
  }

  for(var na in obj)
    for(var key in obj[na])
      if(obj[na].operator.length != obj[na].nb.length){
        alert("error while processing value")
        return 1
      }

  //  VALIDATE : LIRE TOUTES LES DONNEES ET ENREGISTRER DANS **_** / TICK** / NAMEXX
  step_2[step_2.ele[side].alias][tickNb][name]=obj;

}

function clear_strat(side, name, tickNb, this_){
  var ref=side+tickNb+name;

  console.log(name);

  delete step_2.ele[side]["tick"+tickNb].constraint[ref];

  if(step_2[step_2.ele[side].alias][tickNb][name])
    delete step_2[step_2.ele[side].alias][tickNb][name];
  else
    console.log("not yet validated")

  var parentNode=this_.parentNode.childNodes;
  for(var childNb=0; childNb<parentNode.length; childNb++)
    if(parentNode[childNb].nodeName=="INPUT")
      parentNode[childNb].value="";
}

function delete_strat_element(side, name, tickNb, this_){
  clear_strat(side, name, tickNb, this_);

  this_.parentNode.parentNode.remove();

  if(step_2.ele[side]["tick"+tickNb].div.childNodes.length==1)
    step_2.ele[side]["tick"+tickNb].div.appendChild(step_2.ele[side]["tick"+tickNb].default_msg);

}

function create_indi_element(name, is_indicator, side, tickNb,options){
  var main_div=create_el("div","className","indi");

  var indi_title=create_el("div","className","indi-title");
  indi_title.appendChild(create_el("p","innerHTML",name));

  var img_delete = create_el("img","className","indi-delete");
  img_delete.src="/img/close.svg";
  img_delete.setAttribute("onclick","delete_strat_element('"+side+"','"+name+"',"+tickNb+",this);");
  indi_title.appendChild(img_delete);

  main_div.appendChild(indi_title);

  var strat_selector = create_el("div","className","strat-selector");
//  var p_strat_selector = document.createElement("p");

  if(options==0)
    options=["value"];

  for(var optNb=0; optNb<options.length; optNb++)
    generate_option_element(strat_selector, options[optNb], is_indicator, 0)
  //  generate_option_element(parent, name, is_indicator, this)

  var bt_v=create_el("button","className","indi-input-valid");
  bt_v.innerHTML="VALIDATE";
  bt_v.setAttribute("onclick","validate_strat('"+side+"','"+name+"',"+tickNb+",this);");

  var bt_r=create_el("button","className","indi-input-remove");
  bt_r.innerHTML="CLEAR";
  bt_r.setAttribute("onclick","clear_strat('"+side+"','"+name+"',"+tickNb+",this);");

  strat_selector.appendChild(bt_v);
  strat_selector.appendChild(bt_r);

  main_div.appendChild(strat_selector);

  return main_div;
}

function create_constraint(side,ticknb,name){
  // AJOUTER A BONNE POSITION

  var ref=side+ticknb+name

  //check if already exists
  if(step_2.ele[side]["tick"+ticknb].constraint[ref]!=undefined)
    alert("error : already exists")
  else{
    //delete default paragraph
    var t=document.getElementById("v_"+side+ticknb);
    if(t!=undefined)
      t.remove();

    //check if pattern/indicators
    var is_indicator=false;
    var options=0
    for(var indi in global_data.indicators)
      if(indi==name){
        is_indicator=true;
        options=global_data.indicators[indi].expectResult;
      }

    var indi_el=create_indi_element(name,is_indicator,side,ticknb,options);
    step_2.ele[side]["tick"+ticknb].div.appendChild(indi_el);
    step_2.ele[side]["tick"+ticknb].constraint[ref]=indi_el;
  }

  /*

  VERIFIER SI EXISTE DEJA
  VERIFIER SI PRESENCE DE "VALIDATE BY DEFAULT" => SUPPRIMER PARAGRAPH AVANT AJOUT

  VERIFIER SI PATTERN/STRAT
  SI PATTERN : operator OBLIGATOIREMENT = et valeur true/false

  VERIFIER SI RETOUR SINON = [VALUE]    //REMPLACER DEFAULT PAR VALUE CAR + compéhensible

  generer onclick avec variable suivante : side, tick, nom

  initialiser reference : side+ticknb+nom
  PREMIERE ETAPE : enregistrer nouveau element dans step_2.ele.XXX.tickXX.constraint[REFXX]=obj

  VALIDATE : LIRE TOUTES LES DONNEES ET ENREGISTRER DANS **_** / TICK** / NAMEXX
  REMOVE : supprimer dans step_2.ele.XXX.tickXX.constraint[REFXX] et dans (SI EXISTE) **_** / TICK** / refXX

  + BUTTON : rajoute ligne

  */

  // BOUTON SUPPRIMER => SUPPRIME DANS STRAT
  // Valider => creer
}

/* FONCTION INTERMEDIAIRE */
function clear_display(){
  var d=document.getElementById("display_div");
  d.innerHTML="";
}

function create_el(el, at, v){
  var a=document.createElement(el);
  a[at]=v;
  return a;
}

function swapStyleSheet(sheet) {
  document.getElementById("pagestyle").setAttribute("href", sheet);
}

/* FONCTION LANCEMENT */
document.addEventListener("DOMContentLoaded", function(){
  checkAuthentification(
    function(res){
      load_indicators_pattern(function(){
        select_and_config_page();
        (document.getElementById("p1-bottom-menu-finish")).onclick=finish_config_indicators_and_pattern;
      })
    },
    false //LET DEFAULT REDIRECTION
  )
});
