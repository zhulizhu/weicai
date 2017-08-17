/**
 * Created by frank on 2016/11/21.
 */
(function () {
    'use strict';

    angular
        .module('tab.controller', [])
        .controller('TabCtrl', TabCtrl);

    TabCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicViewSwitcher','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ocLazyLoad','$sce'];
    /* @ngInject */
    function TabCtrl($scope,$yikeUtils,$state,$ionicViewSwitcher,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ocLazyLoad,$sce){
        var token=localStorageService.get('token');
        $scope.isLogin=isLogin;
        $scope.isMsg=false;
        init();
        function init() {
        }
        //判断是否登录
        function isLogin(status) {
            clearInterval(djsTime.indexTime);
            if(token){
                window.location.href='#/tab/'+status;
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '请先登录',
                    buttons:[{
                        text:'确定',
                        type: 'button-positive'
                    }]
                });
                alertPopup.then(function() {
                    $state.go('login');
                });
            }
        }

    }
})();
