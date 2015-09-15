/* 
 * Routing functions
 * Add your routes functions here 
 */

//define route functions here
var routeHelper = {
    helper: function(req,res,next){
        //don't forget to use next(), if the helper is used as a middleware
        console.log ('I am a middleware function');
        next();
    },
    preauth:function(req,res,next){
        console.log("pre authing....");
        //res.send(403)
        next();
    },
    cors:function(req,res,next){

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    },
    ueditor:function(req,res,next){

        var staticUrl = path.join(__dirname, 'public');
        console.log(staticUrl);

        ueditor(staticUrl)

        next();
    }
};

module.exports = routeHelper;