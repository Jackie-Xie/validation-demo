/**
 * 获取所有用户名
 */
Mock.mock(/\/apis\/users/, 'get', ['admin', 'jackie', 'xieq', 'lisi', 'zhangsan', 'dog', 'cat']);

/** 
 * 检验用户名是否唯一
 */
Mock.mock(/\/apis\/isUserExist\//, 'get', function(options) {
    // console.log(options);
    var user = options.url.split('/isUserExist/')[1];
    // console.log(user);
    var users = ['admin', 'jackie', 'xieq', 'lisi', 'zhangsan', 'dog', 'cat'];
    return {
        isExist: users.indexOf(user) > -1
    };
});

// jquery validation
Mock.mock(/\/apis\/isExist\//, 'post', function(options) {
    var user = options.body && options.body.split('=')[1];
    var users = ['admin', 'jackie', 'xieq', 'lisi', 'zhangsan', 'dog', 'cat'];
    return users.indexOf(user) === -1;
});

// formvalidation
Mock.mock(/\/apis\/isUsExist\//, 'post', function(options) {
    var user = options.body && options.body.split('=')[1];
    var users = ['admin', 'jackie', 'xieq', 'lisi', 'zhangsan', 'dog', 'cat'];
    return {
        valid: users.indexOf(user) === -1
    };
});