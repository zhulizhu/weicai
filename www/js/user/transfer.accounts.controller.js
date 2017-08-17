/**
 * Created by HL on 2017/1/12.
 */
(function () {
  'use strict';

  angular
    .module('transfer.accounts.controller', [])
    .controller('TransferaccountsCtrl',TransferaccountsCtrl);

  TransferaccountsCtrl.$inject = ['$scope','localStorageService','$yikeUtils','$ionicModal','$state'];

  /* @ngInject */
  function TransferaccountsCtrl($scope,localStorageService,$yikeUtils,$ionicModal,$state) {
    var token = localStorageService.get('token');
    $scope.refresh=refresh;
    $scope.loadMore=loadMore;
    $scope.showClass=showClass;
    $scope.goPage=goPage;
    $scope.recharge=[];
    $scope.state={
      '0':'审核中',
      '1':'成功到账',
      '2':'充值失败'
    };
    var page=1;
    init();
    function init() {

    }
      /*出当前路由地址的时候，让isson为noson*/
      $scope.$on('$ionicView.beforeLeave', function () {
          $scope.closeModal();
      });
    $ionicModal.fromTemplateUrl(tepPre+'model/transfer-accounts-detail.html',{
      scope: $scope,
      animation: 'none'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function(id) {
        recharge_record_details(id);
    };
    $scope.closeModal = function() {
      $scope.modal.hide();

    };
      //下拉刷新
      function refresh() {
       page=1;
       get();
      }
      //上拉加载
      function loadMore() {
       get();
      }
     function get(){
      var options={
        token:token,
        p:page
      };
        yikePcdd.recharge_record(options)
        .then(function(data){
          if(page == 1){
            $scope.recharge=data.info.list;
          }else{
            $scope.recharge=$scope.recharge.concat(data.info.list);
          }
          $scope.noMoreItemsAvailable = $scope.recharge.length >= Number(data.info.count);
          $scope.$digest();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
            page++;
        },function (){
          $scope.recharge=[];
          $scope.noMoreItemsAvailable = true;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
     }
     //充值记录详情
     function recharge_record_details(id) {
         yikePcdd.recharge_record_details({token:token,id:id})
             .then(function (data) {
                 $scope.recordDtail=data.info;
                 $scope.modal.show();
                 $scope.$digest();
             })
     }
     //跳转再次充值
      function goPage(id) {
          $scope.closeModal();
          $state.go('alipay-transfer',{id:id});
      }
     //提现状态
     function showClass(type) {
        if(type == 1){
          return 'green';
        }else if(type == 2){
          return 'red';
        }
     }
  }
})();
