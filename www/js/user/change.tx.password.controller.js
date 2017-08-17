/**
 * Created by frank on 2016/11/22.
 */
(function () {
    'use strict';

    angular
        .module('change.tx.password.controller', [])
        .controller('ChangeTxPasswordCtrl', ChangeTxPasswordCtrl);

    ChangeTxPasswordCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function ChangeTxPasswordCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.user={
            newPassword:'',
            confirmPassword:'',
            oldPassword:''
        };
        $scope.modificationWithdrawDepositPassword=modificationWithdrawDepositPassword;
        init();
        function init() {}
        // 修改提现密码
        function modificationWithdrawDepositPassword() {
            if($scope.user.oldPassword == '' || $scope.user.oldPassword == null){
                $yikeUtils.toast('请先输入旧提现密码');
            }else if ($scope.user.newPassword == '' || $scope.user.newPassword == null) {
                $yikeUtils.toast('请先输入新提现密码');
            }else if(!$scope.user.newPassword.replace(/[^\d]/g,'')){
                $yikeUtils.toast('密码只能为数字');
            }else if ($scope.user.newPassword.length < 6) {
                $yikeUtils.toast('提现密码位数(6位)');
            } else if ($scope.user.confirmPassword != $scope.user.newPassword) {
                $yikeUtils.toast('两次密码不一致');
            }else {
                loadingShow('加载中...');
                yikePcdd.changeWithdrawPwd(
                    {
                        token:token,
                        oldpassword:$scope.user.oldPassword,
                        newpassword:$scope.user.newPassword,
                        newpassword2:$scope.user.confirmPassword
                    })
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $ionicHistory.goBack();
                        $scope.$digest();
                    })
            }
        }
    }
})();
