
/**
 * Created by frank on 2016/11/14.
 */
(function () {
    'use strict';

    angular
        .module('add.referral.links.controller', [])
        .controller('AddReferralLinksCtrl', AddReferralLinksCtrl);

    AddReferralLinksCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function AddReferralLinksCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.addLink=addLink;
        $scope.userType=[   //用户类型
            {title:'会员',id:3},
            {title:'代理',id:1}
        ];
        $scope.addDate={
            userTypeId:$scope.userType[0].id, //用户类型
            maxNumber:'',
            fandian:''
        };
        init();
        function init() {}
        function addLink(){
            if($scope.addDate.maxNumber=='' || $scope.addDate.maxNumber==null){
                $yikeUtils.toast('请输入使用最大次数');
            }
            else if(($scope.addDate.fandian=='' || $scope.addDate.fandian==null) && $scope.userType.id == 1){
                $yikeUtils.toast('请输入返点');
            }else{
                var options={
                    token:token,
                    type:$scope.addDate.userTypeId,
                    fanDian:$scope.addDate.fandian,
                    maxAdd:$scope.addDate.maxNumber
                };
                loadingShow('加载中...');
                yikePcdd.addLink(options)
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $scope.$digest();
                        $state.go('referral-links');
                        $scope.addDate.maxNumber=[];
                        $scope.addDate.fandian=[];
                    },function(){
                        $scope.addDate.maxNumber=[];
                        $scope.addDate.fandian=[];
                    });
            }

        }



    }
})();
