/**
 * Created by HL on 2017/1/16.
 */
(function(){
  'use strict';

  angular
    .module('earnings.ruler.controller',[])
    .controller('earningsrulercontrollerCtrl',earningsrulercontrollerCtrl);

  earningsrulercontrollerCtrl.$inject=['$scope','localStorageService'];

  function earningsrulercontrollerCtrl($scope,localStorageService){
    var token=localStorageService.get('token');
    $scope.refresh=refresh;
    $scope.loadMore=loadMore;
    var page=1;
    $scope.records=[];
    init();
    function init() {}
    //下拉刷新
    function refresh() {
      page=1;
      accountChangeRecord();
    }
    //上拉加载
    function loadMore() {
      accountChangeRecord();
    }
    //往期收益
    function accountChangeRecord() {
      yikePcdd.usersss(token,page)
        .then(function (data) {
          $scope.total=data.result.total_cost;
          if(page == 1){
            $scope.records=data.result.data;
          }else{
            $scope.records=$scope.records.concat(data.result.data);
          }
          $scope.noMoreItemsAvailable = $scope.records.length >= Number(data.result.total);
          $scope.$digest();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
            page++;
        },function () {
          $scope.noMoreItemsAvailable = true;
          $scope.$digest();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    }
  }
})();
