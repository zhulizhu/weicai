/**
 * Created by frank on 2016/11/23.
 */
(function () {
    'use strict';

    angular
        .module('modified.data.controller', [])
        .controller('ModifiedDataCtrl', ModifiedDataCtrl);

    ModifiedDataCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function ModifiedDataCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.user={
            name:'',
            autograph:''
        };
        $scope.modificatioInformation=modificatioInformation;
        init();
        function init() {
            loadingShow('加载中...');
            //获取个人信息
            var options={
                token:token
            };
            yikePcdd.userinfo(options)
                .then(function (data) {
                   $scope.userinfo=data.info;
                    if(data.info.nickname != null || data.info.nickname != ''){
                        $scope.user.nickname=data.info.nickname;
                    }
                    if(data.info.autograph != null || data.info.autograph != ''){
                        $scope.user.autograph=data.info.autograph;
                    }
                    $scope.$digest();
                })
        }
        // 修改个人资料
        function modificatioInformation() {
            if ($scope.user.nickname == '') {
                $yikeUtils.toast('请先输入昵称');
            }else {
                loadingShow('加载中...');
                var options={
                    token:token,
                    nickname:$scope.user.nickname,
                    autograph:$scope.user.autograph
                };
                yikePcdd.modificatioInformation(options)
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $ionicHistory.goBack();
                    })
            }
        }
    }
})();
