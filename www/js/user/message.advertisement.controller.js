/**
 * Created by HL on 2016/12/29.
 */
(function () {
  'use strict';

  angular
    .module('message.advertisement.controller', [])
    .controller('MessageAdvertisementCtrl', MessageAdvertisementCtrl);

    MessageAdvertisementCtrl.$inject = ['$scope','$yikeUtils','localStorageService','$state'];
  /* @ngInject */
  function MessageAdvertisementCtrl($scope,$yikeUtils,localStorageService,$state){
    var token=localStorageService.get('token');
    var type=$state.params.type;
    $scope.types=1;
    if(type){
        $scope.types=type;
    }
      $scope.data=[];
    $scope.titles={
      '0':'消息',
      '1':'公告'
    };
    var page=1;
    $scope.refresh=refresh;
    $scope.loadMore=loadMore;
    init();
    function init() {
    }
      function refresh() {
          page=1;
          if($scope.types == 1){
              platform_advertisement();
          }else{
              user_message();
          }
      }
      function loadMore() {
          if($scope.types == 1){
              platform_advertisement();
          }else{
              user_message();
          }
      }
      //用户消息
      function user_message() {
          yikePcdd.user_message({token:token,p:page})
              .then(function (data) {
                  if(page == 1){
                      $scope.data=data.info.list;
                  }else{
                      $scope.data=$scope.data.concat(data.info.list);
                  }
                  $scope.noMoreItemsAvailable = $scope.data.length >= Number(data.info.count);
                  $scope.$digest();
                  $scope.$broadcast('scroll.refreshComplete');
                  $scope.$broadcast('scroll.infiniteScrollComplete');
                  page++;
              },function () {
                  $scope.data=[];
                  $scope.noMoreItemsAvailable = true;
                  $scope.$broadcast('scroll.refreshComplete');
                  $scope.$broadcast('scroll.infiniteScrollComplete');
              })
      }
      //平台公告
      function platform_advertisement() {
          yikePcdd.dIndexContent({token:token,page:page})
              .then(function (data) {
                  if(page == 1){
                      $scope.data=data.info.list;
                  }else{
                      $scope.data=$scope.data.concat(data.info.list);
                  }
                  $scope.noMoreItemsAvailable = $scope.data.length >= Number(data.info.count);
                  $scope.$digest();
                  $scope.$broadcast('scroll.refreshComplete');
                  $scope.$broadcast('scroll.infiniteScrollComplete');
                  page++;
              },function () {
                  $scope.data=[];
                  $scope.noMoreItemsAvailable = true;
                  $scope.$broadcast('scroll.refreshComplete');
                  $scope.$broadcast('scroll.infiniteScrollComplete');
              })
      }
      //选择消息
      $scope.selectType=function (type) {
          $scope.types=type;
          $scope.data=[];
          refresh();
      };
  }
})();
