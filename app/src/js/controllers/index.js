angular.module('myApp')
    .controller('MainCtrl', ['$scope', '$location', function($scope, $location) {
        'use strict';

        $scope.state = {
            tabOpts: {
                'jqValid': 'main.jqValid',
                'formValid': 'main.formValid',
                'ngValid': 'main.ngValid',
                'selfValid': 'main.selfValid',
            },
            pathStr: $location.path(),
            titles: {
                '/main/jqValid': 'jquery-validation',
                '/main/formValid': 'formvalidation',
                '/main/ngValid': 'angular-validation',
                '/main/selfValid': 'self-validation',
            }
        };

    }]);