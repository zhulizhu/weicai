/**
 * Created by frank on 2016/11/22.
 */
(function () {
    'use strict';

    angular
        .module('withdraw.deposit.password.controller', [])
        .controller('WithdrawDepositPasswordCtrl', WithdrawDepositPasswordCtrl);

    WithdrawDepositPasswordCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function WithdrawDepositPasswordCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.user={
            password:'',
            confirmPassword:''
        };
        $scope.addWithdrawDepositPassword=addWithdrawDepositPassword;
        init();
        function init() {}
        // 添加提现密码
        function addWithdrawDepositPassword() {
            if ($scope.user.password == '') {
                $yikeUtils.toast('请先输入提现密码');
            }else if(!$scope.user.password.replace(/[^\d]/g,'')){
                $yikeUtils.toast('密码只能为数字');
            }else if ($scope.user.password.length < 6) {
                $yikeUtils.toast('提现密码位数(6位)');
            }else if ($scope.user.confirmPassword != $scope.user.password) {
                $yikeUtils.toast('两次密码不一致');
            }else {
                loadingShow('加载中...');
                var options={
                    token:token,
                    newPassword:$scope.user.password,
                    repeatPassword:$scope.user.confirmPassword
                };
                yikePcdd.addWithdrawPwd(options)
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $ionicHistory.goBack();
                        $scope.$digest();
                    })
            }
        }
    }
})();
