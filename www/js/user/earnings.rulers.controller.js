/**
 * Created by HL on 2017/1/25.
 */
(function () {
  'use strict';

  angular
    .module('earnings.rulers.controller',[])
    .controller('EarningsRulersCtrl',EarningsRulersCtrl);

  EarningsRulersCtrl.$inject = ['$scope','$ionicLoading','$sce'];
  function EarningsRulersCtrl($scope,$ionicLoading,$sce) {
    init();
    function init() {
        loadingShow('加载中...');
      yikePcdd.fengxiang()
        .then(function(data){
          var pattern1=/&lt;/gim;
          var pattern2=/&gt;/gim;
          var pattern3=/&quot;/gim;
          data.result.result.content=data.result.result.content.replace(pattern1,'<');
          data.result.result.content=data.result.result.content.replace(pattern2,'>');
          data.result.result.content=data.result.result.content.replace(pattern3,'"');
          data.result.result.content =$sce.trustAsHtml(data.result.result.content);
          $scope.data=data.result.result.content;
          $scope.$digest();
        })
    }
  }
})();
