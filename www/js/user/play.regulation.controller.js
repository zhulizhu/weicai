
/**
 * Created by frank on 2016/11/28.
 */
(function () {
    'use strict';

    angular
        .module('play.regulation.controller', [])
        .controller('playRegulationCtrl', playRegulationCtrl);

    playRegulationCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function playRegulationCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token = localStorageService.get('token');
        $scope.id=$state.params.id;
        $scope.getRule = getRule;
        init();
        function init() {
            getRule();
        }
        //常见问题
        function getRule() {
            loadingShow('加载中...');
            var options={
                token:token,
                id:$scope.id
            };
            yikePcdd.getOddsRule(options)
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
