/**
 * Created by frank on 2016/11/23.
 */
(function () {
    'use strict';

    angular
        .module('deposit.record.controller', [])
        .controller('DepositRecordCtrl', DepositRecordCtrl);

    DepositRecordCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function DepositRecordCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.Withdraw_veiw = Withdraw_veiw;
        $scope.withdrawalRecord = withdrawalRecord;
        var page=1;
        $scope.records=[];
        init();
        function init() {}
        //下拉刷新
        function refresh() {
            page=1;
            withdrawalRecord();
        }
        /*出当前路由地址的时候，让isson为noson*/
        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.closeModal();
        });
        $ionicModal.fromTemplateUrl(tepPre+'model/deposit-record-detail.html',{
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(r) {
            $scope.record_details=r;
            Withdraw_veiw();
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();

        };
        //上拉加载
        function loadMore() {
            withdrawalRecord();
        }
        //提现记录
        function withdrawalRecord() {
            var options={
                token:token,
                p:page
            };
            yikePcdd.Withdraw_record(options)
                .then(function (data) {

                    for(var i=0; i< data.info.list.length;i++){
                        if(data.info.list[i].state == 1){
                            data.info.list[i].state='用户申请';
                        }
                        else if(data.info.list[i].state == 2){
                            data.info.list[i].state='已取消';
                        }
                        else if(data.info.list[i].state == 3){
                            data.info.list[i].state='已支付';
                        }
                        else if(data.info.list[i].state == 4){
                            data.info.list[i].state='提现失败';
                        }
                        else if(data.info.list[i].state == 5){
                            data.info.list[i].state='后台删除';
                        }
                        else if(data.info.list[i].state == 6){
                            data.info.list[i].state='处理超时';
                        }
                        else{
                            data.info.list[i].state='确认到帐';
                        }
                    }
                    if(page == 1){
                        $scope.records=data.info.list;
                    }else{
                        $scope.records=$scope.records.concat(data.info.list);
                    }
                    $scope.noMoreItemsAvailable = $scope.records.length >= Number(data.info.count);
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                },function () {
                    $scope.noMoreItemsAvailable = true;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
        }
        //提现记录详情
        function Withdraw_veiw(){
            var options={
                token:token,
                id:$scope.record_details.id
            };
            yikePcdd.Withdraw_veiw(options)
                .then(function (data) {
                    $scope.Withdraw=data.info;

                    if($scope.Withdraw.state == 1){
                        $scope.Withdraw.state='用户申请';
                    }
                    else if($scope.Withdraw.state == 2){
                        $scope.Withdraw.state='已取消';
                    }
                    else if($scope.Withdraw.state == 3){
                        $scope.Withdraw.state='已支付';
                    }
                    else if($scope.Withdraw.state == 4){
                        $scope.Withdraw.state='提现失败';
                    }
                    else if($scope.Withdraw.state == 5){
                        $scope.Withdraw.state='后台删除';
                    }
                    else if($scope.Withdraw.state == 6){
                        $scope.Withdraw.state='处理超时';
                    }else{
                        $scope.Withdraw.state='确认到帐';
                    }
                    $scope.$digest();
                },function () {
                    $scope.$digest();

                });
        }

    }
})();
