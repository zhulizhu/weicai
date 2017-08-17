/**
 * Created by frank on 2016/11/14.
 */
(function () {
    'use strict';

    angular
        .module('add.member.controller', [])
        .controller('AddMemberCtrl', AddMemberCtrl);

    AddMemberCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function AddMemberCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.memberaddMember=memberaddMember;
        $scope.userType=[   //用户类型
            {title:'会员',id:0},
            {title:'代理',id:1}
        ];
        $scope.member={
            userTypeId:$scope.userType[0].id,  //用户类型id
            name:'',  //登录账号
            passWord:'',
            fandian:'',
            coinPassword:''
        };

        init();
        function init() {

        }
        //新增会员
        function memberaddMember() {
            if ($scope.member.name == '' || $scope.member.name == null) {

                $yikeUtils.toast('请填写登录账号');
                return false;

            }
            else if ($scope.member.name.length < 6) {

                $yikeUtils.toast('登录账号至少6位数');
                return false;

            }
            else if ($scope.member.passWord == '' || $scope.member.passWord == null) {

                $yikeUtils.toast('请填写登录密码');
                return false;

            }
            else if ($scope.member.passWord.length < 6) {

                $yikeUtils.toast('登录密码至少6位数');
                return false;

            }
            else if (($scope.member.fandian == '' || $scope.member.fandian == null) && $scope.member.userTypeId == 2) {
                $yikeUtils.toast('请填写返点');
                return false;

            }
            else if ($scope.member.coinPassword == '' || $scope.member.coinPassword == null) {

                $yikeUtils.toast('请填写提款密码');
                return false;

            }
            else if ($scope.member.coinPassword == $scope.member.passWord) {

                $yikeUtils.toast('提款密码和登录密码不能相同');
                return false;

            }
            else if ($scope.member.coinPassword.length < 6) {
                $yikeUtils.toast('提款密码至少6位数');
                return false;

            } else {
                loadingShow('加载中...');
                var options ={
                    token:token,
                    type:$scope.member.userTypeId,
                    username:$scope.member.name,
                    password:$scope.member.passWord,
                    fanDian:$scope.member.fandian,
                    coinPassword:$scope.member.coinPassword
                };
                yikePcdd.memberaddMember(options)
                    .then(function (data) {
                        $yikeUtils.toast(data.msg);
                        $scope.member.name='';
                       $scope.member.passWord='';
                        $scope.member.fandian='';
                        $scope.member.coinPassword='';
                        $scope.$digest();
                    })
            }
        }



    }
})();
