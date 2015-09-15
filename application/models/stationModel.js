"use strict";

module.exports = mysqldb.define("Station", {
    id: {
        type: mysqldb.INTEGER, autoIncrement: true, primaryKey: true, unique: true
    },
    station: mysqldb.STRING,
    code: mysqldb.STRING,
    pinyin: mysqldb.STRING,
    alias: mysqldb.STRING
}, {
    timestamps: false
});


