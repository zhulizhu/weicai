/**
 * Created by frank on 2016/12/30.
 */
(function () {
    'use strict';

    angular
        .module('registration.protocol.controller', [])
        .controller('RegistrationProtocolCtrl', RegistrationProtocolCtrl);

    RegistrationProtocolCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function RegistrationProtocolCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        init();
        function init() {
            howToPlay();
        }
        //注册协议
        function howToPlay() {
            yikePcdd.registrationProtocol()
                .then(function (data) {
                    var pattern1=/&lt;/gim;
                    var pattern2=/&gt;/gim;
                    var pattern3=/&quot;/gim;
                    data.result.result=data.result.result.replace(pattern1,'<');
                    data.result.result=data.result.result.replace(pattern2,'>');
                    data.result.result=data.result.result.replace(pattern3,'"');
                    data.result.result=$sce.trustAsHtml(data.result.result);
                    $scope.content=data.result.result;
                    $scope.$digest();
                })
        }
    }
})();