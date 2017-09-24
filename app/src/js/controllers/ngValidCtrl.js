angular.module('myApp')
    .controller('NgValidCtrl', ['$scope', '$http', '$location', 'AutoValid', function($scope, $http, $location, AutoValid) {
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
            // 验证的字段
            propers: [
                'userName',
                'pwd',
                'repeatPwd',
                'email',
                'phone',
                'role'
            ],
            // 新增用户验证字段和方法
            addObj: {
                'userName': 'validUserName',
                'pwd': 'validPwd',
                'repeatPwd': 'validRepeatPwd',
                'email': 'validEmail',
                'phone': 'validPhone'
            },
            pwdReg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,25}$/,
            phoneReg: /^(1[3|4|5|7|8]\d{9})|(\(\d{3,4}\)|\d{3,4}-|\s){1}\d{7,14}$/,
            selectedNum: 0,
            $dirty: false
        };

        $scope.userForm = {};

        // self validation init
        $scope.valid = AutoValid;
        $scope.valid.init($scope.state.propers);

        // total valid
        $scope.clickVerify = function(ev) {
            console.log($scope.state.roleOptions);
            var it = $(ev.target);
            if (it.hasClass('disabled')) { return };
            it.addClass('disabled');

            it.removeClass('disabled');
            // todo something
            return $scope.valid.do($scope.state.addObj, $scope);
        };

        // 获取所有用户名
        $scope.getUsers = function() {
            $http.get('/apis/users').then(function(res) {
                $scope.userNames = res.data;
            });
        };
        $scope.getUsers();

        /**
         * ngValidation 点击验证
         */
        $scope.clickNgVerify = function(ev) {
            var it = $(ev.target);
            if (it.hasClass('disabled')) { return };
            it.addClass('disabled');
            // todo something
            console.log($scope.userForm);
            it.removeClass('disabled');
        };

        /**
         * 多选框验证
         */
        $scope.changeSelected = function(item) {
            item._status = !item._status;
            $scope.state.$dirty = true;
            item._status ? $scope.state.selectedNum++ : $scope.state.selectedNum--;
            console.log($scope.state.selectedNum);
        };

        /**
         * 验证相关的方法
         */
        angular.extend($scope, {
            // 验证用户名
            validUserName: function() {
                if (!$scope.userForm.userName) {
                    return '用户名不能为空';
                }
                if (!$scope.valid.utils.validLength($scope.userForm.userName, { maxLen: 20 })) {
                    return '用户名不超过20个字符（中文占2个字符哦）';
                }
                var ret = $scope.valid.utils.validSign($scope.userForm.userName);
                if (!ret.status) {
                    return '用户名' + ret.error;
                }
                if ($scope.userNames.indexOf($scope.userForm.userName) > -1) {
                    return '用户名已被注册';
                }
                return '';
            },
            // 验证密码
            validPwd: function() {
                if (!$scope.userForm.pwd) {
                    return '密码不能为空';
                }
                if (!$scope.valid.utils.isPassword($scope.userForm.pwd)) {
                    return '密码为8-25位数字和字母组合';
                }
                if ($scope.userForm.pwd === $scope.userForm.userName) {
                    return '密码不能和用户名相同';
                }
                if ($scope.userForm.repeatPwd) {
                    if ($scope.userForm.pwd !== $scope.userForm.repeatPwd) {
                        return '两次密码输入不一致';
                    } else {
                        $scope.valid.repeatPwd.ok = true;
                        $scope.valid.repeatPwd.err = '';
                    }
                }
                return '';
            },
            // 验证确认密码
            validRepeatPwd: function() {
                if (!$scope.userForm.repeatPwd) {
                    return '请输入确认密码';
                }
                if (!$scope.valid.utils.isPassword($scope.userForm.repeatPwd)) {
                    return '密码为8-25位数字和字母组合';
                }
                if ($scope.userForm.repeatPwd === $scope.userForm.userName) {
                    return '密码不能和用户名相同';
                }
                if ($scope.userForm.pwd) {
                    if ($scope.userForm.repeatPwd !== $scope.userForm.pwd) {
                        return '两次密码输入不一致';
                    } else {
                        $scope.valid.pwd.ok = true;
                        $scope.valid.pwd.err = '';
                    }
                }
                return '';
            },
            // 验证邮箱
            validEmail: function() {
                if (!$scope.userForm.email) {
                    return '邮箱地址不能为空';
                }
                if (!$scope.valid.utils.isEmail($scope.userForm.email)) {
                    return '邮箱地址格式有误';
                }
                return '';
            },
            // 验证手机号码
            validPhone: function() {
                if (!$scope.userForm.phone) {
                    return '手机号码不能为空';
                }
                if (!$scope.valid.utils.isPhone($scope.userForm.phone)) {
                    return '手机号码格式有误';
                }
                return '';
            },
            // 验证用户权限
            validRole: function(item) {
                item._status = !item._status;
                $scope.valid.role.dirty = true;
                var selected = $scope.state.roleOptions.filter(function(item) {
                    return item._status;
                });
                if (selected.length === 0) {
                    $scope.valid.role.err = '请至少选择一种角色';
                    $scope.valid.role.ok = false;
                } else {
                    $scope.valid.role.err = '';
                    $scope.valid.role.ok = true;
                }
                return $scope.valid.role.ok;
            },

        });

    }]);