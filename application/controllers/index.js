
/*
 *
 */

//index function
var indexController = {
    index:function(req, res){
        var data = {
            title: "Sleek.js"
        }
        //load index.html from home directory
        system.loadView(res,'index', data);
    },
	login:function(req, res){
        var data = {
            layout:"single",
            title: "Sleek.js"
        }
        //load index.html from home directory
        system.loadView(res,'login', data);
    },
    socket:function(req,res){
        var data = {
            title: "Sleek.js"
        }
        //load index.html from home directory
        system.loadView(res,'socket', data);
    }
}

module.exports = indexController;