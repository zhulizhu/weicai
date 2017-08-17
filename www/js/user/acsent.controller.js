/**
 * Created by HL on 2017/1/23.
 */
(function () {
  'use strict';

    angular

    .module('acsent.controller', [])

    .controller('acsentCtrl', acsentCtrl);
    acsentCtrl.$inject = ['$scope','$ionicLoading','localStorageService'];
  /* @ngInject */
  function acsentCtrl($scope,$ionicLoading,localStorageService){
    var token=localStorageService.get('token');
    $scope.time=moment().format('YYYY-MM-DD');
    init();
    function init() {
      backwater();
    }
    //时间选择
    $(function () {
      var currYear = (new Date()).getFullYear();
      var currMonth = (new Date()).getMonth();
      var currDate = (new Date()).getDate();
      var opt={};
      opt.date = {preset : 'date',minDate: new Date(currYear-1,0,1), maxDate: new Date(currYear,currMonth,currDate), stepMinute: 5};
      opt.default = {
        theme: 'sense-ui', //皮肤样式
        display: 'modal', //显示方式
        mode: 'scroller', //日期选择模式
        lang:'zh',
        onSelect:function () {
          $scope.time=$(".time").val();
          backwater();
        }
      };
      $(".time").scroller('destroy').scroller($.extend(opt['date'], opt['default']));
      $(".time").val(moment().format('YYYY-MM-DD'));
    });
    function backwater(){
      yikePcdd.returnwater(token,$scope.time)
      .then(function(data){
        for(var i=0;i<data.result.result.length;i++){
         if(data.result.result[i].project == 1){
           data.result.result[i].project= '彩票'
         }else if(data.result.result[i].project == 2){
           data.result.result[i].project= '红包'
         }else if(data.result.result[i].project == 3){
           data.result.result[i].project = '幸运28'
         }else if(data.result.result[i].project == 4){
           data.result.result[i].project = 'K3'
         }else if(data.result.result[i].project == 5){
           data.result.result[i].project = '六合彩'
         }else if(data.result.result[i].project == 6){
           data.result.result[i].project = 'PK10'
         }else if(data.result.result[i].project == 7){
           data.result.result[i].project = '加拿大28'
         }else if(data.result.result[i].project == 8){
           data.result.result[i].project = '重庆时时彩'
         }
        }
        $scope.records=data.result.result;
        $scope.$digest();
      },function () {
        $scope.records=[];
        $scope.$digest();
      })
    }
  }
})();
