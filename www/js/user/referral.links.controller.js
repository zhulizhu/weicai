
/**
 * Created by frank on 2016/11/14.
 */
(function () {
    'use strict';

    angular
        .module('referral.links.controller', [])
        .controller('ReferralLinksCtrl', ReferralLinksCtrl);

    ReferralLinksCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicViewSwitcher','$ionicLoading','$sce'];
    /* @ngInject */
    function ReferralLinksCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicViewSwitcher,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.select=select;
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.urlContent=urlContent;
        $scope.deletLink =deletLink;
        $scope.wxcopy = wxcopy;
        $scope.state={
            id:1
        };
        init();
        function init() {
            select(1);
        }
        var page=1;
        $scope.records=[];
        function select(typeId){
            $scope.state.id=typeId;
            refresh();
        }
        //下拉刷新
        function refresh() {
            page=1;
            memberList();
        }

        //上拉加载
        function loadMore() {
            memberList();
        }
        //切换代理和会员列表
        function memberList(){
            loadingShow('加载中...');
            var options={
                token:token,
                page:page,
                type:$scope.state.id
            };
            yikePcdd.linkList(options)
                .then(function (data) {
                    if(page == 1){
                            $scope.records=data.info.data;
                    }else{
                            $scope.records=$scope.records.concat(data.info.data);
                    }
                    $scope.noMoreItemsAvailable = $scope.records.length >= Number(data.info.total);

                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },function () {
                    $scope.records=[];
                    $scope.noMoreItemsAvailable=true;
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });

        }
        //复制链接

        function  urlContent(content){
            try{
                cordova.plugins.clipboard.copy(content);
                $yikeUtils.toast('复制成功');
            }catch (err){
                $yikeUtils.toast('复制失败');
            }
        }
        //删除链接
        function deletLink(id,index){
            var comfirmPopup = $ionicPopup.confirm({
                title: '删除链接',
                template: '确认要删除？',
                okText: '确定',
                cancelText: '取消',
                cssClass:'confirm-style'
            });
            comfirmPopup.then(function (res) {
                if (res) {
                    loadingShow('加载中...');
                    var options={
                        token:token,
                        id:id
                    };
                    yikePcdd.deleteLink(options)
                        .then(function (data) {
                            $yikeUtils.toast(data.msg);
                            $scope.records.splice(index,1);
                            $scope.$digest();
                        });
                }
            });
        }

        //网站复制
        function wxcopy(content) {
            if(iosis && PLATFORM == 'wap'){
                $yikeUtils.toast('ios暂不支持复制');
                return;
            }
            var save = function(e){
                e.clipboardData.setData('text/plain', content);
                e.preventDefault();
            };
            document.addEventListener('copy', save);
            document.execCommand('copy');
            document.removeEventListener('copy',save);
            $yikeUtils.toast('复制成功');
        }





    }
})();
