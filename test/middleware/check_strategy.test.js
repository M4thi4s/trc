const check_usr = require("../../middleware/check_usr.js");

var req = {
    body={
        "parameter": {
            "indicators": {
                "Stochastic": {
                    "period": 14,
                    "signalPeriod": 14
                },
                "SMA": {
                    "period": 14
                }
            },
            "pattern": {
                "bullishmarubozu": {}
            }
        },
        "strat": {
            "tp_bul": [
                {
                    "Stochastic": {
                        "d": {
                            "operator": ["<"],
                            "nb": ["50"]
                        }, "k": {
                            "operator": ["<"],
                            "nb": ["50"]
                        }
                    }
                }, {
                    "SMA": {
                        "value": {
                            "operator": ["=="],
                            "nb": ["L"]
                        }
                    }
                }
            ],
            "tp_bea": [
                {
                    "bullishmarubozu": {
                        "value": {
                            "operator": ["=="],
                            "nb": ["true"]
                        }
                    }
                },
                {}
            ],
            "cp_bul": [
                {},
                {
                    "Stochastic": {
                        "d": {
                            "operator": ["<"],
                            "nb": ["50"]
                        },
                        "k": {
                            "operator": ["<"],
                            "nb": ["50"]
                        }
                    }
                }
            ],
            "cp_bea": [
                {
                    "bullishmarubozu": {
                        "value": {
                            "operator": ["=="],
                            "nb": ["true"]
                        }
                    }, "SMA": {
                        "value": {
                            "operator": ["<"],
                            "nb": ["O"]
                        }
                    },
                    "Stochastic": {
                        "d": {
                            "operator": ["<"],
                            "nb": ["50"]
                        },
                        "k": {
                            "operator": ["<"],
                            "nb": ["50"]
                        }
                    }
                },
                {}
            ]
        },
        "global_settings": {
            "minimum_of_data": 28,
            "number_of_data_for_strategy": 2
        }
    }
}

function test(a) {
    switch (a) {
        case 1:

            break;
    }
}

for (var a = 1; a < 2; a++) {
    console.log("test + " + a);
    test(a);
    check_usr(req, {}, function (a) {
        console.log("next");
        if (a) {
            console.log("return var : ");
            console.log(a);
        }
    });
}