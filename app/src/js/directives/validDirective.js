var app = angular.module('myApp');

app.directive('nameValid', nameValid);
app.directive('equalTo', equalTo);

nameValid.$inject = ['$http', '$q'];

/**
 * @name equalTo
 */
function equalTo() {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function(scope, ele, attrs, ctrl) {
            // console.log(scope); //打印当前作用域 
            // console.log(ele);//打印当前元素
            // console.log(attrs); //打印当前标签属性列表
            // console.log(ctrl); //打印当前ctrl
            var target = attrs["equalTo"]; //获取自定义指令属性键值

            ctrl.$validators.equalTo = function(modelValue, viewValue) { //自定义验证器内容
                target = attrs["equalTo"]; //获取自定义指令属性键值
                if (target) { //判断键是否存在 
                    // 获取当前模型控制器的父控制器FormController
                    var targetCtrl = ctrl.$$parentForm[target]; //获取指定模型控制器
                    // console.log(targetCtrl)
                    var targetValue = targetCtrl.$viewValue; //获取pwd的输入值
                    return targetValue && targetValue == viewValue; //是否等于repeatPwd的值
                }
                return true;
            }

            /* target && scope.$watch(target, function() { //存在启动监听其值
                ctrl.$validate() //每次改变手动调用验证
            }) */

            /* ctrl.$formatters.push(function(value) {
                console.log("正在进行数据格式化的值:", value)
                return value;
            })

            ctrl.$parsers.push(function(value) {
                console.log("正在进行数据转换的值:", value)
                return value;
            }) */

        }
    }
}


/**
 * @name nameValid
 * @param {*} $http
 * @param {*} $q
 * @description 用户名验证
 */
function nameValid($http, $q) {
    var NAME_REG = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, attrs, ctrl) {
            // 同步验证
            ctrl.$validators.format = function(modelValue, viewValue) {
                var value = modelValue || viewValue;
                if (!NAME_REG.test(value)) {
                    return false;
                }
                return true;
            };
            // 异步验证
            ctrl.$asyncValidators.exist = function(modelValue, viewValue) {
                var value = modelValue || viewValue;
                var deferred = $q.defer();
                $http.get('/apis/isUserExist/' + value).then(function(res) {
                    // console.log(res);
                    if (res.data.isExist) {
                        deferred.reject(false);
                    }
                    deferred.resolve(true);
                });
                return deferred.promise;
            }
        }
    }
}