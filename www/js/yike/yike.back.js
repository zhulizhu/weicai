(function () {
  'use strict';

  angular
    .module('yike.back', [])
    .directive('yikeBack', YikeBack);

  YikeBack.$inject = ['$ionicHistory','$rootScope'];

  function YikeBack($ionicHistory,$rootScope) {
    var directive = {
      template: ' <button class="button button-clear ion-chevron-left white"></button>',
      link: link,
      replace: true,
      restrict: 'AE'
    };
    return directive;

    function link(scope, element, attrs) {
      element.bind('click', function(e) {
        $ionicHistory.goBack(-1);
        // $rootScope.$ionicGoBack();
      })
    }
  }
})();
