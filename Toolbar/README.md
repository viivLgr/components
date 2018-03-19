# 侧边工具条开发
使用Sass、RequireJS

## 实现方式
- 使用背景图片：精灵图，通过改变`background-position`
    1. HTML结构简单
    2. 兼容性良好，可以兼容到IE6
    3. 使用了大量的图片，对性能有一定的影响，并且不利于修改
    [预览](https://viivlgr.github.io/components/Toolbar/tool1.html)

- 使用图标字体

- 利用befor和after伪类的方式

## Sass的基础知识
- 安装[koala](http://koala-app.com/index-zh.html)支持编译sass文件
    可以设置中文，和编译后的方式

### 使用
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

- _mixin.scss 文件导入: 不需要`_`和后缀名
```
@import "mixin";
```



## [RequireJS](http://requirejs.org/docs/download.html)
- 有效防止命名冲突
- 声明不同js文件之间的依赖
- 模块化的方式组织

### RequireJS常用的方法
1. requirejs.config
```
requirejs.config({
    paths: { // 定义别名
        jquery: 'jquery.min'
    }
});
```
2. requirejs
```
// 模块引入, 并调用
requirejs(['jquery', 'validate'], function ($, validate) {
    $('body').css('background-color', 'red');
    console.log(validate.isEqual('1','2'));
});
```
3. define
```
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



