/**
 * Created by frank on 2016/11/23.
 */
(function () {
  'use strict';

  angular
    .module('user.wallet.controller', [])
    .controller('UserWalletCtrl', UserWalletCtrl);

  UserWalletCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicViewSwitcher', 'localStorageService', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$sce'];
  /* @ngInject */
  function UserWalletCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicViewSwitcher, localStorageService, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $sce) {
    //获取用户token
    var token = localStorageService.get('token');
    //判断是否绑定提现密码
    $scope.isTX = isTX;
    //点击提示
    $scope.clickTips = clickTips;
    init();
    function init() {
        loadingShow('加载中...');
        var options={
            token:token
        };
      yikePcdd.userinfo(options)
        .then(function (data) {
          $scope.user = data.info;
          $scope.$digest();
        })
    }
    //判断是否已绑定银行卡
    function isBank(type) {
        loadingShow('加载中...');
      yikePcdd.isBinding({token:token})
        .then(function () {
            if(type == 'bank'){
                $state.go('bank-card-list');
            }else{
                $state.go('withdraw-deposit');
            }
            $scope.$digest();
        }, function () {
            $state.go('bank-card');
        })
    }

    //判断是否已设置提现密码
    function isTX(type) {
        loadingShow('加载中...');
      yikePcdd.isCoinPwd({token:token})
        .then(function () {
            isBank(type);
            $scope.$digest();
        }, function () {
            $state.go('withdraw-deposit-password');
        })
    }
    //点击提示
    function clickTips(){
      $yikeUtils.toast("功能正在研发中，敬请期待哦！");
    }
  }
})();
