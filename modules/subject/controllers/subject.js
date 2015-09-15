
//index function
var indexController = {
    list:function(req, res){
        var data = {
            title: "专题列表"
        }
        system.loadPluginView(res,'subject/list', data,'subject');
    },
    edit:function(req,res){
        var data = {
            title: "Sleek.js"
        }





        system.loadPluginView(res,'subject/form', data,'subject');
    }
}

module.exports = indexController;