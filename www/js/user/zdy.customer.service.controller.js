/**
 * Created by frank on 2016/12/22.
 */
(function () {
    'use strict';

    angular
        .module('zdy.customer.service.controller', [])
        .controller('ZdyCustomerServiceCtrl', ZdyCustomerServiceCtrl);

    ZdyCustomerServiceCtrl.$inject = ['$scope','$yikeUtils','$state', '$sce'];
    /* @ngInject */
    function ZdyCustomerServiceCtrl($scope,$yikeUtils,$state, $sce){
        var url = kf;
        $scope.url = $sce.trustAsResourceUrl(url);

        init();
        // $scope.go = function () {
        //     $("#content").contents().find("footer").next().next().remove();
        // };
        function init() {}

    }
})();