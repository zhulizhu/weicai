/**
 * Created by frank on 2016/11/23.
 */
(function () {
    'use strict';

    angular
        .module('debt.record.controller', [])
        .controller('DebtRecordCtrl', DebtRecordCtrl);

    DebtRecordCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function DebtRecordCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.refresh=refresh;
        $scope.loadMore=loadMore;
        $scope.accountChangeRecord=accountChangeRecord;
        $scope.coinDetail = coinDetail;
        var page=1;
        $scope.records=[];
        init();
        function init() {
        }
        /*出当前路由地址的时候，让isson为noson*/
        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.closeModal();
        });
        $ionicModal.fromTemplateUrl(tepPre+'model/debit-record-details.html',{
          scope: $scope,
          animation: 'none'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function(r) {
            $scope.record_details=r;
            coinDetail();
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();

        };
      //下拉刷新
        function refresh() {
            page=1;
            accountChangeRecord();
        }

        //上拉加载
        function loadMore() {
            accountChangeRecord();
        }
        //账变记录
        function accountChangeRecord() {
            var options={
                token:token,
                page:page
            };
            yikePcdd.accountChangeRecord(options)
                .then(function (data) {
                    if(page == 1){
                        $scope.records=data.info.all;
                    }else{
                        $scope.records=$scope.records.concat(data.info.all);
                    }
                    $scope.noMoreItemsAvailable = $scope.records.length >= Number(data.info.total);
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                },function () {
                    $scope.noMoreItemsAvailable = true;
                    $scope.$digest();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }
        //账变记录详情
        function coinDetail() {
            loadingShow('加载中...');
            var options={
                token:token,
                coinId:$scope.record_details.id
            };
            yikePcdd.coinDetail(options)
                .then(function (data) {
                    $scope.recordDtail=data.info;
                    $scope.$digest();
                });
        }
    }
})();
