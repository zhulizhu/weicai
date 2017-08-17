/**
 * Created by frank on 2017/1/20.
 */
(function () {
    'use strict';

    angular
        .module('ascent.ruler.controller', [])
        .controller('AscentRulerCtrl', AscentRulerCtrl);

    AscentRulerCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function AscentRulerCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){

        init();
        function init() {
            loadingHideShow('加载中...',3000);
            yikePcdd.accountBackwater()
                .then(function (data) {
                    $scope.backwater=data.result.result;
                    $scope.back_type=data.result.back_type;
                    $scope.pattern1=/&lt;/gim;
                    $scope.pattern2=/&gt;/gim;
                    $scope.pattern3=/&quot;/gim;
                    data.result.desc=data.result.desc.replace($scope.pattern1,'<');
                    data.result.desc=data.result.desc.replace($scope.pattern2,'>');
                    data.result.desc=data.result.desc.replace($scope.pattern3,'"');
                    data.result.desc =$sce.trustAsHtml(data.result.desc);
                    $scope.desc=data.result.desc;
                    $scope.$digest();
                })
        }

    }
})();
