/**
 * Created by frank on 2016/12/9.
 */
(function () {
    'use strict';

    angular
        .module('mark.six.history.lottery.controller', [])
        .controller('MarkSixHistoryLotteryCtrl',MarkSixHistoryLotteryCtrl);

    MarkSixHistoryLotteryCtrl.$inject = ['$scope','$yikeUtils','$state','$location','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$ionicScrollDelegate'];
    /* @ngInject */
    function MarkSixHistoryLotteryCtrl($scope,$yikeUtils,$state,$location,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$ionicScrollDelegate){
        var id=$state.params.id;
        var token=localStorageService.get('token');
        var page=1;
        $scope.data=[];
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.class_show=class_show;
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
        //开奖球颜色显示
        function class_show(val) {
            if(val == 1 || val == 2 || val == 7 || val == 8 || val == 12 || val == 13 || val == 18 || val == 19 || val == 23
                || val == 24 || val == 29 || val == 30 || val == 34 || val == 35 || val == 40 || val == 45 || val == 46){
                return 'bg-red';
            }else if(val == 3 || val == 4 || val == 9 || val == 10  || val == 14 || val == 15 || val == 20 || val == 25
                || val == 26 || val == 31 || val == 36 || val == 37 || val == 41 || val == 42 || val == 47 || val == 48){
                return 'bg-blue';
            }else{
                return 'bg-green';
            }
        }
    }
})();
