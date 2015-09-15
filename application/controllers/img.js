var sharp = require('sharp');
var fs = require('fs');
var avatarPath = __dirname+"/../var/avatar/";
var avatarHeight = 200;
var avatarWidth = 200;
var imgController = {
    saveAvatar: function (req, res) {
        var genUuid = function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        };

        try {
            if (!req.files.hasOwnProperty('avatar')) {
                throw new Error("Avatar not Exists");
            }
            var tmpFilePath = req.files.avatar.path;
            var uuid = genUuid();
            sharp(tmpFilePath).resize(avatarHeight,avatarWidth).toFile(avatarPath+uuid+".jpg", function(err){
                if (err) {
                    throw new Error("Saving Error: "+err);
                }
                //drop the temp file
                fs.unlink(tmpFilePath);
                var success= new global.successModel({uuid:uuid},req);
                res.json(success.getObj());
            });


        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    },
    getAvatar: function(req,res) {
        try {
            if (!req.query.hasOwnProperty('uuid')) {
                throw new Error("Lack of Param uuid");
            }
            var uuid = req.query.uuid;
            if (!fs.existsSync(avatarPath+uuid+".jpg")) {
                throw new Error("Avatar Not Found");
            }
            res.writeHead(200, {"Content-Type": "image/jpg"});
            res.write(fs.readFileSync(avatarPath+uuid+".jpg"));
            res.end();

        } catch (e) {
            var fail = new global.failModel(e,req);
            res.json(fail.getObj());
        }
    }
};

module.exports = imgController;