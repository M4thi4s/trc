const maxOfIndicators=4;
const maxOfPatterns=4;
const maxOfIndiAndPatternByTick=6;
const maxOfConditions=8;

const operatorIndi=["<","<=","==",">=",">","!="];
const operatorPatt=["==","!="];

const possibleValueIndi=["O","H","L","C","V"];
const possibleValuePatt=["true","false"];

module.exports = function(req,res,next){

  console.log(JSON.stringify(req.body));

  var selectedIndicators=[];
  var selectedPatterns=[];

  try{

    //CHECK PARAMETER
    if(req.body.parameter){
      var atLeastOne=false;
      if(req.body.parameter.indicators){
        defined=true;
        if(Object.keys(req.body.parameter.indicators).length>maxOfIndicators)
          throw "max of indicators : "+maxOfIndicators;

        if(Object.keys(req.body.parameter.indicators).length>0)
          for(var indi in req.body.parameter.indicators){
            var currentIsFind=false;
            for(var officialIndi in idctr_global_settings)
              if(indi==officialIndi){

                //VERIFIER SI AUTANT D OPTION QUE VOULU
                if(Object.keys(req.body.parameter.indicators[indi]).length!=idctr_global_settings[indi].option.length)
                  if(Object.keys(req.body.parameter.indicators[indi]).length!=idctr_global_settings[indi].option) //.potion =0 si pas de parametre
                    throw indi+" parameter is not corresponding";

                //VERIFIER SI TOUTES LES OPTIONS SONT DEFINIS PAR UN NOMBRE
                for(var opt in req.body.parameter.indicators[indi]){

                  //CHECK SI BIEN NOMBBRE
                  if(isNaN(req.body.parameter.indicators[indi][opt])==true)
                    throw indi+" -> "+opt+" is not a number";

                  var findOPT=false;
                  for(var optNB=0; optNB<idctr_global_settings[indi].option.length; optNB++)
                    if(idctr_global_settings[indi].option[optNB]==opt)
                      findOPT=true;

                  if(!findOPT)
                    throw indi+" -> "+idctr_global_settings[indi].option[optNB]+" is not defined";
                }

                atLeastOne=true;
                currentIsFind=true;
                selectedIndicators.push(indi);
              }
            if(!currentIsFind){
              throw "undefined indicators";
            }
          }
      }
      if(req.body.parameter.pattern){
        defined=true;

        if(Object.keys(req.body.parameter.pattern).length>maxOfPatterns)
          throw "max of pattern : "+maxOfPatterns;

        if(Object.keys(req.body.parameter.pattern).length>0)
          for(var pattern in req.body.parameter.pattern){
            var currentIsFind=false;
            for(var officialPattern in pattern_global_settings)
              if(pattern==officialPattern){

                if(Object.keys(req.body.parameter.pattern[pattern]).length!=0)
                  throw pattern+" -> no parameter expected...";

                atLeastOne=true;
                currentIsFind=true;
                selectedPatterns.push(pattern);
              }
            if(!currentIsFind){
              throw "undefined pattern";
            }
          }
      }
      if(!atLeastOne)
        throw "no patterns or indicators defined";
    }
    else
      throw "no parameter";

    //CHECK STRATEGY
    if(req.body.strat){
      /*
        X TODO : verifier structure objet (bien 4 element et nom = tp_bul, tp_bea, cp_bul, cp_bea)
        ~ TODO : verifier que objet precedent contient tableau
        X TODO : verifier que autant de tick dans chaque type de position

        X TODO : verifier si nom de strat et de pattern bien définis avant (selectedPatterns, selectedIndicators)

        X TODO : verifier si au moins 1 indicateur/pattern par type de pos
        X TODO : verifier si maximum 5 indicateur + pattern par type de pos

        X TODO : vérifier si aucune répétition de nom ?

        X TODO : vérifier si valeur = nombre, ou O,H,L,C,V,true,false
        X TODO : vérifier si operateur est "==" OU "!=" si pattern
        X TODO : vérifier si operateur est "==" OU "!=" OU "<" ETC... si indi

        X TODO : vérifier si moins de 5 ou 6 verification par INDICATEUR
        XTODO : vérifier si une seule condition par PATTERN

      */

      // GLOBAL STRUCTURE CHECK
      if(Object.keys(req.body.strat).length!=4)
        throw "strategy global structure error (1)";

      if(req.body.strat.tp_bul && req.body.strat.tp_bea && req.body.strat.cp_bul && req.body.strat.cp_bea){
        if(req.body.strat.tp_bul.length == req.body.strat.tp_bea.length && req.body.strat.tp_bul.length == req.body.strat.cp_bul.length && req.body.strat.tp_bul.length == req.body.strat.cp_bea.length){

          for(var stratType in req.body.strat){

            //VERIFICATION GLOBAL
            var isIndiOrPatt=false;

            //TODO : CHECK IF NEXT req.body.strat[stratType] IS ARRAY

            for(var tickNB=0; tickNB<req.body.strat[stratType].length; tickNB++){
              var numberIndiOrPattern=0;

              //TODO : CHECK IF req.body.strat[stratType][tickNB] IS OBJECT
              for(var indiOrPattern in req.body.strat[stratType][tickNB]){
                var findIndiOrPattern=false;

                //CHECK IF INDI
                for(var indiNB=0; indiNB<selectedIndicators.length; indiNB++){
                  if(indiOrPattern==selectedIndicators[indiNB]){
                    numberIndiOrPattern++;
                    isIndiOrPatt=true;
                    findIndiOrPattern=true;

                    //TODO : VERIFIER NOM INDICATEUR ET SI NOMBRE CORRESPOND
                    for(var resName in req.body.strat[stratType][tickNB][indiOrPattern]){

                      if(idctr_global_settings[indiOrPattern].expectResult==0){
                        if(resName!="value")
                          throw "results name not found for : "+indiOrPattern+", tick : "+tickNB+" (1)";
                      }
                      else{
                        var findResName=false;
                        for(var resNameNB=0; resNameNB<idctr_global_settings[indiOrPattern].expectResult.length; resNameNB++)
                          if(idctr_global_settings[indiOrPattern].expectResult[resNameNB]==resName)
                            findResName=true;
                        if(findResName==false)
                          throw "results name not found for : "+indiOrPattern+", tick : "+tickNB+" (2)";
                      }

                      if(req.body.strat[stratType][tickNB][indiOrPattern][resName].operator && req.body.strat[stratType][tickNB][indiOrPattern][resName].nb){

                        //TODO CHECK SI OPERATOR ET NB SONT BIEN DES TABLEAUX
                        if(req.body.strat[stratType][tickNB][indiOrPattern][resName].operator.length>=1 && req.body.strat[stratType][tickNB][indiOrPattern][resName].operator.length<maxOfConditions && req.body.strat[stratType][tickNB][indiOrPattern][resName].operator.length==req.body.strat[stratType][tickNB][indiOrPattern][resName].nb.length){
                          var op=req.body.strat[stratType][tickNB][indiOrPattern][resName].operator;
                          var nb=req.body.strat[stratType][tickNB][indiOrPattern][resName].nb;
                          for(var operatorNB=0; operatorNB<op.length; operatorNB++){
                            var operatorFind=false;
                            for(var opPossibleNB=0; opPossibleNB<operatorIndi.length; opPossibleNB++)
                              if(op[operatorNB]==operatorIndi[opPossibleNB])
                                operatorFind=true;

                            if(operatorFind==false)
                              throw "error operator not found for : "+indiOrPattern+", tick : "+tickNB;

                            if(isNaN(nb[operatorNB])){
                              var findValue=false;
                              for(var valuePossibleNB=0; valuePossibleNB<possibleValueIndi.length; valuePossibleNB++)
                                if(nb[operatorNB]==possibleValueIndi[valuePossibleNB])
                                  findValue=true;
                              if(findValue==false)
                                throw "value must be number, O (open), H(high), L(low), C(close), V(volume)";
                            }

                          }

                        }
                        else
                          throw "operator or value not defined or too many condition for : "+indiOrPattern;
                      }
                      else
                        throw "no operator or value defined for : "+indiOrPattern;
                    }

                  }
                }

                //CHECK IF PATT
                for(var pattNB=0; pattNB<selectedPatterns.length; pattNB++){
                  if(indiOrPattern==selectedPatterns[pattNB]){
                    numberIndiOrPattern++;
                    isIndiOrPatt=true;
                    findIndiOrPattern=true;

                    //TODO : VERIFIER NOM INDICATEUR ET SI NOMBRE CORRESPOND
                    for(var resName in req.body.strat[stratType][tickNB][indiOrPattern]){
                      if(req.body.strat[stratType][tickNB][indiOrPattern][resName].operator && req.body.strat[stratType][tickNB][indiOrPattern][resName].nb){

                        //TODO CHECK SI OPERATOR ET NB SONT BIEN DES TABLEAUX
                        if(req.body.strat[stratType][tickNB][indiOrPattern][resName].operator.length==1 && req.body.strat[stratType][tickNB][indiOrPattern][resName].nb.length==1){
                          var op=req.body.strat[stratType][tickNB][indiOrPattern][resName].operator[0];
                          var nb=req.body.strat[stratType][tickNB][indiOrPattern][resName].nb[0];

                          var operatorFind=false;
                          for(var opPossibleNB=0; opPossibleNB<operatorIndi.length; opPossibleNB++)
                            if(op==operatorPatt[opPossibleNB])
                              operatorFind=true;

                          if(operatorFind==false)
                            throw "error operator not found for : "+indiOrPattern+", tick : "+tickNB+", only == OR !=";

                          var findValue=false;
                          for(var valuePossibleNB=0; valuePossibleNB<possibleValuePatt.length; valuePossibleNB++)
                            if(nb==possibleValuePatt[valuePossibleNB])
                              findValue=true;

                          if(findValue==false)
                            throw "value must be true or false for "+indiOrPattern+", tick : "+tickNB;
                        }
                        else
                          throw "operator or value not defined or too many condition for : "+indiOrPattern+", patterns only accepts one condition per tick";
                      }
                      else
                        throw "no operator or value defined for : "+indiOrPattern;
                    }

                  }
                }

                //INDI OR PATT NOT FOUND
                if(findIndiOrPattern==false)
                  throw "indi or pattern not found : "+indiOrPattern;

              }

              if(numberIndiOrPattern>maxOfIndiAndPatternByTick)
                throw "too many indi and pattern by tick, max : "+maxOfIndiAndPatternByTick;
            }
            if(isIndiOrPatt==false)
              throw "no indi or patt for : "+stratType;
          }

        }
        else
          throw "number of tick not corresponding";
      }
      else
        throw "strategy global structure error (2)";

      next();
    }
    else
      throw "no strat found";

  } catch(e){
    e.statusCode=400;
    next(e);
  }
}
