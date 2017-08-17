/**
 * Created by frank on 2016/11/12.
 */
(function () {
  'use strict';

  angular
    .module('alipay.transfer.controller', [])
    .controller('AlipayTransferCtrl', AlipayTransferCtrl);

  AlipayTransferCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$rootScope','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
  /* @ngInject */
  function AlipayTransferCtrl($scope,$yikeUtils,$state,$ionicHistory,$rootScope,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
    var token=localStorageService.get('token');
    $scope.wxcopy = wxcopy;
    var id=$state.params.id;
    init();
    function init() {
      yikePcdd.rechargeMsg({token:token,id:id})
        .then(function(data){
          $scope.account=data.info;
          $scope.$digest();
        });
    }
    //复制
    $scope.copy=copy;
    function copy(content) {
        try{
            cordova.plugins.clipboard.copy(content);
            $yikeUtils.toast('复制成功');
        }catch (err){
            $yikeUtils.toast('复制失败');
        }
    };
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
    $scope.formValue={
      name:'',
      account:'',
      money:''
    };
    $scope.submit=submit;
    /*正则验证*/
    var reg= /^[^\u4e00-\u9fa5]{0,}$/;
    function submit(){
      if($scope.formValue.name=='' || $scope.formValue.name==null){
        $yikeUtils.toast('请输入用户名');
      }else if($scope.formValue.account=='' || $scope.formValue.account==null){
       $yikeUtils.toast('请输入账号');
      }else if(!reg.test($scope.formValue.account)){
        $yikeUtils.toast('请输入正确的账号');
      }else if($scope.formValue.money=='' || $scope.formValue.money==null){
        $yikeUtils.toast('请输入金额');
      }else if(Number($scope.formValue.money) < Number($scope.account.rechargeMin)){
        $yikeUtils.toast('最小充值金额为'+$scope.account.rechargeMin);
      }else if(Number($scope.formValue.money) > Number($scope.account.rechargeMax)){
        $yikeUtils.toast('最高充值金额为'+$scope.account.rechargeMax);
      }else {
          var options={
              token:token,
              accountName:$scope.formValue.name,
              Account:$scope.formValue.account,
              amount:$scope.formValue.money,
              Pre_paid:$scope.account.mode_id,
              receiver:id
          };
          loadingShow('加载中...');
        yikePcdd.payss(options)
          .then(function(data){
            $yikeUtils.toast(data.msg);
              $scope.formValue={name:'', account:'', money:''};
              $ionicHistory.goBack();
          })
      }
    }
  }
})();
