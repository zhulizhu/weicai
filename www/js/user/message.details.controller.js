/**
 * Created by frank on 2016/11/25.
 */
(function () {
    'use strict';

    angular
        .module('message.details.controller', [])
        .controller('MessageDetailsCtrl', MessageDetailsCtrl);

    MessageDetailsCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function MessageDetailsCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var id=$state.params.id;
        $scope.type=$state.params.type;
        var token=localStorageService.get('token');
        var pattern1=/&lt;/gim;
        var pattern2=/&gt;/gim;
        var pattern3=/&quot;/gim;
        $scope.titles={
            '0':'消息',
            '1':'公告'
        };
        init();
        function init() {
            if($scope.type == '1'){
                systemMessageDetails();
            }else{
                userMessageDetails();
            }
        }
        //公告详情
        function systemMessageDetails() {
            yikePcdd.platform_advertisement_details({token:token,id:id})
                .then(function (data) {
                    data.info.content=data.info.content.replace(pattern1,'<');
                    data.info.content=data.info.content.replace(pattern2,'>');
                    data.info.content=data.info.content.replace(pattern3,'"');
                    data.info.content =$sce.trustAsHtml(data.info.content);
                    $scope.data=data.info;
                    $scope.$digest();
                })
        }
        //用户详情
        function userMessageDetails() {
            yikePcdd.user_message_details({token:token,id:id})
                .then(function (data) {
                    data.info.content=data.info.content.replace(pattern1,'<');
                    data.info.content=data.info.content.replace(pattern2,'>');
                    data.info.content=data.info.content.replace(pattern3,'"');
                    data.info.content =$sce.trustAsHtml(data.info.content);
                    $scope.data=data.info;
                    $scope.$digest();
                })
        }
    }
})();
