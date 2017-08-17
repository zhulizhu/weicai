/**
 * Created by frank on 2016/11/12.
 */
(function () {
  'use strict';

  angular
    .module('register.controller', [])
    .controller('RegisterCtrl', RegisterCtrl);

  RegisterCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', 'localStorageService', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$sce'];
  /* @ngInject */
  function RegisterCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, localStorageService, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $sce) {
    /*正则验证*/
    $scope.goBack = goBack;
    $scope.register = register;

    /*绑定注册数据*/
    $scope.formValue = {
      userName: '',
      passWord: '',
      confirmPassWord: '',
      introduceId: '',
      checked: true
    };

    $scope.goBack = goBack;
    $scope.register = register;
    init();
    function init() {
    }

    function goBack() {
      $ionicHistory.goBack();
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
        }else if ($scope.formValue.confirmPassWord != $scope.formValue.passWord) {
          $yikeUtils.toast('两次密码输入不一致，请重新输入');
        }else if (!$scope.formValue.checked) {
          $yikeUtils.toast('请阅读并同意协议');
        } else {
            loadingShow('加载中...');
          var options ={
            user_name:$scope.formValue.userName,
            password:$scope.formValue.passWord,
            agent_num:$scope.formValue.introduceId
          };
        yikePcdd.register(options)
          .then(function (data) {
            $yikeUtils.toast(data.msg);
            $state.go('login');
            $scope.$digest();
          });
      }
    }
  }
})();
