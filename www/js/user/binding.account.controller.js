/**
 * Created by frank on 2016/11/22.
 */
(function () {
    'use strict';

    angular
        .module('binding.account.controller', [])
        .controller('bindingAccountCtrl', bindingAccountCtrl);

    bindingAccountCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function bindingAccountCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.register=register;
        $scope.formValue = {
            userName: '',
            passWord: ''
        };
        init();
        function init() {
        }
        //注册
        function register() {
            var reg =  /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,12}$/;
            var myreg = /^[0-9a-zA-Z]{6,12}$/;
            $scope.formValue.userName=$scope.formValue.userName.replace(/\s+/g,"");
            if (!reg.test($scope.formValue.userName)) {
                $yikeUtils.toast('账号由6~12位字母、数字组成');
            } else if (!myreg.test($scope.formValue.passWord)) {
                $yikeUtils.toast('密码由6~12位字符或数字组成');
            }else {
                loadingShow('加载中...');
                var options ={
                    username:$scope.formValue.userName,
                    password:$scope.formValue.passWord,
                    token:token
                };
                yikePcdd.wechatAccountBind(options)
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $state.go('tab.account');
                        $scope.$digest();
                    });
            }
        }


    }
})();
