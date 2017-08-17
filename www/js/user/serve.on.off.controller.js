/**
 * Created by frank on 2016/11/23.
 */
(function () {
    'use strict';

    angular
        .module('serve.on.off.controller', [])
        .controller('ServeOnOffCtrl', ServeOnOffCtrl);
    ServeOnOffCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$rootScope','$sce'];
    /* @ngInject */
    function ServeOnOffCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$rootScope,$sce){
        var token=localStorageService.get('token');
        $scope.serveOnOff=serveOnOff;
        $scope.serveTypes={
            checked:$rootScope.is_serve_show
        };
        init();
        function init() {
        }
         function serveOnOff() {
             $rootScope.is_serve_show=$scope.serveTypes.checked;
             localStorageService.set('serve_show',$scope.serveTypes.checked);
        };
    }
})();
