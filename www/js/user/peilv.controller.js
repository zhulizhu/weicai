/**
 * Created by HL on 2017/1/18.
 */
(function () {
  'use strict';

  angular
    .module('peilv.controller', [])
    .controller('PeilvCtrl',PeilvCtrl);

  PeilvCtrl.$inject = ['$scope','$sce','$state','$ionicLoading'];
  /* @ngInject */
  function PeilvCtrl($scope,$sce,$state,$ionicLoading){
      var room_id=$state.params.room_id;
    init();
    function init(){
        loadingShow('加载中...');
      yikePcdd.luck28OddsExplain(room_id)
          .then(function (data) {
            var pattern1=/&lt;/gim;
            var pattern2=/&gt;/gim;
            var pattern3=/&quot;/gim;
            data.result.introduce=data.result.introduce.replace(pattern1,'<');
            data.result.introduce=data.result.introduce.replace(pattern2,'>');
            data.result.introduce=data.result.introduce.replace(pattern3,'"');
            data.result.introduce =$sce.trustAsHtml(data.result.introduce);
            $scope.content=data.result.introduce;
            $scope.$digest();
          })
    }

  }
})();
