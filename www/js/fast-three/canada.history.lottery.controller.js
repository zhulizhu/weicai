/**
 * Created by frank on 2016/12/9.
 */
(function () {
    'use strict';

    angular
        .module('canada.history.lottery.controller', [])
        .controller('CanadaHistoryLotteryCtrl',CanadaHistoryLotteryCtrl);

    CanadaHistoryLotteryCtrl.$inject = ['$scope','$yikeUtils','$state','$location','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$ionicScrollDelegate'];
    /* @ngInject */
    function CanadaHistoryLotteryCtrl($scope,$yikeUtils,$state,$location,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$ionicScrollDelegate){
        var id=$state.params.id;
        var token=localStorageService.get('token');
        var page=1;
        $scope.data=[];
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.class_show=class_show;
        init();
        function init() {
        }
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
            if(val == 3 || val == 6 || val == 9 || val == 12 || val == 15 || val == 18 || val == 21 || val == 24){
                return 'bg-red';
            }else if(val == 1 || val == 4 || val == 7 || val == 10 || val == 16 || val == 19 || val == 22 || val == 25){
                return 'bg-green';
            }else if(val == 2 || val == 5 || val == 8 || val == 11 || val == 17 || val == 20 || val == 23 || val == 26){
                return 'bg-blue';
            }else{
                return 'bg-gray';
            }
        }
    }
})();
