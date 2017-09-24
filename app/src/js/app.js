'use strict';

angular.module('myApp', ['ui.router', 'ngMessages'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .when("", "/main/jqValid")
            .when("/", "/main/jqValid")
            .when("/main", "/main/jqValid");

        $stateProvider
            .state("main", {
                url: "/main",
                templateUrl: "views/index.html",
                controller: "MainCtrl"
            })
            .state("main.ngValid", {
                url: "/ngValid",
                templateUrl: "views/angular-validation.html",
                controller: "NgValidCtrl"
            })
            .state("main.jqValid", {
                url: "/jqValid",
                templateUrl: "views/jquery-validation.html",
                controller: "JqValidCtrl"
            })
            .state("main.formValid", {
                url: "/formValid",
                templateUrl: "views/form-validation.html",
                controller: "FormValidCtrl"
            })
            .state("main.selfValid", {
                url: "/selfValid",
                templateUrl: "views/self-validation.html",
                controller: "NgValidCtrl"
            });
    });