# 图片预加载
基于jquery的插件

### 使用场景
- 网站的loading页
- 局部图片的加载-表情
- 漫画

### 特点
- 提前加载所需图片
- 更好的用户体验

### 分类
- 无序加载：所有加载完成在进行操作
    1. 相册
    2. QQ表情
- 有序加载：
    1. 漫画阅读
    
##### 主要实现
```
var imgObj = new Image();
$(imgObj).on('load error', function(){
    opts.each && opts.each(count);
    if(count >= len - 1){
        opts.all && opts.all();
    }
    count++;
});
imgObj.src = src;
```

##### 使用方式
```
$.preload(imgs, {
    order: 'ordered', // 默认无序，有序为‘ordered’
    each: function(count){ // 每个加载完的callback 可选
        console.log(count)
    }, 
    all: function(){   // 所有加载完的callback 可选
        console.log('all');
    }
});
```
