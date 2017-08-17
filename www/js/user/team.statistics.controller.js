/**
 * Created by frank on 2016/11/14.
 */
(function () {
    'use strict';

    angular
        .module('team.statistics.controller', [])
        .controller('TeamStatisticsCtrl', TeamStatisticsCtrl);

    TeamStatisticsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$filter','$sce'];
    /* @ngInject */
    function TeamStatisticsCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$filter,$sce){
        var token=localStorageService.get('token');
        $scope.topCount=topCount;
        $scope.teamLists = teamLists;
        $scope.classShow=classShow;
        init();
        function init() {
            topCount();
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
            $("#start-date3").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            $("#end-date3").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
            $("#start-date3").val($filter('date')(new Date(), "yyyy-MM-dd"));
            $("#end-date3").val($filter('date')(new Date(), "yyyy-MM-dd"));
            teamLists();
        });
        //团队统计的头部统计
        function topCount(){
            var options={
                token:token
            };
            yikePcdd.topCount(options)
                .then(function (data) {
                    $scope.is_loading=false;
                    $scope.count=data.info;
                    $scope.$digest();
                },function(){
                    $scope.is_loading=false;
                });
        }
        //团队统计查询列表
        function teamLists() {
            loadingShow('加载中...');
                $scope.data1=$("#start-date3").val();
                $scope.data2=$("#end-date3").val();
                $scope.da1 = new Date($scope.data1).valueOf()/1000;
                $scope.da2 = new Date($scope.data2).valueOf()/1000;
                var options={
                    token:token,
                    startTime:$scope.da1,
                    endTime:$scope.da2
                };
                yikePcdd.teamList(options)
                    .then(function (data) {
                        $scope.teamlist=data.info;
                        $scope.$digest();
                    },function(data){
                        $scope.teamlist=[];
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
