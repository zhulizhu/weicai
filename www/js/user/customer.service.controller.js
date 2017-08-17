/**
 * Created by frank on 2017/1/19.
 */
(function () {
    'use strict';

    angular
        .module('customer.service.controller', [])
        .controller('CustomerServiceCtrl', CustomerServiceCtrl);

    CustomerServiceCtrl.$inject = ['$scope','localStorageService','$ionicLoading','$ionicScrollDelegate','$yikeUtils','$sce'];
    /* @ngInject */
    function CustomerServiceCtrl($scope,localStorageService,$ionicLoading,$ionicScrollDelegate,$yikeUtils,$sce){
        var token=localStorageService.get('token');
        var pattern1=/&lt;/gim;
        var pattern2=/&gt;/gim;
        var pattern3=/&quot;/gim;
        init();
        $scope.news=[];
        $scope.formValue={
        text:''
        };
        function init() {
          //进入页面的渲染
          yikePcdd.servsice()
            .then(function(data){
                data.result.result.index=data.result.result.index.replace(pattern1,'<');
                data.result.result.index=data.result.result.index.replace(pattern2,'>');
                data.result.result.index=data.result.result.index.replace(pattern3,'"');
                data.result.result.index =$sce.trustAsHtml(data.result.result.index);
                $scope.news.push({
                    type:'left',
                    img:'img/home/customer-service.png',
                    name:'系统提示',
                    content:data.result.result.index,
                    time:moment().format('YYYY-MM-DD HH:mm:ss')
                });
              $scope.$digest();
            });
            loadingShow('加载中...');
          yikePcdd.userinfo(token)
            .then(function (data) {
              $scope.userInfo=data.result.result;
              if($scope.userInfo.name != null && $scope.userInfo.name != ''){
                data.result.result.user_name=$scope.userInfo.name;
              }
              $scope.$digest();
            });
        }
         $scope.fasong =function(e){
             if($scope.formValue.text == '' ||　$scope.formValue.text == null){
                 $yikeUtils.toast('请先输入内容');
                 return;
             }
             $scope.news.push({
             type:'right',
             img:$scope.userInfo.img,
             name:$scope.userInfo.user_name,
             content:$scope.formValue.text,
             time:moment().format('YYYY-MM-DD HH:mm:ss')
           });
          yikePcdd.fasong($scope.formValue.text)
          .then(function(data){
              data.result.result=data.result.result.replace(pattern1,'<');
              data.result.result=data.result.result.replace(pattern2,'>');
              data.result.result=data.result.result.replace(pattern3,'"');
              data.result.result =$sce.trustAsHtml(data.result.result);
             setTimeout(function(){
               $scope.news.push({
                 type:'left',
                 img:'img/home/customer-service.png',
                 name:'系统提示',
                 content:data.result.result,
                 time:moment().format('YYYY-MM-DD HH:mm:ss')
               });
               $ionicScrollDelegate.scrollBottom(false);
               $scope.$digest();
             },500);
          });
             $scope.formValue.text ='';
           $ionicScrollDelegate.scrollBottom(false);
             e.preventDefault();
      };
        // //键盘显示时隐藏third-party
        // window.addEventListener('native.keyboardshow',function (e) {
        //     if($("#customer-service-footer")){
        //         $("#customer-service-footer").css("bottom",e.keyboardHeight+'px');
        //     }
        // });
        // //键盘隐藏时显示third-party
        // window.addEventListener('native.keyboardhide', function () {
        //     if($("#customer-service-footer")){
        //         $("#customer-service-footer").css("bottom",0);
        //     }
        // });
    }
})();
