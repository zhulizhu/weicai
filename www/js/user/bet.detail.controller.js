/**
 * Created by HL on 2017/1/25.
 */
(function () {
    'use strict';

    angular
        .module('bet.detail.controller',[])
        .controller('betDetailCtrl',betDetailCtrl);

    betDetailCtrl.$inject = ['$scope','$state','localStorageService','$yikeUtils','$ionicLoading','$ionicHistory'];
    function betDetailCtrl($scope,$state,localStorageService,$yikeUtils,$ionicLoading,$ionicHistory) {
        $scope.rocordId=$state.params.id;
        var token = localStorageService.get('token');
        $scope.gameRecordDetail = gameRecordDetail;
        $scope.classShow = classShow;
        $scope.status={
            '1':'未开奖',
            '2':'未中奖',
            '3':'中奖'
        }
        init();
        function init() {
            gameRecordDetail();
        }


        //游戏记录详情
        function gameRecordDetail() {
            loadingShow('加载中...');
            var option={
                token:token,
                logId:$scope.rocordId
            };
            yikePcdd.gameRecordDetail(option)
                .then(function (data) {
                    $scope.detail=data.info;
                    $scope.detail.momey=($scope.detail.actionNum*$scope.detail.beiShu).toFixed(3);
                    if($scope.detail.select==1 || $scope.detail.select==4){
                        $scope.detail.yinli='';
                    }else{
                        $scope.detail.yinli=($scope.detail.bonus-$scope.detail.actionNum*$scope.detail.beiShu).toFixed(3);
                    }

                    $scope.$digest();

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
