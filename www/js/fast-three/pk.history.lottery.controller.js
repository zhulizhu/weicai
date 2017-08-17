/**
 * Created by frank on 2016/12/9.
 */
(function () {
    'use strict';

    angular
        .module('pk.history.lottery.controller', [])
        .controller('PkHistoryLotteryCtrl',PkHistoryLotteryCtrl);

    PkHistoryLotteryCtrl.$inject = ['$scope','$yikeUtils','$state','$location','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$ionicScrollDelegate'];
    /* @ngInject */
    function PkHistoryLotteryCtrl($scope,$yikeUtils,$state,$location,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$ionicScrollDelegate){
        var id=$state.params.id;
        var token=localStorageService.get('token');
        var page=1;
        $scope.data=[];
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        init();
        function init() {}
        function refresh() {
            page=1;
            history_lottery();
        }
        function loadMore() {
            history_lottery();
        }
        //历史开奖记录
        function history_lottery() {
            yikePcdd.historyLottery({token:token,type:id,page:page})
                .then(function (data) {
                    if(page == 1){
                        $scope.data=data.info.lists;
                    }else{
                        $scope.data=$scope.data.concat(data.info.lists);
                    }
                    $scope.noMoreItemsAvailable = $scope.data.length >= Number(data.info.total);
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                },function () {
                    $scope.data=[];
                    $scope.noMoreItemsAvailable = true;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page=1;
                })
        }
    }
})();
