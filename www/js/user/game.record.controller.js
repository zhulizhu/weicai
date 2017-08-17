/**
 * Created by frank on 2016/11/14.
 */
(function () {
    'use strict';

    angular
        .module('game.record.controller', [])
        .controller('GameRecordCtrl', GameRecordCtrl);

    GameRecordCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$filter'];
    /* @ngInject */
    function GameRecordCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$filter){
        var token=localStorageService.get('token');
        var czId=$state.params.id;
        $scope.gameRecord=gameRecord;
        $scope.classShow = classShow;
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        var page=1;
        $scope.game={
            type:'',
            id:1
        };
        $scope.state={
            id:1
        };
        $scope.status={
            '1':'未开奖',
            '2':'未中奖',
            '3':'中奖',
            '4':'已撤单'
        };
        $scope.recordList=[];
        $scope.select=select;
        //切换游戏记录列表
        function select(i){
            $scope.state.id=i;
            refresh();
        }
        init();
        function init() {
            var options={
                token:token,
                game:1
            };
            loadingShow('加载中...');
            yikePcdd.gameList(options)
                .then(function (data) {
                    $scope.gameType=data.info;
                    $scope.game.id=$scope.gameType[0].id;
                    if(czId){
                        $scope.game.id=czId;
                    }
                    $scope.$digest();
                });
        }
        //下拉刷新
        function refresh() {
            page=1;
            gameRecord();
        }

        //上拉加载
        function loadMore() {
            gameRecord();
        }
        //时间选择
        $(function () {
            var currYear = (new Date()).getFullYear();
            var currMonth = (new Date()).getMonth();
            var currDate = (new Date()).getDate();
            var opt={};
            opt.date = {preset : 'date',minDate: new Date(currYear-1,0,1), maxDate: new Date(currYear,currMonth,currDate), stepMinute: 5};
            opt.default = {
                theme: 'sense-ui', //皮肤样式
                display: 'modal', //显示方式
                mode: 'scroller', //日期选择模式
                lang:'zh'
                // startYear:currYear-1, //开始年份
                // endYear:currYear //结束年份
            };
            $("#start-date4").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            $("#end-date4").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            $("#start-date4").val($filter('date')(new Date(), "yyyy-MM-dd"));
            $("#end-date4").val($filter('date')(new Date(), "yyyy-MM-dd"));
        });
        //游戏记录
        function gameRecord() {
                $scope.data1=$("#start-date4").val();
                $scope.data2=$("#end-date4").val();
                $scope.da1 = new Date($scope.data1).valueOf()/1000;
                $scope.da2 = new Date($scope.data2).valueOf()/1000;
                var options={
                    token:token,
                    id:$scope.game.id,
                    startTime:$scope.da1,
                    endTime:$scope.da2,
                    status:$scope.state.id,
                    page:page
                };
                yikePcdd.gameRecord(options)
                    .then(function (data) {
                        if(page == 1){
                            $scope.recordList=data.info.res;
                        }else{
                            $scope.recordList=$scope.recordList.concat(data.info.res);
                        }
                        $scope.$digest();
                        $scope.noMoreItemsAvailable = $scope.recordList.length >= Number(data.info.total);
                        $scope.$digest();
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        page++;
                    },function(){
                        $scope.recordList=[];
                        $scope.noMoreItemsAvailable = true;
                        $scope.$digest();
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
        }

        //颜色显示
        function classShow(type){
            if(type == 1){
                return '';
            }else if(type == 2){
                return 'red';
            }else{
                return 'green';
            }
        }


    }
})();
