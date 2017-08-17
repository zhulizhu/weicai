/**
 * Created by frank on 2016/11/23.
 */
(function () {
    'use strict';

    angular
        .module('advanced.setup.controller', [])
        .controller('AdvancedSetupCtrl', AdvancedSetupCtrl);
    AdvancedSetupCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$rootScope','$sce'];
    /* @ngInject */
    function AdvancedSetupCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$rootScope,$sce){
        var token=localStorageService.get('token');
        $scope.betBack=betBack;
        $scope.betBackType={
            type:['聊天室','投注页'],
            value:$rootScope.betType
        };
        init();
        function init() {
        }
         //投注后显示
         function betBack() {
             $rootScope.betType=$scope.betBackType.value;
             localStorageService.set('bet_back',$scope.betBackType.value);
             $yikeUtils.toast('修改成功');
        }
    }
})();
