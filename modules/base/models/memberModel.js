
var members = mongodb.collection('members');
var profiles = mongodb.collection('profiles');
/**
 *
 *
 * code:
 *  逻辑：-1:当前用户存在，
 *  系统：0：系统级错误
 * @type {{signup: Function}}
 */


//write function here
var memberModel = {


    login:function(authData,callback){

        members.findOne({
            email:authData.email,
            pwd:authData.pwd
        },function(err,result){

            if(result){

                callback({
                    code:1,
                    data:result
                })


            }else{
               callback({
                   error:"您的账户或者密码错误",
                   code:-1
               })
            }

        })

    },

    signup:function(authData,callback){

       members.find({
            email:authData.email
        }).toArray(function(err,result){


            if(result.length>0){
                callback({
                    error:"当前用户已经存在",
                    code:-1
                })
            }else{
                //
                authData.date = Date.now();
                members.insert(authData, {safe:true}, function(err, newuser){
                    if(err){
                        console.log(err);
                        callback({
                            error:"数据库操作错误",
                            code:0
                        })
                    } else{
                        callback({
                            code:1,
                            data:newuser[0]
                        });
                    }
                });
            }

        });
    },


    profile:function(params,callback){
        profiles.findOne({
            "idstr":params.uid
        },function(err,result){

           // console.log(result);
            if(result){
                callback(result)
            }else{
                callback({})
            }

        })
    },

    list: function(callback){

        // Locate all the entries using find
        collection.find().toArray(function(err, results) {
            callback(results);
        });
    },

    insertWeiboProfile:function(prifileData,callback){
        prifileData.date = Date.now();
        profiles.update({"id":prifileData.id},prifileData,{upsert:true},function(err,number){
            if(err){
                console.log(err);
            }else{
                callback(number);
            }
        });
    },
    updateNickName:function(data,callback){
        members.update({"email":data.email},{"$set":{
            "wb_name":data.name
        }},function(err){
            if(err){
                console.log(err);
            }

        });
    },
    insertWeiboAuth:function(reqData,callback){

        var authData = reqData.auth;
        var email = reqData.email;

        authData.date = Date.now();
        members.update({"email":email},{"$set":{
            "authWeibo":authData
        }},function(err){

            if(err){
                console.log(err);
            }else{
                callback(authData);
            }


        });

    },
    /**
     * 插入用户信息 和 授权
     * @param reqData
     * @param callback
     */
    insertWeiboUserProfile:function(reqData,callback){

        var email = reqData.email;
        var profile = reqData.wb_profile, authData= reqData.wb_auth;

        authData.date = Date.now();

        members.update({
            "email":email
        },{
            "$set":{
                "wb_auth":authData,
                "wb_uid":profile.id,
                "wb_name":profile.name

            }
        },function(err,number){

            if(err){
                console.log(err);
            }else{
                callback(number);
            }


        });


        memberModel.insertWeiboProfile(profile,function(){});

    }





}

module.exports = memberModel;