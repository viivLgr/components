# Animation
[课程地址-原生 JS 实现帧动画库](https://www.imooc.com/learn/659)
帧动画
所谓帧动画就是在“连续的关键帧”中分解动画动作，也就是在时间轴的每帧上逐帧绘制不同的内容，使其连续播放而成动画，
由于是一帧一帧的画，所以帧动画具有非常大的灵活性，几乎可以表现任何想表现的内容。

### js实现帧动画的原理
1. 如果有多张帧图片，用一个image标签去承载图片，定时改变image的src属性（不推荐）
2. 把所有动画关键帧绘制在一张图片里，把图片作为元素的`background-image`，定时改变元素的`background-position`属性（推荐）
[基本实现]()

### 设计帧动画库
#### 需求分期
- 支持图片**预加载**
- 支持2种动画播放方式，及**自定义**每帧动画
- 支持单组动画控制循环次数（可支持无限次）
- 支持一组动画完成，进行下一组动画
- 支持每个动画完成后，有等待时间
- 支持动画**暂停**和**继续**播放
- 支持动画完成后执行回调函数


#### 编程接口
- `loadImage(imglist)` ：预加载图片
- `changePosition(ele, positions, imageUrl)`：通过改变元素的`background-position`实现动画
- `changeSrc(ele, imglist)`：通过改变image元素的src
- `enterFrame(callback)`： 每一帧动画执行的函数，相当于用户可以自定义每一帧动画的callback
- `repeat(times)`：动画重复执行的次数，times为空是表示无限次
- `repeatForever()`：五险重复上一次动画，相当于`repeat()`，更友好的一个接口
- `wait(time)`：每个动画执行完后等待的时间
- `then(callback)`：动画执行完成后的回调函数
- `start(interval)`：动画开始执行，interval表示动画执行的间隔
- `pause()`：动画暂停
- `restart()`：动画从上一次暂停处重新执行
- `dispose()`：释放资源

#### 调用方式
- 支持链式调用，期望**动词的方式**描述接口，调用方式如下:
```
var animation = require('animation')
var demoAnimation = animaton().loadImage(images).changePositions(ele,positions).repeat(2).then(function(){
    // 动画执行完成后调用次函数
});
demoAnimation.start(80);
```

#### 代码设计
- 把“图片预加载 -> 动画执行 -> 动画结束”等一系列操作看成一条**任务链**（数组）。

    任务链有两种类型的任务：
    1. 同步执行完毕的。
    2. 异步定时执行的（通过计时器或者raf）。
- 记录当前任务链的索引。
- 每个任务执行完毕后，通过调用`next`方法，执行下一个任务，同时**更新**任务链索引值。



## 具体实现
-  链式调用
```
/**
 * 添加一个任务到任务队列中
 * @param taskFn 任务方法
 * @param type 任务类型
 * @private
 */
Animation.prototype._add = function (taskFn, type) {
    this.taskQueue.push({
        taskFn: taskFn,
        type: type
    });
    return this; // 返回实例，达到链式调用的作用
};
```

- `requestAnimationFrame`，浏览器提供的更新帧动画的接口，大概每17毫秒刷新一次，跟CPU时间非常接近，精度比`setTimeout`高跟多
[window.requestAnimationFrame-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame): 
告诉浏览器您希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画。回调的次数常是每秒60次，但大多数浏览器通常匹配 W3C 所建议的刷新率。
```
var DEFAULT_INTERVAL = 1000 / 60;

/**
 * raf
 * 闭包：做一次浏览器检测，赋值给变量
 */
var requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);
        }
})();

var cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function (id) {
            return window.clearTimeout(id);
        };
})();
```
- 使用webpack打包
```
// webpack.config.js  "webpack": "^1.12.11"
module.exports = {
    entry: {
        animation: './src/animation.js'
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
        library: 'animation',
        libraryTarget: 'umd'
    }
};
```