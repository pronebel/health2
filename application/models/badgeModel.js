/**
 * Created by rollandlee on 5/4/15.
 */
var badgeCollection = mongodb.collection('bagde');
var badgeLogCollection = mongodb.collection('badge_log');

var badgeModel = function(uid) {
    return {
        listBadgeLog: function() {

        },
        listAvailableBadge: function() {

        },
        scanBadge: function() {

        }
    };
}

module.exports = badgeModel;