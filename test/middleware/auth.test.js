const auth = require("../../middleware/auth.js");

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
        case 1: //check expiration
            req.headers.token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MDM5NzZhZjU1MjJmZDUzYzk3ODc3YjYiLCJpYXQiOjE2MjE2Mzc1NDgsImV4cCI6MTYyMTcyMzk0OH0.4QhxDnVqfNVFKp15Gap_u4winES2N6QMMlhJJtCmXQU';
            req.headers.userid='603976af5522fd53c97877b6';
        break;
        case 2: //check sans token
            req.headers.token='';
        break;
        case 3: //check token null
            req.headers.token=null;
        break;
        case 4: //check token contenant caractère spéciaux
            req.headers.token='{¹~#{[|`\^@]}ù';
        break;
        case 5: //check token valide et userid invalide
            req.headers.token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MDM5NzZhZjU1MjJmZDUzYzk3ODc3YjYiLCJpYXQiOjE2MjE2Mzc1NDgsImV4cCI6MTYyMTcyMzk0OH0.4QhxDnVqfNVFKp15Gap_u4winES2N6QMMlhJJtCmXQU';
            req.headers.userid='603976af5522fd53c97877b5';
        break;
        case 6: //userid null
            req.headers.token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MDM5NzZhZjU1MjJmZDUzYzk3ODc3YjYiLCJpYXQiOjE2MjE2Mzc1NDgsImV4cCI6MTYyMTcyMzk0OH0.4QhxDnVqfNVFKp15Gap_u4winES2N6QMMlhJJtCmXQU';
            req.headers.userid=null;
        break;
        case 7:
            req={};
        break;
    }
}

for(var a=1; a<8; a++){
    console.log("test + "+a);
    
    test(a);

    auth(req,{},function(a){
        console.log("next");
        if(a){
            console.log("return var : ");
            console.log(JSON.stringify(a));
        }

    });
}
