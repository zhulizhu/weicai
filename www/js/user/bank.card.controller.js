/**
 * Created by frank on 2016/11/12.
 */
(function () {
  'use strict';

  angular
    .module('bank.card.controller', [])
    .controller('BankCardCtrl', BankCardCtrl);

  BankCardCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', 'localStorageService', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$sce'];
  /* @ngInject */
  function BankCardCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, localStorageService, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $sce) {
    var token=localStorageService.get('token');
      $scope.formValue = {
          accountName:'',
          bankCardNub:'',
          accountAddress:'',
          presentPassword:'',
          bankId:''
      };
    init();
    //获取银行列表
    function init() {
      var options={
        token:token
      }
      yikePcdd.bankList(options)
        .then(function (data) {
          $scope.banks = data.info;
            $scope.formValue.bankId=data.info[0].id;
          $scope.$digest();
        });
    }
    $scope.bindBankCard = bindBankCard;
    //绑定银行卡
    function bindBankCard() {
      var reg1 = /^[0-9]*$/;
      if($scope.formValue.accountName == ''){

        $yikeUtils.toast('请输入您的姓名');

      } else if($scope.formValue.bankCardNub == ''){

        $yikeUtils.toast('请输入您的银行卡卡号');

      } else if($scope.formValue.bankCardNub.length != 19 && $scope.formValue.bankCardNub.length != 16){

        $yikeUtils.toast('请输入正确的银行卡卡号');

      } else if($scope.formValue.accountAddress == ''){

        $yikeUtils.toast('请输入您的银行卡开户地址');

      } else if($scope.formValue.presentPassword == ''){

        $yikeUtils.toast('请输入您的提现密码');

      } else if(!reg1.test($scope.formValue.presentPassword)){
        $yikeUtils.toast('请输入数字密码');
      } else {
          loadingShow('加载中...');
        var options={
          token:token,
          coinPassword:$scope.formValue.presentPassword,
          username:$scope.formValue.accountName,
          account:$scope.formValue.bankCardNub,
          openAddress:$scope.formValue.accountAddress,
          bankId:$scope.formValue.bankId
        };
        yikePcdd.bindBankCard(options)
            .then(function(data){
            $yikeUtils.toast(data.msg);
            $ionicHistory.goBack();
        });
      }
    }
  }
})();
