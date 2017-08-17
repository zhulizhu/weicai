/**
 * Created by HL on 2017/1/16.
 */
(function(){
  'use strict';

  angular
    .module('wechat.recharge.controller',[])
    .controller('WechatreChargeCtrl',WechatreChargeCtrl);

  WechatreChargeCtrl.$inject=['$scope'];

  function WechatreChargeCtrl($scope){
  init();
  function init(){

  };
  $scope.tab=0;
  $scope.tabs=function(i){
  $scope.tab=i;
  }
  }
})();
