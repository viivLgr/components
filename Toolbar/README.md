# 侧边工具条开发
使用Sass、RequireJS

## 样式实现方式 使用Sass
- 使用背景图片：精灵图，通过改变`background-position`
    1. HTML结构简单
    2. 兼容性良好，可以兼容到IE6
    3. 使用了大量的图片，对性能有一定的影响，并且不利于修改
    [预览](https://viivlgr.github.io/components/Toolbar/tool1.html)

- 使用图标字体
    [下载字体](https://icomoon.io/app/#/select)
    1. 避免了图片的使用，节约了性能，并且修改方便
    2. HTML结构稍显复杂
    3. 不兼容IE6和IE7
    [预览](https://viivlgr.github.io/components/Toolbar/tool2.html)

- 利用befor和after伪类的方式
    1. 避免了图片的使用，节约了性能，并且修改方便
    2. HTML结构简单，但CSS稍显复杂
    3. 不兼容IE6和IE7
    [预览](https://viivlgr.github.io/components/Toolbar/tool3.html)

## 逻辑实现 使用requirejs，jQuery
1. 依赖jQuery，定义可以灵活设置滚动距离的scrollto模块
```
// scrollto.js
define(['jquery'], function($) {
    'use strict';
    function ScrollTo(opts){
        this.opts = $.extend({}, ScrollTo.DEFAULTS, opts);
        this.$el = $('html, body');
    }
    ScrollTo.DEFAULTS = {
        dest: 0,
        speed: 800
    };
    ScrollTo.prototype.move = function(){
        console.log('move')
        var opts = this.opts,
            dest = opts.dest;
        if($(window).scrollTop() != dest){
            if(!this.$el.is(':animated')){
                this.$el.animate({
                    scrollTop: dest 
                }, opts.speed);
            }
        }
    };
    ScrollTo.prototype.go = function(){
        var opts = this.opts.dest;
        if($(window).scrollTop() != dest){
            this.$el.scrollTop(dest);
        }
    };
    return {
        ScrollTo: ScrollTo
    }
});
```
2. 依赖jQuery、scrollto模块，定义返回顶部组件
```
// backtop.js
define(['jquery', 'scrollto'], function($, scrollto) {
    'use strict';
    function BackTop(el, opts){
        this.opts = $.extend({}, BackTop.DEFAULTS, opts);
        this.$el = $(el);
        this.scroll = new scrollto.ScrollTo({
            dest: 0,
            speed: this.opts.speed
        });
        if(this.opts.mode === 'move'){
            this.$el.on('click', $.proxy(this._move, this));
        }else{
            this.$el.on('click', $.proxy(this._go, this));
        }
        $(window).on('scroll', $.proxy(this._checkPosition, this));
    }
    BackTop.DEFAULTS = {
        mode: 'move',
        pos: $(window).height(),
        speed: 800
    };
    BackTop.prototype._move = function(){
        this.scroll.move();
    };
    BackTop.prototype._go = function(){
        this.scroll.go();
    };
    BackTop.prototype._checkPosition = function(){
        var $el = this.$el;
        if($(window).scrollTop() > this.opts.pos){
            $el.fadeIn();
        }else{
            $el.fadeOut();
        }
    };
    // jquery插件写法
    $.fn.extend({
        backtop: function(opts){
            return this.each(function(){
                new BackTop(this, opts);
            });
        }
    })
    return {
        BackTop: BackTop
    };
});
```
3. 调用
```
requirejs(['jquery', 'backtop'], function($, backtop){

    // 构造函数调用方式
    // new backtop.BackTop($('#backTop'), {
    //     mode: 'move',
    //     pos: 100,
    //     speed: 2000
    // });

    // jquery插件的写法
    $('#backTop').backtop({
        mode: 'move'
    });
});
```
[预览](https://viivlgr.github.io/components/Toolbar/tool3.html)


## Sass的基础知识
- 安装[koala](http://koala-app.com/index-zh.html)支持编译sass文件
    可以设置中文，和编译后的方式

### 使用
- 嵌套:后代选择器
```
ul{
    li{
        a{

        }
    }
}
ul li a{}
```
- 变量： `$`符号开头；运算符两侧要有空格
```
$toolbar-size: 52px;

// 使用
.toolbar{
    margin-left: -$toolbar-size / 2;
}
```
- 方法 `@mixin`用来定义; `@include`用来引用
```
@mixin transition($transition){
    -webkit-transition: $transition;
    -moz-transition: $transition;
    -o-transition: $transition;
    -ms-transition: $transition;
    transition: $transition;
}

// 使用
.toolbar-layer{
    @include transition(all 1s);
}
```

- `@import`引入外部文件 `_mixin.scss` 文件导入: 不需要`_`和后缀名
```
@import "mixin";
```

- 继承 
```
@extend .icon-wechat;
```



## [RequireJS](http://requirejs.org/docs/download.html)
- 有效防止命名冲突
- 声明不同js文件之间的依赖
- 模块化的方式组织

### RequireJS常用的方法
1. requirejs.config
2. requirejs
```
// main.js
requirejs.config({
    // 直接改变基目录
    baseUrl: "js/lib",
    // 指定各个模块的加载路径。
    paths: { // 定义别名
        jquery: 'jquery.min'
    },
    // 专门用来配置不兼容的模块。没有采用AMD规范编写
    shim: {
　　　　　'jquery.scroll': {
　　　　　　    deps: ['jquery'],
　　　　　　    exports: 'jQuery.fn.scroll'
　　　　  }
　　　}
});

// 模块引入, 并调用
requirejs(['jquery', 'validate'], function ($, validate) {
    $('body').css('background-color', 'red');
    console.log(validate.isEqual('1','2'));
});
```
3. define
```
// validate.js
define([
    'jquery' // 添加依赖
], function($) {
    'use strict';
    return {
        isEqual: function(str1, str2){
            return str1 === str2;
        }
    }
});
```
4. html中引入
```
<script src="js/require.js" data-main="js/main"></script>
```
- 在html文件里引入下载好的require.js，然后设置他的data-main为入口文件main.js
- main.js里面先是设置了引入资源的别名等
- 我们自己定义了一个validate.js的方法，并且把isEqual方法return了出去，所以在main里就可以引入，并且调用



