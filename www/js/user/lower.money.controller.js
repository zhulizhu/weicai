
/**
 * Created by frank on 2016/11/14.
 */
(function () {
    'use strict';

    angular
        .module('lower.money.controller', [])
        .controller('LowerMoneyCtrl', LowerMoneyCtrl);

    LowerMoneyCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$filter'];
    /* @ngInject */
    function LowerMoneyCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$filter){
        var token=localStorageService.get('token');
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.capitallist = capitallist;
        $scope.capitalDetail= capitalDetail;
        var page=1;
        $scope.records=[];

        $scope.userType=[   //用户类型
            {title:'全部',id:200},
            {title:'充值',id:1},
            {title:'提现',id:101},
            {title:'投注',id:102},
            {title:'中奖',id:5},
            {title:'活动奖励',id:110},
            {title:'返点奖金',id:2}
        ];
        $scope.member={
            name:'',  //用户账号
            userTypeId:$scope.userType[0].id
        };
        init();
        function init() {
        }
        /*出当前路由地址的时候，让isson为noson*/
        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.closeModal();
        });
        $ionicModal.fromTemplateUrl(tepPre+'model/lower-money-detail.html',{
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(r) {
            $scope.record_details=r;
            capitalDetail();
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
            $("#start-date2").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            $("#end-date2").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            $("#start-date2").val($filter('date')(new Date(), "yyyy-MM-dd"));
            $("#end-date2").val($filter('date')(new Date(), "yyyy-MM-dd"));
        });
        //下拉刷新
        function refresh() {
            page=1;
            capitallist();
        }

        //上拉加载
        function loadMore() {
            capitallist();
        }
        //下级资金流水列表
        function capitallist() {
            loadingShow('加载中...');
            $scope.data1 = $("#start-date2").val();
            $scope.data2 = $("#end-date2").val();
            $scope.da1 = new Date($scope.data1).valueOf() / 1000;
            $scope.da2 = new Date($scope.data2).valueOf() / 1000;
            var options={
                token:token,
                name:$scope.member.name,
                page:page,
                startTime:$scope.da1,
                endTime:$scope.da2,
                type:$scope.member.userTypeId
            };
            yikePcdd.capitallist(options)
                .then(function (data) {
                    if(page == 1){
                        $scope.records=data.info.capital;
                    }else{
                        $scope.records=$scope.records.concat(data.info.capital);
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

        //下级资金流水详情
        function capitalDetail(){
            var options={
                token:token,
                id:$scope.record_details.id
            };
            yikePcdd.capitaldetail(options)
                .then(function (data) {
                    $scope.capital=data.info;
                    $scope.$digest();
                });

        }


    }
})();
