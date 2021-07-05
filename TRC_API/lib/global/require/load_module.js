module.exports = {
  require:function(){
    global.Display                        = require("../display/display.js");

    global.Down={
      list :                              require("../../../bin/down_list.js"),            //add lib down/list/down_list.js
      quotation :                         require("../../../bin/down_quotation.js"),  //add lib down/quotation/down_quotation.js
    };

    Down.list.DownloadList                = require("../down/list/down_list.js");
    Down.quotation.DownQuotation          = require("../down/quotation/down_quotation.js");

    global.CheckSEschedule                = require("../down/list/check_SE_shedule.js");
    global.MakeJSONfile                   = require("../local_interaction/make_json_quotation_file.js");
    global.OpenJSONquotation              = require("../local_interaction/open_json_quotation_file.js");
    global.OpenJSONsettingsFile           = require("../local_interaction/open_json_settings_file.js");

    global.QuotationObjToArr              = require("../conversion/check_and_convert_to_array_quotation.js");
    global.QuotationConvertForData        = require("../conversion/convert_data_for_indicators.js");

    global.SetIndParameter                = require("../indicators/apply_ind_parameter.js");
    global.GetOffset                      = require("../indicators/indicators_offset.js");

    global.OrganizeInd                    = require("../indicators/organize_ind_data.js");
    global.SaveDataForDisplaying          = require("../local_interaction/save_data_for_displaying.js");

    global.CalculateIndicators            = require("../indicators/calcul_ind.js");

    global.AutomaticIndicatorCalculation  = require("../../../bin/automatic_indicator_calculation.js");

    global.SelectNeededQuot               = require("../pattern/select_quot.js");
    global.CheckPattern                   = require("../pattern/check.js");

    global.GetMinOfTick                   = require("../../../bin/get_min_number_tick.js");

    global.LoadingBar                     = require("../local_interaction/progress_bar.js");

  }
}
