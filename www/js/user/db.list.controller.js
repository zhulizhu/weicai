/**
 * Created by frank on 2016/11/12.
 */
(function () {
    'use strict';

    angular
        .module('db.list.controller', [])
        .controller('dbListCtrl', dbListCtrl);

    dbListCtrl.$inject = ['$scope', '$yikeUtils', '$state', '$ionicHistory', '$ionicModal', 'localStorageService', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicLoading', '$sce'];
    /* @ngInject */
    function dbListCtrl($scope, $yikeUtils, $state, $ionicHistory, $ionicModal, localStorageService, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $sce) {
        var token=localStorageService.get('token');
        $scope.id=$state.params.id;
        $scope.sidedRankings=sidedRankings;
        init();
        //获取银行列表
        function init() {
            sidedRankings()
        }
        //常见问题
        function sidedRankings() {
            loadingShow('加载中...');
            var options={
                token:token,
                type:$scope.id
            };
            yikePcdd.sidedRanking(options)
                .then(function (data){
                    $scope.state=data.status;
                    $scope.mess=data.info;
                    $scope.$digest();
                },function(data){
                  $scope.state=data.status;
                })
        }


    }
})();
