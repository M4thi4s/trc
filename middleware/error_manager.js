module.exports = function(err,req,res,next){
    console.log("<> error : ");
    console.log(err.stack);
    console.log(err);

    if(!err.statusCode)
        err.statusCode=500;

    if(!err.message)
        err.message="something went wrong ! if this message persists, please contact me at : tradingrobotcreator@gmail.com";
    
    res.status(err.statusCode).json({error:err.message});
}