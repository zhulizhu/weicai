/**
 * Created by frank on 2016/11/23.
 */
(function () {
    'use strict';

    angular
        .module('bind.agency.controller', [])
        .controller('BindAgencyCtrl', BindAgencyCtrl);
    BindAgencyCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function BindAgencyCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.bind_agency=bind_agency;
        $scope.data={
            agent_num:''
        };
        init();
        function init() {}
        //绑定代理人ID
        function bind_agency() {
            if($scope.data.agent_num == null || $scope.data.agent_num == ''){
                $yikeUtils.toast('请先输入代理人ID');
                return;
            }
            loadingShow('加载中...');
            yikePcdd.bind_agency(token,$scope.data.agent_num)
                .then(function (data) {
                    $yikeUtils.toast(data.result.result);
                    $state.go('tab.home');
                    $scope.$digest();
                })
        }
    }
})();
