/**
 * Created by frank on 2016/11/22.
 */
(function () {
    'use strict';

    angular
        .module('set.controller', [])
        .controller('SetCtrl', SetCtrl);

    SetCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function SetCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.isTx=isTx;
        $scope.logout=logout;
        init();
        function init() {
        }
        //判断是否已添加提现密码
        function isTx() {
            loadingShow('加载中...');
            var options={
                token:token
            };
            yikePcdd.isCoinPwd(options)
                .then(function () {
                    $state.go('change-tx-password');
                    $scope.$digest();
                },function () {
                    $state.go('withdraw-deposit-password');
                })
        }
        //退出登录
        function logout() {
            var comfirmPopup = $ionicPopup.confirm({
                title: '退出登录',
                template: '确认要退出登录？',
                okText: '确定',
                cancelText: '取消',
                cssClass:'confirm-style'
            });
            comfirmPopup.then(function (res) {
                if (res) {
                    loadingShow('加载中...');
                    var options ={
                        token:token
                    };
                    yikePcdd.logout(options)
                        .then(function (data) {
                            $yikeUtils.toast(data.msg);
                            localStorageService.remove('token');
                            $state.go('login');
                            $scope.$digest();
                        })
                }
            });
        }
    }
})();
