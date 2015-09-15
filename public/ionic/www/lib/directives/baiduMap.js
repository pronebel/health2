/**
 *  A directive which helps you easily show a baidu-map on your page.
 *
 *
 *  Usages:
 *
 *      <baidu-map options="options"></baidu-map>
 *
 *      options: The configurations for the map
 *            .width[Number]{M}:        The width of the map
 *            .height[Number]{M}:       The height of the map
 *            .center.longitude[Number]{M}: The longitude of the center point
 *            .center.latitude[Number]{M}: The latitude of the center point
 *            .zoom[Number]{O}:         Map's zoom level. This must be a number between 3 and 19
 *            .navCtrl[Boolean]{O}:     Whether to add a NavigationControl to the map
 *            .scaleCtrl[Boolean]{O}:   Whether to add a ScaleControl to the map
 *            .overviewCtrl[Boolean]{O}: Whether to add a OverviewMapControl to the map
 *            .enableScrollWheelZoom[Boolean]{O}: Whether to enableScrollWheelZoom to the map
 *            .city[String]{M}:         The city name which you want to display on the map
 *            .markers[Array]{O}:       An array of marker which will be added on the map
 *                   .longitude{M}:                The longitude of the marker
 *                   .latitude{M}:                 The latitude of the marker
 *                   .icon[String]{O}:             The icon's url for the marker
 *                   .width[Number]{O}:            The icon's width for the icon
 *                   .height[Number]{O}:           The icon's height for the icon
 *                   .title[String]{O}:            The title on the infowindow displayed once you click the marker
 *                   .content[String]{O}:          The content on the infowindow displayed once you click the marker
 *                   .enableMessage[Boolean]{O}:   Whether to enable the SMS feature for this marker window. This option only available when title/content are defined.
 *
 *
 *
 *  @author      Howard.Zuo
 *  @copyright   April 9, 2014
 *  @version     1.0.4
 *
 */
(function(angular) {
    "use strict";

    var defaults = {

        zoom: 10
    };


    /**
     * Construction function
     *
     * @constructor
     */
    var baiduMapDir = function($rootScope) {

        // Return configured, directive instance

        return {
            restrict: 'E',
            scope: {
                'options': '='
            },
            link: function($scope, element, attrs) {
                var options = $scope.options;

                var ops = {};
                ops.zoom = options.zoom || 10,
                    ops.style   = options.style;
                ops.center  =  options.center;


               element.find('div').css(ops.style);

                $scope.$parent.mapCallBack = $scope.$parent.mapCallBack || function(){ };



                if(!ops.center){
                    ops.center = {
                         longitude : 116.397428,
                         latitude : 39.90923
                    }
                }

                var map = new BMap.Map(element.find('div')[0]);

                var centerPoint = new BMap.Point(ops.center.longitude, ops.center.latitude) ;
                map.centerAndZoom(centerPoint, ops.zoom);

                map.addControl(new BMap.ZoomControl());

                $scope.$parent.mapCallBack(map);

            },
            template: '<div style="width:100%;height:100%;"></div>'
        };
    };

    var baiduMap = angular.module('baiduMap', []);
    baiduMap.directive('baiduMap', ['$rootScope',baiduMapDir]);

})(angular);
