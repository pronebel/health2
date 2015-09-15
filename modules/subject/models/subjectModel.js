var subjectCol = mongodb.collection('subject');

var _ = require('lodash');


var serviceModel = {

    detail:function(params,callback){
        subjectCol.findOne({
             _id:mongo.ObjectID(params.id)
        },function(err, results) {
            callback({detail:results});
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

            callback({list:results});

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

            subjectCol.find(cond).sort({"date":-1}).limit(number).toArray(innerCallback);
        }else{
            subjectCol.find().sort({"date":-1}).limit(number).toArray(innerCallback);
        }






    },
    insert: function(data, callback){
        data.date = Date.now();
        subjectCol.insert(data, {safe:true}, function(err, newuser){
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
