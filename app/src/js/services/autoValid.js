/**
 * @name myApp.service:AutoValid
 * @description 验证服务，主要处理显示错误状态、信息的变量，
 *   具体验证方法需要自己在controller里面写，并抛出错误信息。
 *   原理：调用了do方法则dirty为true，然后通过判断是否有错误信息，
 *   有的话ok为false，否则ok为true，err为错误信息。
 * @author xieq   
 */
angular.module('myApp')
    .service('AutoValid', [function() {
        'use strict';
        var self = this;

        // 默认属性
        this._opts = {
            dirty: false,
            ok: true,
            err: ''
        };

        this._handle = function(propers, opts) {
            var tArr, tObj,
                reg = '.';
            propers && propers.forEach(function(val, idx) {
                tArr = val.split(reg);
                tObj = null;
                tArr && tArr.forEach(function(n, i) {
                    tObj ? tObj = tObj[n] = {} : tObj = self[n] = {};
                });
                // Object.assign(tObj, opts);
                $.extend(tObj, opts);
            });
        };

        this._get = function(proper) {
            var tArr = proper.split('.'),
                tObj = null;
            tArr && tArr.forEach(function(n, i) {
                tObj ? tObj = tObj[n] : tObj = self[n];
            });
            return tObj;
        };

        this._doOne = function(proper, fn, scope) {
            var tObj = self._get(proper);
            var errMsg = fn && scope[fn]();
            // dirty
            tObj.dirty = true;
            // ok or not ok
            errMsg ? [tObj.ok = false, tObj.err = errMsg] : [tObj.ok = true, tObj.err = ''];
            return !errMsg;
        };

        /**
         * 显示错误
         * @param {plain object} obj: { '属性': '错误信息' }
         */
        this.showErr = function(obj) {
            var proper, errMsg;
            for (var key in obj) {
                proper = key;
                errMsg = obj[key];
            }
            var tObj = self._get(proper);
            // dirty
            tObj.dirty = true;
            // ok or not ok
            errMsg ? [tObj.ok = false, tObj.err = errMsg] : [tObj.ok = true, tObj.err = ''];
        };

        /**
         * 初始化
         * @param {array} propers: 属性数组 ['userName','pwd']
         */
        this.init = function(propers) {
            self._handle(propers, self._opts);
        };

        /**
         * 验证
         * @param {plain object} obj: { '属性': '对应验证方法' }
         * @param {plain object} scope: 当前作用域
         */
        this.do = function(obj, scope) {
            var flag = true;
            for (var i in obj) {
                flag = self._doOne(i, obj[i], scope);
                if (!flag) break;
            }
            return flag;
        };

        /**
         * @description 常用验证方法
         */
        this.utils = {
            /**
             * @name isPassword
             * @param: {string} str
             * @description 密码校验（8-25位，数字和字母的组合）
             */
            isPassword: function(str) {
                // var reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,25}$/;
                var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,25}$/;
                return reg.test(str);
            },
            /**
             * @name isEmail
             * @param {string} str
             * @description 电子邮箱
             */
            isEmail: function(str) {
                var regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                return regEmail.test(str);
            },
            /**
             * @name isPhone
             * @param {string} str
             * @description 联系方式
             */
            isPhone: function(str) {
                var regPhone = /^1[3|4|5|7|8]\d{9}$/,
                    regTel = /^(\(\d{3,4}\)|\d{3,4}-|\s){1}\d{7,14}$/;
                return regPhone.test(str) || regTel.test(str);
            },
            /**
             * @name isDateTime
             * @param {string} str
             * @description 日期时间校验
             */
            isDateTime: function(str) {
                var regDate = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1} ([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/;
                return regDate.test(str);
            },
            /**
             * @name isDate
             * @param {string} str
             * @description 日期校验
             */
            isDate: function(str) {
                var regDate = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
                return regDate.test(str);
            },
            /**
             * @name isTime 
             * @param {string} str
             * @description 时间“--：--：--”校验
             */
            isTime: function(str) {
                var regTime = /^([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/;
                return regTime.test(str);
            },
            /**
             * @name isIp 
             * @param {string} str
             * @description Ip校验
             */
            isIp: function(str) {
                var regIp = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/,
                    regIp2 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                return regIp.test(str) || regIp2.test(str);
            },
            /**
             * @name isPort
             * @param {string} str
             * @description 端口校验
             */
            isPort: function(str) {
                var regPort = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
                return regPort.test(str);
            },
            /**
             *  @name validLength
             *  @param {string} str 需要验证的数据
             *  @description 长度校验
             *    lengthRange(object) 长度范围
             *    lengthRange.minLen: 最小长度，默认为0
             *    lengthRange.maxLen: 最大长度，默认为25
             */
            validLength: function(str, lengthRange) {
                if (!str || str.length == 0 || typeof(str) != 'string') {
                    return false;
                }
                var minLen = lengthRange ? lengthRange.minLen || 0 : 0;
                var maxLen = lengthRange ? lengthRange.maxLen || 25 : 25;
                var realLen = this._getRealLen(str);
                //		return minLen*2 <= realLen && realLen <= maxLen*2;
                return minLen <= realLen && realLen <= maxLen;
            },
            /**
             * @name isChinese 
             * @param {string} str
             * @description 中文校验
             */
            isChinese: function(str) {
                var re = /^([\u4E00-\u9FA5]+，?)+$/;
                if (!re.test(str)) {
                    return false;
                } else {
                    return true;
                }
            },
            /**
             * @name isEnglish  
             * @param {string} str 
             * @description 英文校验
             */
            isEnglish: function(str) {
                var re = /^[A-Za-z]+$/;
                if (re.test(str)) {
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * @name isNumber
             * @param {string} text 需要验证的数据
             * @param {string} type 数字类型
             * @description 数字校验
             */
            isNumber: function(text, type) {
                var re = null;
                if (type == 'integer') {
                    re = /^[1-9]+[0-9]*]*$/;
                    if (!re.test(text)) {
                        return false;
                    } else {
                        return true;
                    }
                } else if (type == 'short') {
                    re = /^-([0-2]\d{4}|3[0-1]\d{3}|32[0-6]\d{2}|327[0-5]\d|3276[0-8]|\d{1,4})$|^([0-2]\d{4}|3[0-1]\d{3}|32[0-6]\d{2}|327[0-5]\d|3276[0-7]|\d{1,4})$/;
                    if (!re.test(text)) {
                        return false;
                    } else {
                        return true;
                    }
                } else if (type == 'int') {
                    re = /^-([0-2]\d{8}|3[0-1]\d{9}|32[0-6]\d{7}|327[0-5]{6}\d|3276[0-8]|\d{1,10})$|^([0-2]\d{10}|3[0-1]\d{9}|32[0-6]\d{8}|327[0-5]\d{7}|3276[0-7]{6}|\d{1,10})$/;
                    if (!re.test(text)) {
                        return false;
                    } else {
                        return true;
                    }
                } else if (type == 'long') {
                    re = /^-([0-1]\d{9}|20\d{8}|21[0-3]\d{7}|214[0-6]\d{6}|2147[0-3]\d{5}|21474[0-7]\d{4}|214748[0-2]\d{3}|2147483[0-5]\d{2}|21474836[0-3]\d{1}|214748364[0-8])|^([0-1]\d{9}|20\d{8}|21[0-3]\d{7}|214[0-6]\d{6}|2147[0-3]\d{5}|21474[0-7]\d{4}|214748[0-2]\d{3}|2147483[0-5]\d{2}|21474836[0-3]\d{1}|214748364[0-7])$/;
                    if (!re.test(text)) {
                        return false;
                    } else {
                        return true;
                    }
                } else if (type == 'decimal' || type == 'float' || type == 'double') {
                    re = /^-?([0-9]|\d)+\.([0-9]|\d)+$/;
                    if (!re.test(text)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            /**
             * @name isNaturalNum
             * @param {string} str
             * @description 验证自然数
             */
            isNaturalNum: function(str) {
                var re = /^[1-9]+[0-9]*]*$/;
                if (!re.test(str)) {
                    return false;
                } else {
                    return true;
                }
            },
            /**
             * @name validAppointedSign
             * @param {string} str
             * @description 指定特殊符号校验
             */
            validAppointedSign: function(str) {
                var flag = true,
                    specialWords = ['!', '@', '#', '~', ',', '.', '。', '，', '/', '?', '%', '&', '='];
                $.each(specialWords, function(k, v) {
                    if (!!str && str.indexOf(v) > -1) {
                        flag = false;
                        return false;
                    }
                });
                return flag;
            },

            /**
             * @name validSign
             * @param {string} word
             * @description 所有特殊符号校验
             */
            validSign: function(word) {
                var backInfo = {},
                    last = word.replace(/\w|\d|[\u2E80-\u9FFF]/g, '');
                if (last.length > 0) {
                    var err = last.split('').map(function(i) {
                        return " " + i + " ";
                    });
                    err = this._uniq(err);

                    if (!!err && err.length != 0) {
                        err = err.join(" ");
                        backInfo.status = false;
                        backInfo.error = "不能含有特殊符号  " + err;
                    }
                } else {
                    backInfo.status = true;
                }
                return backInfo;
            },
            /**
             * @name _getRealLen
             * @param {string} str
             * @description 获取字符长度，1个中文为2个字符长度，1个英文为1个字符长度
             */
            _getRealLen: function(str) {
                var len = 0;
                if (!str || str == '') {
                    return len;
                }
                var realLength = 0,
                    charCode = -1;
                len = str.length;
                for (var i = 0; i < len; i++) {
                    charCode = str.charCodeAt(i);
                    if (charCode >= 0 && charCode <= 128) {
                        realLength += 1;
                    } else {
                        realLength += 2;
                    }
                }
                return realLength;
            },
            _uniq: function(arr) {
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    var flag = this._isRepeat(arr, arr[i]);
                    if (typeof(flag) == 'boolean') {
                        result.push(arr[i]);
                    } else {
                        if (i == flag) {
                            result.push(arr[i]);
                        }
                    }
                }
                return result;
            },
            _isRepeat: function(arr, a) {
                var k = 0,
                    m = 0;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == a) {
                        ++k;
                        if (k == 1) {
                            m = i;
                        }
                    }
                }
                if (k > 1) {
                    return m;
                } else {
                    return false;
                }
            }
        };

    }]);