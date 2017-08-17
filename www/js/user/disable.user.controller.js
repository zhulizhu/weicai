/**
 * Created by frank on 2017/7/25.
 */
(function () {
    'use strict';

    angular
        .module('disable.user.controller', [])
        .controller('DisableUserCtrl', DisableUserCtrl);

    DisableUserCtrl.$inject = ['$scope'];
    /* @ngInject */
    function DisableUserCtrl($scope){

        init();
        function init() {}

    }
})();
