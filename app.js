const url="http://.trc.ovh";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const robots = require('express-robots-txt');

const loginRoutes = require('./routes/get/login.js');
const strategyCreatorRoutes = require('./routes/get/strategyCreator.js');
const accountRoutes = require('./routes/get/account.js');
const homeRoutes = require('./routes/get/home.js');

const strategyRoutes = require('./routes/modular/strategy.js');
const quotfileRoutes = require('./routes/get/quotfile.js');

const imgRoutes = require('./routes/get/img.js');
const jsonRoutes = require('./routes/get/json.js');
const scriptRoutes = require('./routes/get/script.js');
const stylesheetRoutes = require('./routes/get/css.js');

const userRoutes = require('./routes/post/user.js');
const createStratRoutes = require('./routes/post/createstrat.js');

const error_manager = require('./middleware/error_manager.js');

// API
const loadLib=require("./TRC_API/lib/global/require/load_module.js");
const loadModule=require("./TRC_API/lib/global/require/load_lib.js");
const loadMoreIndi=require("./TRC_API/lib/global/require/require_all_indicators.js");

const favicon = require('serve-favicon');

loadLib.require();
loadModule.require();
loadMoreIndi.require();

global.idctr_global_settings;   //USED ON MLTIPLE FILE, FOR VERIFICATION AND EXECUTION
global.pattern_global_settings; //USED ON MLTIPLE FILE, FOR VERIFICATION AND EXECUTION

OpenJSONsettingsFile.start(Fs,"./public/json/indicators_global_config.json",function(igs){
  idctr_global_settings=igs;
});

OpenJSONsettingsFile.start(Fs,"./public/json/pattern.json",function(pgs){
  pattern_global_settings=pgs;
});

/* #### DOWN DATA NEED TO BE AUTOMATIZED BUT FOR TEST USE MANUALLY */
const downData = require("./TRC_API/server_interaction/export_quotation_one_time_on_file.js");
const downDataBool=false;

mongoose.connect('mongodb+srv://root:6mEgDvzp3c7xKWR@trc.ytbhv.mongodb.net/trc?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => {
    console.log('-> Connexion MongoDB -> réussie !')
    if(downDataBool)
      downData.down();
  })
  .catch(() => console.log('-> Connexion MongoDB -> échouée !'));

const app=express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

//ANALYSE QUERY
app.use('/api/auth', userRoutes);
app.use('/api/createstrat', createStratRoutes);

//get special file
app.use('/api/strategy', strategyRoutes);
app.use('/api/quotfile', quotfileRoutes);

//SEND FILE
app.use('/login', loginRoutes);
app.use('/strategy_creator', strategyCreatorRoutes);
app.use('/account', accountRoutes);
app.use('/', homeRoutes);

app.use('/img', imgRoutes);
app.use('/json', jsonRoutes);
app.use('/js', scriptRoutes);
app.use('/css', stylesheetRoutes);

//GLOBAL : SITEMAP.XML AND ROBOTS.TXT AND FAVICON
app.get('/sitemap.xml', function(req, res){
  res.sendFile(process.cwd()+'/public/view/sitemap/sitemap.xml');
}); 

app.use(robots({ UserAgent: '*', Allow: '/', CrawlDelay: '1', Sitemap: url+'/sitemap.xml' }))

app.use(favicon(__dirname+'/public/img/favicon.ico'));

//DEFAULt ERROR MANAGER
app.use(error_manager);

module.exports = app;
