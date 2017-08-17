/**
 * Created by frank on 2016/11/14.
 */
(function () {
    'use strict';

    angular
        .module('member.list.controller', [])
        .controller('MemberListCtrl', MemberListCtrl);

    MemberListCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function MemberListCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.memberList=memberList;
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.memberDetail = memberDetail;
        $scope.userType=[   //用户类型
            {title:'会员',id:0},
            {title:'代理',id:1},
            {title:'全部',id:2}
        ];
        $scope.onlineState=[   //用户类型
            {state:'下线',id:0},
            {state:'在线',id:1},
            {state:'全部',id:2}
        ];
        $scope.member={
            name:'',  //用户账号
            userTypeId:$scope.userType[2].id, //用户类型id
            onlineId:$scope.onlineState[2].id //在线状态id
        };
        var page=1;
        $scope.records=[];
        init();
        function init() {
        }
        /*出当前路由地址的时候，让isson为noson*/
        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.closeModal();
            $ionicHistory.clearCache();
        });
        $ionicModal.fromTemplateUrl(tepPre+'model/member-list-detail.html',{
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(r) {
            $scope.record_details=r;
            memberDetail();
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();

        };
        //下拉刷新
        function refresh() {
            page=1;
            memberList();
        }

        //上拉加载
        function loadMore() {
            memberList();
        }
       //会员列表
        function memberList() {
            loadingShow('加载中...');
            var options={
                token:token,
                page:page,
                name:$scope.member.name,
                type:$scope.member.userTypeId,
                isOnline:$scope.member.onlineId
            };
            yikePcdd.memberLists(options)
                .then(function (data) {
                    if(page == 1){
                        $scope.records=data.info.member;
                    }else{
                        $scope.records=$scope.records.concat(data.info.member);
                    }
                    $scope.noMoreItemsAvailable = $scope.records.length >= Number(data.info.total);
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                },function () {
                    $scope.records=[];
                    $scope.noMoreItemsAvailable = true;
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }


        //会员详情
        function memberDetail(){
            var options={
                token:token,
                memberId:$scope.record_details.uid
            };
            yikePcdd.memberDetail(options)
                .then(function (data) {
                    $scope.recordDtail=data.info;
                    $scope.$digest();
                });
        }
    }
})();
