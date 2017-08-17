/**
 * Created by frank on 2016/8/31.
 */
(function () {
    'use strict';

    angular
        .module('home.controller', [])
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope','$yikeUtils','$rootScope','$location','$ionicModal','localStorageService','$ionicPopup','$state','$ionicScrollDelegate','$sce'];
    /* @ngInject */
    function HomeCtrl($scope,$yikeUtils,$rootScope,$location,$ionicModal,localStorageService,$ionicPopup,$state,$ionicScrollDelegate,$sce){
        var token=localStorageService.get('token');
        var pc_ggshow=localStorageService.get('pc_ggshow');
        var hint=localStorageService.get('hint');
        $scope.newWin=newWin;
        $scope.isLogin=isLogin;
        isson='son';
        $scope.$on('$ionicView.beforeLeave',function () {
            clearInterval(djsTime.indexTime);
            $scope.closeHomeServe();
            document.removeEventListener('webkitvisibilitychange',visibilitychangePeriods,false);
        });
        init();
        function init() {
            //登陆显示公告
            if(pc_ggshow && pc_ggshow == 1){
                var pattern1=/&lt;/gim;
                var pattern2=/&gt;/gim;
                var pattern3=/&quot;/gim;
                yikePcdd.loginAnnounce({token:token})
                    .then(function (data) {
                        data.info.content=data.info.content.replace(pattern1,'<');
                        data.info.content=data.info.content.replace(pattern2,'>');
                        data.info.content=data.info.content.replace(pattern3,'"');
                        data.info.content =$sce.trustAsHtml(data.info.content);
                        var alertPopup = $ionicPopup.alert({
                            title: data.info.title,
                            template:data.info.content ,
                            okText:'朕知道了'
                        });
                        alertPopup.then(function() {
                            localStorageService.set('pc_ggshow',0);
                        });
                    })
            }
            //客服二维码
            yikePcdd.serveCode()
                .then(function (data) {
                    $scope.home_serve=data.info;
                    $scope.$digest();
                });
            banner();
            dContent();
            newWin();
            gameList();
            if(!indexFlag){
                document.addEventListener("webkitvisibilitychange", visibilitychangePeriods, false);
                indexFlag=true;
            }
        }
        /*确认注单*/
        $ionicModal.fromTemplateUrl(tepPre+'model/home_kf.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.homeServe = modal;
            $rootScope.closeHomeServe=modal;
        });
        $scope.openHomeServe= function() {
            $scope.homeServe.show();
        };
        $scope.closeHomeServe = function() {
            $scope.homeServe.hide();
        };
        function visibilitychangePeriods(e) {
            if($location.path() == '/tab/home'){
                if(!document.hidden){
                    clearInterval(djsTime.indexTime);
                }else{
                    gameList();
                }
            }
            e.preventDefault();
        }
        //首页banner图
        function banner() {
            $scope.banners=$rootScope.tabCache.banner;
            var options={
                token:token
            };
            yikePcdd.banner(options)
                .then(function (data) {
                    $scope.banners=data.info;
                    $rootScope.tabCache.banner=data.info;
                    $scope.$digest();
                    new Swiper('.index-swiper-container', {
                        pagination: '.swiper-pagination',
                        autoplay:2000,
                        paginationClickable: true,
                        autoplayDisableOnInteraction:false,
                        observer: true,//修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true//修改swiper的父元素时，自动初始化swiper
                    });
                })
        }
        //游戏列表
        function gameList() {
            $scope.gameLists=$rootScope.tabCache.lottery;
            var options={
                token:token
            };
            yikePcdd.gameList(options)
                .then(function (data) {
                    $scope.gameLists=data.info;
                    $rootScope.tabCache.lottery=data.info;
                    closingTime();
                    $scope.$digest();
                });
        }
        //开奖倒计时
        function closingTime(){
            clearInterval(djsTime.indexTime);
            djsTime.indexTime=setInterval(function(){
                //封盘倒计时
                AV._.each($scope.gameLists,function (game) {
                    if(game.diffTime > 0){
                        $scope.hour = Math.floor(game.diffTime / (60 * 60));
                        $scope.minute= Math.floor((game.diffTime / 60) % 60);
                        $scope.second = Math.floor(game.diffTime % 60);
                        if ($scope.second <= 9) $scope.second = '0' + $scope.second;
                        if ($scope.hour <= 9) $scope.hour = '0' + $scope.hour;
                        if ($scope.minute <= 9) $scope.minute = '0' + $scope.minute;
                        game.closeTime=$scope.hour+':'+$scope.minute+':'+$scope.second;
                    }else{
                        gameList();
                    }
                    game.diffTime--;
                });
                $scope.$digest();
            }, 1000);
        }
        //最新中奖
        function newWin() {
            $scope.news=$rootScope.tabCache.news;
            if($rootScope.tabCache.news.length == 0){
                loadingHideShow('加载中...',3000);
            }
            var options={
                token:token
            };
            yikePcdd.newWin(options)
                .then(function (data) {
                    $scope.news=data.info;
                    $rootScope.tabCache.news=data.info;
                    $scope.$digest();
                    new Swiper(".newest-swiper-container",{
                        autoplay:1500,
                        direction:"vertical",
                        slidesPerView: 5,
                        observer:true,
                        observeParents:true
                    });
                })
        }
        //平台公告
        function dContent() {
            $scope.dContent=$rootScope.tabCache.notice;
            var options={
                token:token,
                page:1
            };
            yikePcdd.dIndexContent(options)
                .then(function(data){
                    $scope.dContent = data.info;
                    $rootScope.tabCache.notice = data.info;
                    $scope.$digest();
                    new Swiper(".container-note",{
                        autoplay:1500,
                        loop:true,
                        direction:"vertical",
                        observer:true,
                        observeParents:true
                    });
                });
        }
        //判断是否登录
        function isLogin(url,parameter) {
            if(token){
                $state.go(url,parameter);
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '请先登录',
                    buttons:[{
                        text:'确定',
                        type: 'button-positive'
                    }]
                });
                alertPopup.then(function() {
                    $state.go('login');
                });
            }
        }
    }
})();
