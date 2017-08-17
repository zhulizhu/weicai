/**
 * Created by frank on 2016/11/28.
 */
(function () {
    'use strict';

    angular
        .module('common.problems.controller', [])
        .controller('commonProblemsCtrl', commonProblemsCtrl);

    commonProblemsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function commonProblemsCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token = localStorageService.get('token');
        init();
        function init() {
            howToPlay();
        }
        //常见问题
        function howToPlay() {
            loadingShow('加载中...');
            var options={
                token:token
            };
            yikePcdd.faq_lists(options)
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
