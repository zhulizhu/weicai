/**
 * Created by frank on 2016/11/12.
 */
(function () {
  'use strict';

  angular
    .module('user.bank.list.controller', [])
    .controller('UserBankListCtrl', UserBankListCtrl);

  UserBankListCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', 'localStorageService', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$sce'];
  /* @ngInject */
  function UserBankListCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, localStorageService, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $sce){
    //获取用户token
    var token = localStorageService.get('token');
    init();
    //解除绑定
    $scope.removeBinding = removeBinding;
    //设置默认银行卡
    $scope.bankDefaults = bankDefaults;

    //获取银行卡列表
    function init() {
        loadingShow('加载中...');
      yikePcdd.userBankCard({token:token})
        .then(function (data) {
            $scope.userBanks = data.info;
            AV._.each($scope.userBanks,function (ban) {
                var format = ban.account.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
                ban.account = format.slice(0,4)+format.replace(/\d/g, "*").slice(4, -4) + format.slice(-4);
            });
          $scope.$digest();
        },function () {
            $scope.userBanks=[];
            $scope.$digest();
        });
    }

    //解除绑定
    function removeBinding(id,index) {
        var comfirmPopup = $ionicPopup.confirm({
            title: '解除绑定',
            template: '确认要解除绑定？',
            okText: '确定',
            cancelText: '取消',
            cssClass:'confirm-style'
        });
        comfirmPopup.then(function (res) {
            if (res) {
                loadingShow('加载中...');
                yikePcdd.changeUserBankCard({token:token,bankId:id})
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $scope.userBanks.splice(index,1);
                        $scope.$digest();
                    })
            }
        });
    }
    //设置默认银行卡
    function bankDefaults(bank) {
        loadingShow('加载中...');
      yikePcdd.bankDefault({token:token,bankId:bank.id})
        .then(function (data) {
            AV._.each($scope.userBanks,function (ban) {
                ban.isDefault = 0;
            });
            bank.isDefault =1;
            $yikeUtils.toast(data.msg);
            $scope.$digest();
        }
      );
    }

  }
})();
