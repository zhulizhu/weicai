
/**
 * Created by frank on 2016/11/14.
 */
(function () {
    'use strict';

    angular
        .module('lower.bet.controller', [])
        .controller('LowerBetCtrl', LowerBetCtrl);

    LowerBetCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$filter'];
    /* @ngInject */
    function LowerBetCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$filter){
        var token=localStorageService.get('token');
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.betsList = betsList;
        $scope.clickSelect = clickSelect;
        $scope.betsdetails= betsdetails;
        $scope.getGame = getGame;
        $scope.classShow = classShow;
        var page=1;
        $scope.records=[];
        $scope.gameState=[   //用户类型
            {name:'全部',id:200},
            {name:'未开奖',id:1},
            {name:'未中奖',id:2},
            {name:'中奖',id:3},
            {name:'撤销',id:4}
            //,{name:'异常',id:5}
        ];
        $scope.member={
            name:'',  //用户账号
            stateId:$scope.gameState[0].id,
            gameId:''
        };
        init();
        function init() {
            getGame();
        }
        /*出当前路由地址的时候，让isson为noson*/
        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.closeModal();
        });
        $ionicModal.fromTemplateUrl(tepPre+'model/lower-bet-detail.html',{
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(r) {
            $scope.record_details=r;
            betsdetails();
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();

        };

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
            $("#start-date1").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            $("#end-date1").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            $("#start-date1").val($filter('date')(new Date(), "yyyy-MM-dd"));
            $("#end-date1").val($filter('date')(new Date(), "yyyy-MM-dd"));
        });
        //下拉刷新
        function refresh() {
            page=1;
            betsList();
        }

        //上拉加载
        function loadMore() {
            betsList();
        }
        //下级投注彩种列表
        function getGame(){
            var options={
                token:token
            };
            yikePcdd.getgame(options)
                .then(function (data) {
                    $scope.gameList=data.info;
                    $scope.gameList.unshift({id:200,name:'全部'});
                    $scope.member.gameId=$scope.gameList[0].id;
                    loadMore();
                    $scope.$digest();
                },function () {
                    $scope.$digest();

                });

        }
        //点击查询
        function clickSelect(){
            refresh();
        }
        //下级投注列表
        function betsList() {
            loadingShow('加载中...');
            $scope.data1 = $("#start-date1").val();
            $scope.data2 = $("#end-date1").val();
            $scope.da1 = new Date($scope.data1).valueOf() / 1000;
            $scope.da2 = new Date($scope.data2).valueOf() / 1000;
            var options={
                token:token,
                name:$scope.member.name,
                page:page,
                startTime:$scope.da1,
                endTime:$scope.da2,
                type:$scope.member.gameId,
                state:$scope.member.stateId
            };
            yikePcdd.betslist(options)
                .then(function (data) {
                    if(page == 1){
                        $scope.records=data.info.bet;
                    }else{
                        $scope.records=$scope.records.concat(data.info.bet);
                    }
                    $scope.noMoreItemsAvailable = $scope.records.length >= Number(data.info.total);
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                },function () {
                    $scope.records=[];
                    $scope.noMoreItemsAvailable = true;
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }


        //下级投注详情
        function betsdetails(){
            var options={
                token:token,
                id:$scope.record_details.id
            };
            yikePcdd.betsDetail(options)
                .then(function (data) {
                    $scope.bets=data.info;
                    $scope.$digest();
                },function () {
                    $scope.$digest();
                });

        }

        //颜色显示
        function classShow(type){
            if(type == 0){
                return '';
            }else if(type <0){
                return 'red';
            }else{
                return 'green';
            }
        }




    }
})();
