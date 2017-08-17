(function () {
  'use strict';

  angular
    .module('recharge.controller', [])
    .controller('RechargeCtrl', RechargeCtrl);

  RechargeCtrl.$inject = ['$scope','$yikeUtils','$state','$rootScope','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
  /* @ngInject */
  function RechargeCtrl($scope,$yikeUtils,$state,$rootScope,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
    var token=localStorageService.get('token');
    init();
    function init() {
        try{$rootScope.closeHomeServe.hide();}catch (err){}
        $scope.imgss=$rootScope.tabCache.recharge;
        if($rootScope.tabCache.recharge.length == 0){
            loadingHideShow('加载中...',3000);
        }
        //线下充值方式
        yikePcdd.rechargeWay({token:token})
            .then(function(data){
                $scope.imgss=data.info;
                $rootScope.tabCache.recharge=data.info;
                $scope.$digest();
            });
    }
      //待开发提示
      $scope.tishi=function (){
          $yikeUtils.toast('开发中...');
      }
  }
})();
