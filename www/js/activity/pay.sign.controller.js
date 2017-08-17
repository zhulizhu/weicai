
/**
 * Created by john on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('pay.sign.controller', [])
        .controller('paySignCtrl', paySignCtrl);
    paySignCtrl.$inject = ['$scope','$state','$ionicModal','$yikeUtils','$ionicActionSheet','$rootScope','$ionicTabsDelegate','localStorageService','$ionicPopup','$ionicLoading','$sce'];
    /* @ngInject */
    function paySignCtrl($scope,$state,$ionicModal,$yikeUtils,$ionicActionSheet,$rootScope,$ionicTabsDelegate,localStorageService,$ionicPopup,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.id=$state.params.id;
        $scope.activityDetail=activityDetail;
        $scope.daySigns=daySigns;
        $scope.getConsign=getConsign;
        $scope.goSignok=goSignok;
        $scope.classShow=classShow;
        $scope.signSends=signSends;
        init();
        function init() {
            activityDetail();

        }


        /*出当前路由地址的时候，让isson为noson*/
        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.closeModal();
        });
        //签到日历
        $ionicModal.fromTemplateUrl(tepPre+'model/sign-calendar.html',{
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
            daySigns();
            fDrawCal(d_y,d_m);

        };
        $scope.closeModal = function() {
            $scope.modal.hide();

        };
        //签到抽奖
        $ionicModal.fromTemplateUrl(tepPre+'model/get-award.html',{
            scope: $scope,
            animation: 'none'
        }).then(function(modals) {
            $scope.modals = modals;
        });
        $scope.openModals = function() {
                $scope.modals.show();
        };
        $scope.closeModals = function() {
            $scope.modals.hide();

        };
        var d_Date = new Date();			//系统时间对象
        var d_y = d_Date.getFullYear();		//完整的年份
        var d_m = d_Date.getMonth()+1;		//注意获取的月份比实现的小1
        var d_d = d_Date.getDate();
        $scope.dateTime={
            weeksList:['周日','周一','周二','周三','周四','周五','周六'],
            days:[],
            years:d_y,
            currentDay:d_d,
            month:d_m
        };
        $scope.months={
            '1':'一月',
            '2':'二月',
            '3':'三月',
            '4':'四月',
            '5':'五月',
            '6':'六月',
            '7':'七月',
            '8':'八月',
            '9':'九月',
            '10':'十月',
            '11':'十一月',
            '12':'十二月'
        };


        //获取天数
        function fDrawCal(y,m) {
            $scope.dateTime.days=[];
            var temp_d  = new Date(y,m-1,1);
            var first_d = temp_d.getDay(); //返回本月1号是星期几
            temp_d  = new Date(y, m, 0);
            var all_d   = temp_d.getDate();//返回本月共有多少天
            var i_d;
            for(var i=1;i<=42;i++){
                if(first_d<i&&i<=(all_d+first_d)){
                    i_d=i-first_d;//显示出几号
                    $scope.dateTime.days.push(i_d);
                }else{
                    $scope.dateTime.days.push(' ');
                }
            }
        }
        //活动详情
        function activityDetail() {
            loadingShow('加载中...');
            var options={
                token:token,
                id:$scope.id
            };
            yikePcdd.activityDetails(options)
                .then(function (data){
                    $scope.mess=data.info;
                    var pattern1=/&lt;/gim;
                    var pattern2=/&gt;/gim;
                    var pattern3=/&quot;/gim;
                    data.info.content=data.info.content.replace(pattern1,'<');
                    data.info.content=data.info.content.replace(pattern2,'>');
                    data.info.content=data.info.content.replace(pattern3,'"');
                    data.info.content=$sce.trustAsHtml(data.info.content);
                    $scope.content=data.info.content;
                    $scope.$digest();
                })
        }
        //签到日历详情
        function daySigns() {
            loadingShow('加载中...');
            $scope.oldDays=[];
            $scope.oldDay='';
            var options={
                token:token
            };
            yikePcdd.daySign(options)
                .then(function (data){
                    $scope.signs=data.info;
                    $scope.lists=data.info.activity;
                    if($scope.signs.sign!==null && $scope.signs.sign!==''){
                        for(var i=0;i<$scope.signs.sign.length;i++){
                            var oldTime=new Date(parseInt($scope.signs.sign[i].create_time) * 1000);
                            $scope.oldDay=oldTime.getDate();
                            $scope.oldDays.push($scope.oldDay);
                        }
                    }

                    $scope.$digest();
                })
        }
        //领取签到奖励
        function getConsign(id) {
            var options={
                token:token,
                id:id
            };
            yikePcdd.consign(options)
                .then(function (data){
                    $yikeUtils.toast(data.msg);
                    daySigns();
                    $scope.$digest();
                })
        }
        //签到操作
        function goSignok() {
            var options={
                token:token
            };
            yikePcdd.signok(options)
                .then(function (data){
                    $yikeUtils.toast(data.msg);
                    daySigns();
                    $scope.$digest();
                })
        }
        //颜色显示
        function classShow(d){

            if($scope.oldDay!=null && $scope.oldDay!=''){

                for(var i=0;i<=$scope.signs.sign.length;i++){
                    if($scope.oldDays[i]==d ){
                        return 'qiandao';
                    }
                }
                if($scope.dateTime.currentDay == d){
                    return 'day-active';
                }
            }else{
                if($scope.dateTime.currentDay == d){
                    return 'day-active';
                }else{
                    return '';
                }

            }

        }
        //签到抽奖
        function signSends() {
            var options={
                token:token
            };
            yikePcdd.signSend(options)
                .then(function (data){
                    $scope.openModals();
                    $scope.state1=data.status;
                    $scope.messes=data.info;
                    $scope.$digest();
                },function(data){
                    if(data.status==-1){
                        $scope.openModals();
                        $scope.state1=data.status;
                    }else {
                        $yikeUtils.toast(data.msg);
                    }
                })
        }


    }
})();
