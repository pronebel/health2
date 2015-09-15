"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(__dirname + '/../application/config/mysql.js')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);


global.mysqldb = sequelize;
global.Sequelize = Sequelize;


module.exports = mysqldb;



/*
*
* 不用 sequelize.import 导入 model，直接使用sleek的getModel引入函数
* 对比：sleek的getModel方式没有缓存对象，需要分析缓存对象的利弊
* 原有的mongodb的引用也没有缓存对象
*
*
* 需要固话mysql，mongodb的配置设置
*
* */