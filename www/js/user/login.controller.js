/**
 * Created by frank on 2016/11/12.
 */
(function () {

  'use strict';


  angular
    .module('login.controller', [])
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$rootScope', 'localStorageService', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$sce'];
  /* @ngInject */
  function LoginCtrl($scope, $yikeUtils, $state, $ionicHistory, $rootScope, localStorageService, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $sce) {
    var myreg = /^[0-9]*$/,
      myreg1 = /^[0-9a-zA-Z]*$/;
    $scope.formValue = {
      userName: '',
      pwd: ''
    };
    //调用登陆方法
    $scope.goBack = goBack;
    $scope.login = login;
    $scope.wtchetLogin = wtchetLogin;
    $scope.$on('$ionicView.afterEnter',function () {
        localStorageService.remove('token');
        localStorageService.remove('uid');
        localStorageService.remove('pc_ggshow');
        clearInterval(djsTime.ctime);
        clearInterval(djsTime.indexTime);
    });
    init();
    function init() {
        var user=localStorageService.get('pc_user');
        if(user){
            $scope.formValue.userName=user.username;
            $scope.formValue.pwd=user.password;
        }
    }

    function goBack() {
      $ionicHistory.goBack();
    }

    //登陆
    function login() {
        $scope.formValue.userName=$scope.formValue.userName.replace(/\s+/g,"");
      if ($scope.formValue.userName == '' || $scope.formValue.userName == null) {

        $yikeUtils.toast('请输入登陆账号');

      } else if (!myreg1.test($scope.formValue.userName)) {

        $yikeUtils.toast('请输入有效登陆账号');

      } else if ($scope.formValue.pwd == '' || $scope.formValue.pwd == null) {

        $yikeUtils.toast('请先输入密码');

      } else if ($scope.formValue.pwd.length < 6) {

        $yikeUtils.toast('密码至少为6位数');

      } else {
          loadingShow('加载中...');
          var options ={
              user_name:$scope.formValue.userName,
              password:$scope.formValue.pwd
          };
        yikePcdd.login(options)
          .then(function (data) {
            $yikeUtils.toast('登录成功');
            try {
                $rootScope.checkWs.send(JSON.stringify({type:'check',uid:data.info.uid,token:data.info.token}));
            }catch (err){}
            localStorageService.set('token', data.info.token);
            localStorageService.set('uid', data.info.uid);
            localStorageService.set('pc_user', {username:$scope.formValue.userName,password:$scope.formValue.pwd});
            localStorageService.set('pc_ggshow', 1);
            $state.go('tab.home');
          })
      }
    }
    /*授权登录*/
    function wtchetLogin(){
     //判断安装微信
     Wechat.isInstalled(function (installed) {
       if(installed){
         //微信登录
         var scope = "snsapi_userinfo",
             state = "_" + (+new Date());
         Wechat.auth(scope,state, function (response) {
           yikePcdd.wx_login(response.code)
               .then(function (data) {
                 $yikeUtils.toast(data.result.result);
                 localStorageService.set('token', data.result.token);
                 $state.go('tab.home');
               });
         }, function (reason) {
           // console.log("Failed: " + reason);
         });
       }else{
         $yikeUtils.toast('请先安装微信');
       }
     }, function (reason) {
       // alert("Failed: " + reason);
     });

    }
  }
})();
