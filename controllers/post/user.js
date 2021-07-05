const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user.js');

exports.signup = function(req,res,next){

  var timestamp=new Date().getTime();

  bcrypt.hash(req.body.password, 10)
  .then(function(hash){
    const user = new User({
      email : req.body.email,
      password:hash,
      creationDate:timestamp,
      isConfirm: false
    });
    user.save()
      .then(function(dataSave){
        res.status(201).json({message:'Utilisateur créé', _id:dataSave._id});
      })
      .catch(function(e){
        res.status(400).json({error:"email already used"});
      })
  })
  .catch(function(e){
    res.status(500).json({error:"error during hash"});
  })
};

exports.login = function(req,res,next){
  User.findOne({email:req.body.email})
  .then(function(user){
    if(!user)
      return res.status(401).json({error:"utilisateur undefined"});
    bcrypt.compare(req.body.password, user.password)
    .then(function(valid){
      if(!valid){
        return res.status(401).json({error:"wrong password"});
      }
      res.status(200).json({
        userid:user._id,
        token:jwt.sign(
          {userid : user._id},
          'Uw68dLOHFXqcbPi1mhUyRONBxCMMLFD2iujLGG2BfIWi4dsOvuzfUTerXybg4LEdgwQWpe4t5YYj5xwPwQWqML8JxehJpNjomzmg',
          {expiresIn : '24h'}
        )
      });
    })
    .catch(function(e){
      res.status(500).json({error:e})
    })
  })
  .catch(function(e){
    res.status(500).json({error:e});
  });
};

//CONNECTION IS CHECKED BEFORE
exports.checkAuthentification = function(req,res,next){
  res.status(200).json({message:"utilisateur authentifiee"});
}
