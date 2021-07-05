function ValidateEmail(mail){
 return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail));
}
// PASSWORD GENERATION
const passwordValidator = require('password-validator');
var pswSchema = new passwordValidator();

pswSchema
.is().min(8)                                    // Minimum length 8
.is().max(20)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().not().spaces()                           // Should not have spaces


module.exports = function(req,res,next){

  var passwordValidator = require('password-validator');

  try {
    if(ValidateEmail(req.body.email)){
      if(pswSchema.validate(req.body.password))
        next();
      else
        throw new Error("invalid PSW format : 8 to 20 characters which contain at least one uppercase and one lowercase letter");
    }
    else
      throw new Error("invalid email format");
  } catch(e) {
    e.statusCode=400;
    next(e);
  }
}
