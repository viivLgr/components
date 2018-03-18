# 星级评分
jquery插件

### 主要思路
- 点亮星星
```
/**
*
*/
var ligthOn = function($item, num){

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
