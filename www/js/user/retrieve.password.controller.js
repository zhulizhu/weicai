/**
 * Created by frank on 2016/12/16.
 */
(function () {
    'use strict';

    angular
        .module('retrieve.password.controller', [])
        .controller('RetrievePasswordCtrl', RetrievePasswordCtrl);

    RetrievePasswordCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','$ionicLoading'];
    /* @ngInject */
    function RetrievePasswordCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,$ionicLoading){
        $scope.user={
            username:'',
            txPassword:'',
            password:'',
            confirmPassWord:''
        };
        $scope.reset=reset;
        init();

        function init() {
        }
        //表单验证
        function formValidation() {
            var reg =  /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,12}$/;
            var myreg = /^[0-9a-zA-Z]{6,12}$/;
            if($scope.user.username == '' || $scope.user.username == null){
                $yikeUtils.toast('请先输入用户名');
            }else if(!reg.test($scope.user.username)){
                $yikeUtils.toast('账号由6~12位字母、数字组成');
            }else if($scope.user.txPassword == '' || $scope.user.txPassword == null){
                $yikeUtils.toast('请先输入提现密码');
            }else if($scope.user.password == '' || $scope.user.password==null){
                $yikeUtils.toast('请先输入新登陆密码');
                return false;
            }else if (!myreg.test($scope.user.password)) {
                $yikeUtils.toast('密码由6~12位字符或数字组成');
                return false;
            }else if ($scope.user.confirmPassWord != $scope.user.password) {
                $yikeUtils.toast('两次密码输入不一致，请重新输入');
                return false;
            }else{
                return true;
            }
        }
        //重置密码
        function reset() {
            var suc=formValidation();
            if(suc){
                loadingShow('加载中...');
                var options={
                    username:$scope.user.username,
                    password:$scope.user.password,
                    re_password:$scope.user.confirmPassWord,
                    coinPassword:$scope.user.txPassword
                };
                yikePcdd.resetPassword(options)
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $state.go('login');
                        $scope.$digest();
                    })
            }
        }
    }
})();
