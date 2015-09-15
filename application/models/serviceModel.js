var collection = mongodb.collection('service');
var profiles = mongodb.collection('profiles');
var _ = require('lodash');


var serviceModel = {
    listByUid:function(params,callback){
        collection.find({"wb_uid":params.wb_uid}).sort([['time','desc']]).toArray(function(err, results) {
            callback({list:results});
        });
    },

    /**
     *
     * 分页只支持上一页，下一页
     * @param params:{
     *
     *  number:每一页大小
     *  page:1 下一页，  -1 上一页
     *  date：是否获取上下页的比较属性标志位
     * }
     * @param callback
     */
    list: function(params,callback){

        var  innerCallback= function(err, results) {

            var  list = results;

            var userArr =  [];

            for(var i=0;i<list.length;i++){
                var curSerItem = list[i];
                if(userArr.indexOf(curSerItem.wb_uid)==-1){
                    userArr.push(curSerItem.wb_uid);
                }
            }

            console.log(userArr);
            profiles.find({"idstr":{"$in":userArr}}).toArray(function(err,profileList){

                _.each(list,function(item){
                    item.profile = _.findWhere(profileList, {idstr:item.wb_uid}) || {
                        profile_image_url : "xxx",
                        name:"张三"
                    };
                })
                callback({list:list});
            })

        }





        var page = params.page || 1,number = params.number || 10, date = params.date;


        if(date){
            var cond ={};
            if(page==1){
                cond = {
                    "date":{"$gt":date}
                };
            }else if(page==-1){
                cond = {
                    "date":{"$lt":date}
                };
            }

            collection.find(cond).sort({"date":-1}).limit(number).toArray(innerCallback);
        }else{
            collection.find().sort({"date":-1}).limit(number).toArray(innerCallback);
        }






    },
    insert: function(user, callback){
        user.date = Date.now();
        collection.insert(user, {safe:true}, function(err, newuser){
            if(err) console.log(err);
            
            callback(newuser[0]);
        });
    },
    remove: function(id){
        collection.remove({ _id:mongo.ObjectID(id) }, function(err) {
            if (err) return handleError(err);
        });
    }
}




module.exports = serviceModel;
