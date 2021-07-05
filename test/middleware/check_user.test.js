const check_usr = require("../../middleware/check_usr.js");

var req={
    headers: {
        userid: '603976af5522fd53c97877b6',
        'x-requested-with': 'XMLHttpRequest',
    },    
    body:{
        email:"test.test@test",
        password:"test"
    }
}

function test(a){
    switch(a){
        case 1:
            req.body.email="test.test@test";
            req.body.password="azertyuiopAa55";
        break;
        case 2:
            req.body.email=null;
            req.body.password="azertyuiopAa55";
        break;
        case 3:
            req.body.email="test.test@test";
            req.body.password="waa";
        break;
        case 4:
            req.body.email="test.test@test";
            req.body.password=null;
        break;
        case 5:
            req.body.email=null;
            req.body.password=null;
        break;
        case 6:
            req.body.email="test.test@";
            req.body.password="azertyuiopAa55";
        break;
        case 7:
            req.body.email="test.test@t";
            req.body.password="azertyuiopAa55";
        break;
    }
}

for(var a=1; a<8; a++){
    console.log("test + "+a);
    test(a);
    check_usr(req,{},function(a){
        console.log("next");
        if(a){
            console.log("return var : ");
            console.log(a);
        }
    });
}
