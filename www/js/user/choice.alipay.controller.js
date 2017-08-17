/**
 * Created by HL on 2017/1/12.
 */
(function () {
  'use strict';

    angular
    .module('choicealipay.controller', [])
    .controller('choiceiCtrl', choiceiCtrl);

  choiceiCtrl.$inject = ['$scope','localStorageService','$state'];

  /* @ngInject */
    function choiceiCtrl($scope,localStorageService,$state){
    var token=localStorageService.get('token');
    var id=$state.params.id;
    init();
    function init() {
    yikePcdd.pays({token:token,type:id})
      .then(function(data){
      $scope.account=data.info;
      $scope.$digest();
      })
    }
  }
})();
