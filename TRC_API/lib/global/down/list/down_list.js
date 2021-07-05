module.exports = {
  wil:{
      v1:{
        var:{
          address:{

            path:[
              {name:"usa",    link:"/markets/stocks-usa/market-movers-active/"           },
  /*            {name:"china",  link:"/markets/stocks-china/market-movers-active/"         },
              {name:"japan",  link:"/markets/stocks-japan/market-movers-active/"         },
              {name:"uk",     link:"/markets/stocks-united-kingdom/market-movers-active/"},
              {name:"nl",     link:"/markets/stocks-netherlands/market-movers-active/"   },
              {name:"canada", link:"/markets/stocks-canada/market-movers-active/"        },
              {name:"de",     link:"/markets/stocks-germany/market-movers-active/"       },*/
            ],

            url:"https://www.tradingview.com",
          },
          counter:[0,0],  //[0, address.path.length]


        },

        start: function(success){
          Display.log("<----> Worldwide Instrument List <---->");
          this.var.counter[1]=this.var.address.path.length;
          this.main(success);
        },

        main: function(success){
          var this_=this;
          GlobalFunction.check_connection("google.gg", function(err){
            if(err==0){

              var return_indice_list={}; //{ INDICE:{SE:X,Volume:X}, INDICE:{SE:X,Volume:X}}

              //*********** START ***********//
              Display.log("connexion --------> OK");

              for(var a=0; a<this_.var.address.path.length; a++){
                var path=this_.var.address.path[a].link;

                GlobalFunction.request(Request, this_.var.address.url, path, 0, function(err,data){

                  if(err == 0){
                    Display.log("recup data -------> OK");

                    var input_array=this_.parseData(data);

                    if(input_array!=1){
                      try {
                        for(var a in input_array)
                          return_indice_list[a]=input_array[a]

                        this_.var.counter[0]+=1;
                        Display.log(this_.var.counter[0]+'/'+this_.var.counter[1])

                        if(this_.var.counter[0]==this_.var.counter[1])
                          success(return_indice_list);


                      } catch (err){
                        Display.log(err)
                      }
                    }
                  }

                  else
                    Display.log("ERROR -> erreur request "+err);
                });
              }
            }
            else
              Display.log("ERROR -> site innaccessible");
          });
        },

        parseData : function(data){
          var class_name="KHDSHJDSFIFSOFSDPDSFK";
          var reg=new RegExp("(tv-screener__symbol)", "g");
          data=data.replace(reg,class_name);

          //Display.log(data);

          var dom = new JSDOM(data);
          var $ = (Jquery)(dom.window);

          var i = $("."+class_name);

          var h1=$("h1")[0].innerHTML;

          var indice_array=[];
          var volume_array=[];
          var counter_array=0;

          for(var a = 0; a < i.length; a++){
            var href = $(i[a]).attr('href');
            if(href.indexOf("/symbols/")==0){
              counter_array++;

              //************ volume ************//
              var parent;
              parent=$(i[a]).parent();
              parent=$(parent).parent();
              parent=$(parent).parent();
              parent=$(parent).parent();

              var child_obj=$(parent).find('td');

              //************ indice ************//
              href=href.slice(9, href.length-1);

              reg=new RegExp("(-)", "g");
              href=href.replace(reg,",");

              //href=href.slice(href.indexOf("-")+1, href.length);

              if(child_obj[5].innerHTML[child_obj[5].innerHTML.length-1]=="M" || child_obj[5].innerHTML[child_obj[5].innerHTML.length-1]=="K"){
                volume_array.push(child_obj[5].innerHTML);
                indice_array.push(href)
              }

            }
          }

          if(indice_array.length==volume_array.length){
            Display.log("NB OF INDICE : "+h1+" - "+volume_array.length+" / 100");
            var indice={};
            for(var a=0; a<indice_array.length; a++){
              var z=indice_array[a].split(",");
              var v=volume_array[a].slice(0,volume_array[a].length-1);
              indice[z[1]]={"SE":z[0],"Volume":v};

            }

            return indice;
          }
          else{
            Display.log("data error")
            Display.log(1)
          }

        },

      }
    },
  nasdaq:{
      v1:{

        address:{
          nasdaq:{ //nasdaq 1
            path:' "/bourse/actions/palmares/international/page-"+a+"?international_filter%5Bcountry%5D=1&international_filter%5BindexTrading%5D=103&international_filter%5Bvariation%5D=50003&international_filter%5Bperiod%5D=8&international_filter%5Bfilter%5D=" ',
            cookie:"atidvisitor:{\"name\":\"atidvisitor\",\"val\":{\"vrn\":\"-584533-\",\"at\":\"\",\"ac\":\"1\"},\"options\":{\"path\":\"/\",\"session\":15724800,\"end\":15724800}},  measure:{\"contentLifetime\":15,\"mapResponseAuth\":{\"247047218484\":{\"host\":\"https://collecte.audience.acpm.fr/m/web/\",\"access\":\"full\",\"creationDate\":1571418813795}}},   RT:\"z=1&dm=boursorama.com&si=9qlxzdivrfq&ss=k1wdhzrc&sl=4&tt=hoq&bcn=/bucky/v1/send/&ld=pwtt&ul=11ojm\",  TC_PRIVACY:0@005@ALL, TC_PRIVACY_CENTER:ALL, tc_prvBarPageCounter:15, TCPID:1191042020551246846452",
            nb_page_to_down:3,
          },
          url:"https://www.boursorama.com",
          security:"https",
        },

        start: function(success){
          Display.log("<----> DOWNLOAD NASDAQ INSTRUMENT LIST - SORT BY VOLUME <---->");
          this.main(success);
        },

        main : function(succes){
          var _this=this;

          Display.log("OPEN & READ FILE -> OK")

          var indice_list=[];
          var counter=[0,this.address.nasdaq.nb_page_to_down]

          //*********** START ***********//
          for(var a=1; a<this.address.nasdaq.nb_page_to_down+1; a++){
            var path=eval(this.address.nasdaq.path);
            GlobalFunction.request(Request, _this.address.url, path, _this.address.nasdaq.cookie, function(err,data){

              if(err == 0){
                Display.log("recup data -------> OK");

                var indice_array_return=_this.parseData(data);

                for(var a=0; a<indice_array_return.length; a++)
                  indice_list[indice_array_return[a]] = { SE : "NASDAQ" };

              }

              else
                Display.log("ERROR -> erreur request "+err);

              counter[0]++;

              if(counter[0]==counter[1]){
                Display.log("Nasdaq Finish - "+counter[1]+" - "+Object.keys(indice_list).length);
                succes(indice_list);
              }

            });
          }
        },

        parseData : function(data){

          var class_name=["123456789CLASSENAME","123456789789456123sf"];

          var reg=new RegExp("(c-link   c-link--animated c-link--neutral c-link--hover-light c-link--no-underline c-link--medium)", "g");
          data=data.replace(reg,class_name[1]);

          reg=new RegExp("(c-link   c-link--animated)", "g");
          data=data.replace(reg,class_name[0]);

          var dom = new JSDOM(data);
          var $ = (Jquery)(dom.window);

          var i = $("."+class_name[0]);

          var indice_array=[];

          for(var a = 0; a < i.length; a++){
            var href = $(i[a]).attr('href');
            if(href.indexOf("/cours/")==0){

              href=href.slice(7, href.length-1);
              indice_array.push(href)

            }
          }

          return indice_array;

        }
      }
    }
}
