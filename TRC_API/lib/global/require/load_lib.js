module.exports = {
  require:function(){
    global.Fs             = require("fs");
    global.Https          = require("https");
    global.Dns            = require ("dns");
    global.YahooFinance   = require('yahoo-finance-data');
    global.GlobalFunction = require('../global_function.js');
    global.Request        = require("request");
    global.Jsdom          = require("jsdom");
    global.Jquery         = require('jquery');
    global.TechInd        = require('technicalindicators')
    global.Parameter      = require('../../../data/default_value/value.js');

    var {JSDOM}           = Jsdom;
    global.JSDOM          = JSDOM;

    global.Figlet         = require('figlet'); //ASCII DISPLAY
    global.Colors         = require('colors');
    global.Process        = require("process");
    global.Rdl            = require("readline");

    global.ansiEscapes    = require('ansi-escapes');

    Display.log("require -> ok");
  }
}
