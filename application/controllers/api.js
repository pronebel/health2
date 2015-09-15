
module.exports = {
    cmd:function(req, res){

        var cmd = req.param("cmd");
        var json = req.param("json");

        var cmdArr = cmd.split("_");
        console.log(cmd);

        var __mod ;
        if(cmdArr[0]=="member"){
            __mod = system.getPluginModel(cmdArr[0],'base');
        }else{
            __mod = system.getModel(cmdArr[0]);
        }


        var __params = JSON.parse(decodeURIComponent(json));
        console.log(__mod);

        console.log(__params);





        __mod[cmdArr[1]](__params, function(retJSON){
            res.json(retJSON);
        });

    }
};