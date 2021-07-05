module.exports = {
  period:14,
  interval:"1m",
  interval_in_minutes:1,
  verbose:true,

  api:{
    key:"dj0yJmk9M1dUc2VNNzRVVWNLJmQ9WVdrOVRsaGhiMFpzTmpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTE4",
    secret:"12ed2b5790ddb72a75de2b64f92fe49623e764fc"
  },

  nb_page_to_down_list:1, //0=default, default is 3

  SE: {     // return , -1=error, 0=open, 1=close
    //http,//www.broker-cfd.fr/heures-ouverture-bourses.php
    stock_exchange:{
      NYSE:{                              //SCHEDULE WITH YOUR TIMEZONE <-> only to check if you download at an inappropriate time + TO DELETE inappropriate DATA
        schedule:[[15,30,00],[24,00,00]]
      },
      NASDAQ:{                            //SCHEDULE WITH YOUR TIMEZONE <-> only to check if you download at an inappropriate time  + TO DELETE inappropriate DATA
        schedule:[[15,30,00],[24,00,00]]
      },
      AMEX:{                              //SCHEDULE WITH YOUR TIMEZONE <-> only to check if you download at an inappropriate time  + TO DELETE inappropriate DATA
        schedule:[[15,30,00],[24,00,00]]
      },
      /*NYSE:{                              //US
        schedule:[[15,30,00],[22,00,00]]
      },
      NASDAQ:{                            //US
        schedule:[[15,30,00],[22,00,00]]
      },
      AMEX:{                              //US
        schedule:[[15,30,00],[22,00,00]]
      },*/
      TSE:{                               //Tocky Stock Exchange
        schedule:[[16,00,00],[18,00,00],[20,00,00],[22,00,00]]
      },
      LSE:{                               //london Stock Exchange
        schedule:[[09,30,00],[17,30,00]]
      },
      LSIN:{                              //uk
        schedule:[[09,30,00],[17,30,00]]
      },
      SSE:{                               //Shanghai Stock Exchange
        schedule:[[15,30,00],[17,30,00],[19,00,00],[21,00,00]],
        yahoo_compatibility:{
          ref:".SS"
        }
      },
      TSX:{                              //canada
        schedule:[[15,30,00],[22,00,00]]
      },
      TSXV:{                              //canada
        schedule:[[15,30,00],[22,00,00]]
      },
      CSE:{                              //canada security exchange
        schedule:[[15,30,00],[21,30,00]]
      },
      XETR:{                              //all.
        schedule:[[09,00,00],[17,30,00]]
      },
      SZSE:{                              //shenzhen
        schedule:[[03,30,00],[05,30,00],[07,00,00],[09,00,00]]
      },
      EURONEXT:{                          //EU
        schedule:[[09,30,00],[17,30,00]]
      }
    }

  },

}
