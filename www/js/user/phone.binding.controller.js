/**
 * Created by frank on 2016/11/17.
 */
(function () {
    'use strict';

    angular
        .module('phone.binding.controller', [])
        .controller('PhoneBindingCtrl', PhoneBindingCtrl);

    PhoneBindingCtrl.$inject = ['$scope','$yikeUtils','$state','localStorageService','$ionicHistory','$ionicTabsDelegate','$ionicLoading'];
    /* @ngInject */
    function PhoneBindingCtrl($scope,$yikeUtils,$state,localStorageService ,$ionicHistory,$ionicTabsDelegate,$ionicLoading){
        var token=localStorageService.get('token');
        $scope.user={
            old_phone:'',
            phone:'',
            code:'',
            msg:''
        };
        $scope.bindPhone=bindPhone;
        $scope.sendMsg=sendMsg;
        init();
        function init() {}
        //表单验证
        function formValidation() {
            if($scope.user.old_phone == '' || $scope.user.old_phone == null){
                $yikeUtils.toast('请先输入原手机号');
                return false;
            }else if($scope.user.phone == '' || $scope.user.phone == null){
            $yikeUtils.toast('请先输入新手机号');
                return false;
           }else if($scope.user.code == '' || $scope.user.code == null) {
                $yikeUtils.toast('请先输入验证码');
                return false;
            }else if($scope.user.phone != $scope.user.msg.phone){
                $yikeUtils.toast('请输入正确的手机号');
                return false;
            }else if($scope.user.code != $scope.user.msg.code){
                $yikeUtils.toast('请输入正确的验证码');
                return false;
            }else{
                return true;
            }
        }
        //发送短信验证码
        function sendMsg() {
            if($scope.user.old_phone == '' || $scope.user.old_phone == null){
                $yikeUtils.toast('请先输入手机号');
                return false;
            }else if($scope.user.phone == '' || $scope.user.phone == null){
              $yikeUtils.toast('请先输入新手机号');
              return false;
            }
            loadingShow('加载中...');
            yikePcdd.sendmsg('',$scope.user.old_phone)
                .then(function (data) {
                    $yikeUtils.toast(data.result.result);
                    $scope.user.msg=data.result.msg;
                    var sendMsg=document.body.querySelector('#send-msg');
                    settime(sendMsg);
                    $scope.$digest();
                });
        }
        var countdown=60;
        //倒计时
        function settime(obj) {
            if (countdown == 0) {
                obj.removeAttribute("disabled");
                obj.innerHTML="获取验证码";
                countdown = 60;
                return;
            } else {
                obj.setAttribute("disabled", true);
                obj.innerHTML="重新发送(" + countdown + ")";
                countdown--;
            }
            setTimeout(function() {
                    settime(obj) }
                ,1000)
        }
        //换绑手机号
        function bindPhone() {
            var suc=formValidation();
            if(suc){
                $scope.is_loading=true;
                yikePcdd.bindPhone($scope.user.old_phone,$scope.user.phone,token)
                    .then(function (data) {
                        $scope.is_loading=false;
                        $yikeUtils.toast(data.result.result);
                        $ionicHistory.goBack();
                        $scope.$digest();
                    },function () {
                        $scope.is_loading=false;
                        $scope.$digest();
                    })
            }
        }
    }
})();
