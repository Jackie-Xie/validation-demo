angular.module('myApp')
    .controller('JqValidCtrl', ['$scope', '$location', function($scope, $location) {
        'use strict';

        $scope.$parent.state.pathStr = $location.path();

        $scope.state = {
            roleOptions: [{
                    id: 1,
                    name: 'BackupRole',
                    cnName: '备份管理员',
                    _status: false
                },
                {
                    id: 2,
                    name: 'AuditRole',
                    cnName: '审计管理员',
                    _status: false
                },
                {
                    id: 3,
                    name: 'RecoverRole',
                    cnName: '恢复管理员',
                    _status: false
                },
                {
                    id: 4,
                    name: 'ActiveRole',
                    cnName: '活动站点管理员',
                    _status: false
                },
                {
                    id: 5,
                    name: 'AdminRole',
                    cnName: '系统管理员',
                    _status: false
                },
                {
                    id: 6,
                    name: 'MonitorRole',
                    cnName: '监控管理员',
                    _status: false
                }
            ],
        };

    }]);