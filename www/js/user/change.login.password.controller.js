/**
 * Created by frank on 2016/11/22.
 */
(function () {
    'use strict';

    angular
        .module('change.login.password.controller', [])
        .controller('ChangeLoginCtrl', ChangeLoginCtrl);

    ChangeLoginCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function ChangeLoginCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.user={
            oldPassword:'',
            newPassword:'',
            confirmPassword:''
        };
        $scope.modificationLoginPassword=modificationLoginPassword;
        init();
        function init() {}
        // 修改登录密码
        function modificationLoginPassword() {
            if($scope.user.oldPassword == '' || $scope.user.oldPassword == null){
                $yikeUtils.toast('请先输入旧登陆密码');
                return false;
            }else if ($scope.user.newPassword == '' || $scope.user.newPassword == null) {
                $yikeUtils.toast('请先输入新登陆密码');
            }else if ($scope.user.newPassword.length < 6 || $scope.user.newPassword.length > 12) {
                $yikeUtils.toast('登陆密码位数(6~12)');
            } else if ($scope.user.confirmPassword != $scope.user.newPassword) {
                $yikeUtils.toast('两次密码不一致');
            }else {
                loadingShow('加载中...');
                var options={
                    token:token,
                    oldpassword:$scope.user.oldPassword,
                    newpassword:$scope.user.newPassword
                };
                yikePcdd.changeLoginPwd(options)
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $ionicHistory.goBack();
                    })
            }
        }
    }
})();
