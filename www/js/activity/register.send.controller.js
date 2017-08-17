/**
 * Created by john on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('register.send.controller', [])
        .controller('registerSendCtrl', registerSendCtrl);
    registerSendCtrl.$inject = ['$scope','$state','$ionicModal','$yikeUtils','$ionicActionSheet','$rootScope','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicLoading','$sce'];
    /* @ngInject */
    function registerSendCtrl($scope,$state,$ionicModal,$yikeUtils,$ionicActionSheet,$rootScope,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.id=$state.params.id;
        $scope.activityDetail=activityDetail;
        init();
        function init() {
            activityDetail();

        }
        //活动详情
        function activityDetail() {
            loadingShow('加载中...');
            var options={
                token:token,
                id:$scope.id
            };
            yikePcdd.activityDetails(options)
                .then(function (data){
                    $scope.mess=data.info;
                    var pattern1=/&lt;/gim;
                    var pattern2=/&gt;/gim;
                    var pattern3=/&quot;/gim;
                    data.info.content=data.info.content.replace(pattern1,'<');
                    data.info.content=data.info.content.replace(pattern2,'>');
                    data.info.content=data.info.content.replace(pattern3,'"');
                    data.info.content=$sce.trustAsHtml(data.info.content);
                    $scope.content=data.info.content;
                    $scope.$digest();
                })
        }


    }
})();
