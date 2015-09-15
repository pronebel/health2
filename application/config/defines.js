/* 
 * Defines.
 * Add defines here
 * 
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

global.DEFINES = {


};


global.failModel = function(e,req) {
    return {
        message: "Default Error",
        getObj: function () {
            return {
                error_id: e.id,
                status: 0,
                message: e.message,
                url: req.url
            };
        }
    };
};


global.successModel = function(data, req) {
    return {
        getObj: function () {
            return {
                status: 1,
                data: data,
                url: req.url
            };
        }
    };
};

global.validateFloat = function(str) {
    var reg= new RegExp("^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
    return reg.test(str);
}