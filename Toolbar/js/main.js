requirejs.config({
    paths: { // 定义别名
        jquery: 'jquery.min'
    }
});

// 模块引入
requirejs(['jquery', 'validate'], function ($, validate) {
    $('body').css('background-color', 'red');
    console.log(validate.isEqual('1','2'));
});