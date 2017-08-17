/**
 * Created by frank on 2016/11/23.
 */
(function () {
  'use strict';

  angular
    .module('withdraw.deposit.controller', [])
    .controller('WithdrawDepositCtrl', WithdrawDepositCtrl);

  WithdrawDepositCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', 'localStorageService', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$sce'];
  /* @ngInject */
  function WithdrawDepositCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, localStorageService, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $sce) {
    var token = localStorageService.get('token');
    $scope.depositApply = depositApply;
    $scope.goBack = goBack;
    $scope.selectBank = selectBank;
    //绑定提现申请数据
    $scope.formValue = {
      money: '',
      psw: '',
      defaultBank: ''
    };
    init();
    function init() {
        loadingShow('加载中...');
       //提现默认银行卡信息，提现须知，提醒
      yikePcdd.depositBankNum({token:token})
        .then(function (data) {
          $scope.content = data.info;
          $scope.$digest();
        });
        //获取银行卡列表
        loadingShow('加载中...');
        yikePcdd.userBankCard({token:token})
            .then(function (data) {
                $scope.userBanks = data.info;
                AV._.each($scope.userBanks,function (ban) {
                    var format = ban.account.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
                    ban.account = format.slice(0,4)+format.replace(/\d/g, "*").slice(4, -4) + format.slice(-4);
                    if(ban.isDefault ==1 ){
                        $scope.formValue.defaultBank=ban;
                    }
                });
                $scope.$digest();
            },function () {
                $scope.userBanks=[];
                $scope.$digest();
            });
    }
      /*出当前路由地址的时候，让isson为noson*/
      $scope.$on('$ionicView.beforeLeave', function () {
          $scope.closeBankListModal();
      });
      $ionicModal.fromTemplateUrl(tepPre+'model/select-bank-list.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.bankListModal = modal;
      });
      $scope.openBankListModal = function () {
          $scope.bankListModal.show();
      };
      $scope.closeBankListModal = function () {
          $scope.bankListModal.hide();
      };
     function goBack() {
      $ionicHistory.goBack();
    }
    //选择提现银行卡
      function selectBank(bank) {
          $scope.formValue.defaultBank=bank;
          $scope.closeBankListModal();
      }
    // 提现申请
    //var RegExe=/^[0-9]*[1-9][0-9]*$/;
    function depositApply() {
      if ($scope.formValue.money == '' || $scope.formValue.money==null) {
        $yikeUtils.toast('请输入提现金额');
      }else if ($scope.formValue.psw == '' || $scope.formValue.psw == null) {
        $yikeUtils.toast('请先输入密码');
      }
      else{
          loadingShow('加载中...');
          var options={
              token:token,
              amount:$scope.formValue.money,
              coinPassword:$scope.formValue.psw,
              bankId:$scope.formValue.defaultBank.id
          };
        yikePcdd.depositApply(options)
          .then(function (data) {
            $yikeUtils.toast(data.msg);
              $scope.formValue.money ='';
              $scope.formValue.psw = '';
            $ionicHistory.goBack();
            $scope.$digest();
          })
      }

    }
  }
})();
