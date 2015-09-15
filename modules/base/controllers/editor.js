/**
 * Created by Satrong on 2014/7/27.
 * UEditor 上传 服务端 控制器
 */
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var uploadsPath = path.resolve('public/uploads') + '/';//存储图片的路径

var Busboy = require('busboy');


var configJson = /* 前后端通信相关的配置,注释只允许使用多行方式 */
{
    /* 上传图片配置项 */
    "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
    "imageFieldName": "upfile", /* 提交的图片表单名称 */
    "imageMaxSize": 2048000, /* 上传大小限制，单位B */
    "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
    "imageCompressEnable": true, /* 是否压缩图片,默认是true */
    "imageCompressBorder": 1600, /* 图片压缩最长边限制 */
    "imageInsertAlign": "none", /* 插入的图片浮动方式 */
    "imageUrlPrefix": "", /* 图片访问路径前缀 */
    "imagePathFormat": "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    /* {filename} 会替换成原文件名,配置这项需要注意中文乱码问题 */
    /* {rand:6} 会替换成随机数,后面的数字是随机数的位数 */
    /* {time} 会替换成时间戳 */
    /* {yyyy} 会替换成四位年份 */
    /* {yy} 会替换成两位年份 */
    /* {mm} 会替换成两位月份 */
    /* {dd} 会替换成两位日期 */
    /* {hh} 会替换成两位小时 */
    /* {ii} 会替换成两位分钟 */
    /* {ss} 会替换成两位秒 */
    /* 非法字符 \ : * ? " < > | */
    /* 具请体看线上文档: fex.baidu.com/ueditor/#use-format_upload_filename */

    /* 涂鸦图片上传配置项 */
    "scrawlActionName": "uploadscrawl", /* 执行上传涂鸦的action名称 */
    "scrawlFieldName": "upfile", /* 提交的图片表单名称 */
    "scrawlPathFormat": "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "scrawlMaxSize": 2048000, /* 上传大小限制，单位B */
    "scrawlUrlPrefix": "", /* 图片访问路径前缀 */
    "scrawlInsertAlign": "none",

    /* 截图工具上传 */
    "snapscreenActionName": "uploadimage", /* 执行上传截图的action名称 */
    "snapscreenPathFormat": "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "snapscreenUrlPrefix": "", /* 图片访问路径前缀 */
    "snapscreenInsertAlign": "none", /* 插入的图片浮动方式 */

    /* 抓取远程图片配置 */
    "catcherLocalDomain": ["127.0.0.1", "localhost", "img.baidu.com"],
    "catcherActionName": "catchimage", /* 执行抓取远程图片的action名称 */
    "catcherFieldName": "source", /* 提交的图片列表表单名称 */
    "catcherPathFormat": "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "catcherUrlPrefix": "http://127.0.0.1:8008", /* 图片访问路径前缀 */
    "catcherMaxSize": 2048000, /* 上传大小限制，单位B */
    "catcherAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 抓取图片格式显示 */

    /* 上传视频配置 */
    "videoActionName": "uploadvideo", /* 执行上传视频的action名称 */
    "videoFieldName": "upfile", /* 提交的视频表单名称 */
    "videoPathFormat": "/ueditor/php/upload/video/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "videoUrlPrefix": "", /* 视频访问路径前缀 */
    "videoMaxSize": 102400000, /* 上传大小限制，单位B，默认100MB */
    "videoAllowFiles": [
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid"], /* 上传视频格式显示 */

    /* 上传文件配置 */
    "fileActionName": "uploadfile", /* controller里,执行上传视频的action名称 */
    "fileFieldName": "upfile", /* 提交的文件表单名称 */
    "filePathFormat": "/ueditor/php/upload/file/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "fileUrlPrefix": "", /* 文件访问路径前缀 */
    "fileMaxSize": 51200000, /* 上传大小限制，单位B，默认50MB */
    "fileAllowFiles": [
        ".png", ".jpg", ".jpeg", ".gif", ".bmp",
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
        ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
    ], /* 上传文件格式显示 */

    /* 列出指定目录下的图片 */
    "imageManagerActionName": "listimage", /* 执行图片管理的action名称 */
    "imageManagerListPath": "/ueditor/php/upload/image/", /* 指定要列出图片的目录 */
    "imageManagerListSize": 20, /* 每次列出文件数量 */
    "imageManagerUrlPrefix": "", /* 图片访问路径前缀 */
    "imageManagerInsertAlign": "none", /* 插入的图片浮动方式 */
    "imageManagerAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 列出的文件类型 */

    /* 列出指定目录下的文件 */
    "fileManagerActionName": "listfile", /* 执行文件管理的action名称 */
    "fileManagerListPath": "/ueditor/php/upload/file/", /* 指定要列出文件的目录 */
    "fileManagerUrlPrefix": "", /* 文件访问路径前缀 */
    "fileManagerListSize": 20, /* 每次列出文件数量 */
    "fileManagerAllowFiles": [
        ".png", ".jpg", ".jpeg", ".gif", ".bmp",
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
        ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
    ] /* 列出的文件类型 */

};


var httpUrl = "http://127.0.0.1:8008";

//http://www.xiaoboy.com/detail/1341545081.html
var action = {
    /// 上传图片
    uploadimage: function (req, res) {

        var busboy = new Busboy({ headers: req.headers });
        var fstream;
        req.pipe(busboy);
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var filesize = 0;
            var ext = path.extname(filename);
            var newFilename = (new Date() - 0) + ext;
            fstream = fs.createWriteStream(uploadsPath + newFilename);
            file.on('data', function (data) {
                filesize = data.length;
            });
            fstream.on('close', function () {
                res.send(JSON.stringify({
                    "originalName": filename,
                    "name": newFilename,
                    "url": '/uploads/' + newFilename,
                    "type": ext,
                    "size": filesize,
                    "state": "SUCCESS"
                }));
            });
            file.pipe(fstream);
        });
    },
    /// 获取配置文件

    config: function (req, res) {

        res.setHeader('Content-Type', 'application/json');
        res.json(configJson);
    },
    /// 在线管理
    listimage: function (req, res) {
        fs.readdir(uploadsPath, function (err, files) {
            var total = 0, list = [];
            files.sort().splice(req.query.start, req.query.size).forEach(function (a, b) {
                /^.+.\..+$/.test(a) &&
                list.push({
                    url: '/uploads/' + a,
                    mtime: new Date(fs.statSync(uploadsPath + a).mtime).getTime()
                });
            });
            total = list.length;
            res.json({state: total === 0 ? 'no match file' : 'SUCCESS', list: list, total: total, start: req.query.start});
        });
    },
    /// 抓取图片（粘贴时将图片保存到服务端）
    catchimage: function (req, res) {
        var list = [];

        console.log(req.body);
        var source = req.body['source[]'];

        if(typeof source=="string"){
            source =[source];
        }


        console.log(source);
        source.forEach(function (src, index) {
            http.get(src, function (_res) {
                var imagedata = '';
                _res.setEncoding('binary');
                _res.on('data', function (chunk) {
                    imagedata += chunk
                });
                _res.on('end', function () {
                    var pathname = url.parse(src).pathname;

                    var imgInfo =  pathname.match(/[^/]+\.\w+$/g);
                    var original = "",suffix="jpg";
                    if(imgInfo){
                         original =imgInfo[0];
                        suffix = original.match(/[^\.]+$/)[0];
                    }

                    var filename = Date.now() + '.' + suffix;
                    var filepath = uploadsPath + 'catchimages/' + filename;
                    fs.writeFile(filepath, imagedata, 'binary', function (err) {
                        list.push({
                            original: original,
                            source: src,
                            state: err ? "ERROR" : "SUCCESS",
                            title: filename,
                            url: '/uploads/catchimages/' + filename
                        });
                    })
                });
            })
        });
        var f = setInterval(function () {
            if (source.length === list.length) {
                clearInterval(f);
                res.json({state: "SUCCESS", list: list});
            }
        }, 50);

    }
};


module.exports = {
    index:function (req, res) {
        var straction = req.param("action");

        action[straction](req, res);
    }
};