/**
 * Created by frank on 2016/11/9.
 */
(function () {
  'use strict';

  angular
    .module('dynamic.controller', [])
    .controller('DynamicCtrl', DynamicCtrl);


    DynamicCtrl.$inject = ['$scope','$yikeUtils','$state','$rootScope','$ionicViewSwitcher','localStorageService','$ionicScrollDelegate','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function DynamicCtrl($scope,$yikeUtils,$state,$rootScope,$ionicViewSwitcher,localStorageService,$ionicScrollDelegate,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.ncImgs={
            '1':'img/game/xigua.png',
            '2':'img/game/yezi.png',
            '3':'img/game/liulian.png',
            '4':'img/game/youzi.png',
            '5':'img/game/boluo.png',
            '6':'img/game/putao.png',
            '7':'img/game/lizhi.png',
            '8':'img/game/yingtao.png',
            '9':'img/game/caomei.png',
            '10':'img/game/fanqie.png',
            '11':'img/game/lizi.png',
            '12':'img/game/pingguo.png',
            '13':'img/game/taozi.png',
            '14':'img/game/ganju.png',
            '15':'img/game/donggua.png',
            '16':'img/game/luobo.png',
            '17':'img/game/nangua.png',
            '18':'img/game/qiezi.png',
            '19':'img/game/jiaquan.png',
            '20':'img/game/nainiu.png'
        };
        init();
        function init() {
            try{$rootScope.closeHomeServe.hide();}catch (err){}
            $scope.allHistoryLotteryList=$rootScope.tabCache.history;
            if($rootScope.tabCache.history.length == 0){
                loadingHideShow('加载中...',3000);
            }
            yikePcdd.allHistoryLottery({token:token})
                .then(function (data) {
                    $scope.allHistoryLotteryList=data.info;
                    $rootScope.tabCache.history=data.info;
                    $scope.$digest();
                })
        }
        //li标签样式
        $scope.liClass=function (type) {
            if(type == 'bjpk10-odds'){
                return 'pk-all';
            }else if(type == 'lhc-odds'){
                return 'liuhe-all';
            }else if(type == 'cqssc-odds' || type == 'ffc-odds'){
                return 'ssc-all';
            }
        };
        //开奖球颜色显示
        $scope.class_show=function (val,type) {
            if(type == 'pcdd' || type == 'jnd28-odds'){
                if(val == 3 || val == 6 || val == 9 || val == 12 || val == 15 || val == 18 || val == 21 || val == 24){
                    return 'bg-red';
                }else if(val == 1 || val == 4 || val == 7 || val == 10 || val == 16 || val == 19 || val == 22 || val == 25){
                    return 'bg-green';
                }else if(val == 2 || val == 5 || val == 8 || val == 11 || val == 17 || val == 20 || val == 23 || val == 26){
                    return 'bg-blue';
                }else{
                    return 'bg-gray';
                }
            }else if(type == 'lhc-odds'){
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
        };
        $scope.pageGo=function (list) {
            var url='';
            if(list.name == 'pcdd'){
                url='lucky-history-lottery';
            }else if(list.name == 'jnd28-odds'){
                url='canada-history-lottery';
            } else if(list.name == 'lhc-odds'){
                url='mark-six-history-lottery';
            } else if(list.name == 'bjpk10-odds'){
                url='pk-history-lottery';
            } else if(list.name == 'cqssc-odds'){
                url='ssc-history-lottery';
            }else if(list.name == 'ffc-odds'){
                url='ffc-history-lottery';
            }
            $state.go(url,{id:list.tId});
        }
    }
})();
