/**
 * Created by frank on 2016/11/28.
 */
(function () {
    'use strict';

    angular
        .module('favorable.activity.controller', [])
        .controller('favorableActivityCtrl', favorableActivityCtrl);

    favorableActivityCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function favorableActivityCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token = localStorageService.get('token');
        $scope.tishi=tishi;
        $scope.favoActivity=favoActivity;
        init();
        function init() {
            favoActivity();
        }
        //优惠活动列表
        function favoActivity() {
            loadingShow('加载中...');
            var options={
                token:token
            };
            yikePcdd.activity(options)
                .then(function (data) {
                    $scope.lists=data.info;
                    $scope.$digest();
                })
        }
        //跳转页面
        $scope.pageGo=function (list) {
            var url='';
            if(list.type == 'resend'){
                url='register-send';
            }
            else if(list.type == 'recsend'){
                url='day-keep';
            }
            else if(list.type == 'sign'){
                url='pay-sign';
            }
            $state.go(url,{id:list.id});
        };
        //待开发提示
        function tishi(){
            $yikeUtils.toast('开发中...');
        }

    }
})();
