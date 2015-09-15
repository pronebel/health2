
var usrController = {
    add:function(req, res) {
        try {
            if (!req.query.hasOwnProperty('imei')) {
                throw new Error("Lack of Parameter IMEI");
            }
            if (!req.query.hasOwnProperty('varify')) {
                throw new Error("Lack of Parameter Varification Code");
            }
            //check param
            var data = req.body;
            data.imei = req.query.imei;
            data.varify = req.query.varify;

            var mobileModel = new system.getModel('mobile')();
            mobileModel.varify(data.imei,data.varify).then(function(fullfill){

                var user = new system.getModel('user')();
                user.add(data).then(
                    function(fullfill){
                        var success= new global.successModel(["done"],req);
                        res.json(success.getObj());
                    },
                    function(reject) {
                        var fail = new global.failModel(new Error(reject),req);
                        res.json(fail.getObj());
                    }
                );

            }, function(reject){
                var fail = new global.failModel(new Error("Not A Valid Varification Code", req));
                res.json(fail.getObj());
            });


        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    },
    remove: function(req,res) {
        try {
            if (!req.query.hasOwnProperty('imei')) {
                throw new Error("Lack of Param IMEI");
            }
            var user = new system.getModel('user')();
            var imei = req.query.imei.toString();
            user.remove({'imei':imei}).then(function(fullfill){
                var success= new global.successModel(["done"],req);
                res.json(success.getObj());
            }, function(reject){
                var fail = new global.failModel(new Error(reject),req);
                res.json(fail.getObj());
            });
        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    },
    exists: function(req, res) {
        try {
            if (!req.query.hasOwnProperty('imei')) {
                throw new Error("Lack of Param IMEI");
            }
            var user = new system.getModel('user')();
            user.checkExists(req.query.imei).then(function(doc){

                var success = new global.successModel(doc, req);
                res.json(success.getObj());
            });

        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    },
    getVarificationCode: function(req,res) {
        try {
            if (!req.query.hasOwnProperty('mobile')) {
                throw new Error ("Lack of Param mobile");
            }
            if (!req.query.hasOwnProperty('imei')) {
                throw new Error ("Lack of Param imei");
            }
            var mobile = new system.getModel('mobile')();
            mobile.getVarificationCode(req.query.imei,req.query.mobile);
            var success= new global.successModel(["done"],req);
            res.json(success.getObj());
        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    },
    setGoal: function(req,res) {
        try {
            if (!req.query.hasOwnProperty('imei')) {
                throw new Error("Lack of Param IMEI");
            }
            if (!req.body.hasOwnProperty('goal')) {
                throw new Error("Lack of Param goal, in sep of comma");
            }
            var goal = req.body.goal.split(",");
            var user = new system.getModel('user')();

            user.setGoal({imei:req.query.imei}, goal).then(function(){
                var success= new global.successModel(["done"],req);
                res.json(success.getObj());
            }, function(err){
                var fail = new global.failModel(new Error(err),req);
                res.json(fail.getObj());
            });
        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    }
};


module.exports = usrController;