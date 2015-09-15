var iweibo = system.getLibrary('weibo/index');
iweibo.set({
    appkey: '1539652173',
    appsecret: 'a4b2b1feaf3784900c7938e68edc534f'
});


var weibo = new iweibo.Weibo();


var weiboController = {
    cmd:function(req, res){

        var cmd = req.param("cmd");
        var json = req.param("json");

        var __params = JSON.parse(decodeURIComponent(json));

        console.log(__params);
        weibo.api(cmd, __params).done(function(err, result) {
            var result = JSON.parse(result);
            res.json(result);
        });
    },
    test:function(req,res){
        var data = {
            title: "微博API测试"
        }
        //load index.html from home directory
        system.loadPluginView(res,'weiboapi', data,"base");
    }

}

module.exports = weiboController;