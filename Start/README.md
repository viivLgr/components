# 星级评分
1. js
- 全星 
- 半星
[预览](https://viivlgr.github.io/components/Start/index3.html)
组件基于jQuery，并学习了设计模式中的母类继承 [code](https://github.com/viivLgr/components/tree/master/Start)
2. css: 使用的背景图片比较复杂，不利于平分提交
- css3： 使用hover属性和target属性 [预览](https://viivlgr.github.io/components/Start/index4.html)
- 不使用css3: 使用可视区的特性`over:hidden;`，可以让锚点元素显示在可视区内，兼容到ie6及以上 [预览](https://viivlgr.github.io/components/Start/index5.html)
- 使用form表单: 
    使用简单背景图片，`repeat-x`,控制宽度来显示星级
    利用`input:checked + label`选择 [预览](https://viivlgr.github.io/components/Start/index6.html)
3. 最完善功能 **推荐！！！**
- 使用策略模式，将两个星星完成全星、半星评定方式。
    a. 实现1： 借助多个标签，采用事件委托方式监听`mouseover`,判断鼠标所选位置
        [code](https://github.com/viivLgr/components/blob/master/Start/index8.html)
        [预览](https://viivlgr.github.io/components/Start/index8.html)
    b. 实现2：仅需两个标签，通过`e.pageX - $el.offset().left`的距离计算所选位置 **推荐！！**
        [code](https://github.com/viivLgr/components/blob/master/Start/index9.html)
        [预览](https://viivlgr.github.io/components/Start/index9.html)


### 主要思路
- 全星： 通过改变`background-position`
- 半星：
```
if(e.pageX- $el.offset().left < $el.width() / 2){
    // 点亮半星
} else{
    // 点亮全星
}
```


#### 封装jQuery插件
```
$.fn.extend({
    rating: function(num){
        return this.each(function(){
            init(this, num);
        });
    }
});

// 调用方式
$('#rating').rating(2);
```

#### 设计模式 - 母类继承
```
 // 继承方法
var extend = function(subClass, superClass){
    var F = function(){};
    F.prototype = superClass.prototype; // 将父类的原型方法赋给临时类F
    subClass.prototype = new F(); // 子类的原型继承临时类，临时类没有构造方法，只有原型方法
    subClass.prototype.constructor = subClass; // 改变子类原型的构造函数指向
}

// 父类
// 点亮
var Light = function(el, options){
    this.$el = $(el);
    this.$item = this.$el.find('.rating-item');
    this.opts = options;
    this.add = 1;
    this.selectEvent = 'mouseover';
};
Light.prototype.init = function(){
    this.lightOn(this.opts.num); // 点亮星星
    if(!this.opts.readOnly){
        this.bindEvent();
    }
};
Light.prototype.lightOn = function(num){
    num = parseInt(num);
    this.$item.each(function(index){
        var $this = $(this);
        if(index < num){
            $this.css('background-position', '-2px -40px');
        }else{
            $this.css('background-position', '0 0')
        }
    })
};
Light.prototype.bindEvent = function(){
    var self = this;
    var length = self.$item.length;
    this.$el.on(self.selectEvent, '.rating-item', function(e){
        var $this = $(this);
        self.select(e, $this);
        var num = $this.index() + self.add;
        self.lightOn(num);
        (typeof self.opts.select === 'function') && self.opts.select.call(this, num, length);
        // 触发事件
        self.$el.trigger('select', [num, length]);
    }).on('click', '.rating-item', function(){
        self.opts.num = $(this).index() + self.add;
        (typeof self.opts.chosen === 'function') && self.opts.chosen.call(this, self.opts.num, length);
        self.$el.trigger('chosen', [self.opts.num, length])
    }).on('mouseout', function(){
        self.lightOn(self.opts.num);
    });
};
Light.prototype.select = function(){
    throw new Error('子类必须重写此方法');
};

// 点亮半颗
var LightHalf = function(el, options){
    Light.call(this, el, options); // 继承父类构造函数中的内容 并绑定this
    this.selectEvent = 'mousemove';
};
extend(LightHalf, Light);
LightHalf.prototype.lightOn = function(num){
    var count = parseInt(num),
        isHalf = (count !== num);
    Light.prototype.lightOn.call(this, count);
    if(isHalf){
        this.$item.eq(count).css('background-position', '0 -80px');
    }
};
LightHalf.prototype.select = function(e, $this){
    if(e.pageX - $this.offset().left < $this.width() / 2){
        this.add = 0.5;
    }else{
        this.add = 1;
    }
};

// 点亮整颗
var LightEntire = function(el, options){
    Light.call(this, el, options); // 继承父类构造函数中的内容 并绑定this
    this.selectEvent = 'mouseover';
};
extend(LightEntire, Light);
LightEntire.prototype.lightOn = function(num){
    Light.prototype.lightOn.call(this, num); // 继承父类的方法并绑定自己的this
};
LightEntire.prototype.select = function(){
    this.add = 1;
};
```

[具体实现代码](https://github.com/viivLgr/components/blob/master/Start/index3.html)
