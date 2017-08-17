/**
 * Created by frank on 2016/11/9.
 */
(function () {
    'use strict';

    angular
        .module('my.mes.controller', [])
        .controller('MyMesCtrl', MyMesCtrl);

    MyMesCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function MyMesCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        var page=1;
        $scope.announces=[];
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        init();
        function init() {}
        //下拉刷新
        function refresh() {
            page=1;
           userMessage();
        }
        //上拉加载
        function loadMore() {
            userMessage();
        }
        //用户消息
        function userMessage() {
            yikePcdd.userMessage(token,page)
                .then(function (data) {
                    var pattern1=/&lt;/gim;
                    var pattern2=/&gt;/gim;
                    var pattern3=/&quot;/gim;
                    AV._.each(data.result.result,function (co) {
                        co.content=co.content.replace(pattern1,'<');
                        co.content=co.content.replace(pattern2,'>');
                        co.content=co.content.replace(pattern3,'"');
                        co.content=$sce.trustAsHtml(co.content);
                    });
                    if(page == 1){
                        $scope.announces=data.result.result;
                    }else{
                        $scope.announces=$scope.announces.concat(data.result.result);
                    }
                    $scope.noMoreItemsAvailable = $scope.announces.length >= Number(data.result.total);
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                },function () {
                    $scope.announces=[];
                    $scope.noMoreItemsAvailable = true;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
        }
    }
})();