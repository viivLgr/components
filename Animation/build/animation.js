(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["animation"] = factory();
	else
		root["animation"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var loadImage = __webpack_require__(1);
	var Timeline = __webpack_require__(2);

	// 初始化状态
	var STATE_INITIAL = 0;
	// 开始状态
	var STATE_START = 1;
	// 停止状态
	var STATE_STOP = 2;

	// 同步任务
	var TASK_SYNC = 0;
	// 异步任务
	var TASK_ASYNC = 1;

	/**
	 * 简单的函数封装，执行callback
	 * @param callback
	 */
	function next(callback) {
	    callback && callback();
	}


	/**
	 * 帧动画库类
	 * @constructor
	 */
	function Animation() {
	    this.taskQueue = [];
	    this.index = 0;
	    this.timeline = new Timeline();
	    this.state = STATE_INITIAL;
	}


	/**
	 * 同步任务，预加载图片
	 * @param imglist 图片数组
	 */
	Animation.prototype.loadImage = function (imglist) {
	    var taskFn = function (next) {
	        loadImage(imglist.slice(), next);
	    };
	    var type = TASK_SYNC;
	    return this._add(taskFn, type)
	};

	/**
	 * 异步定时任务，通过定时改变图片位置，实现帧动画
	 * @param ele dom对象
	 * @param positions 背景位置数组
	 * @param imageUrl 图片地址
	 */
	Animation.prototype.changePosition = function (ele, positions, imageUrl) {
	    var len = positions.length;
	    var taskFn, type;
	    if (len) {
	        var me = this;
	        taskFn = function (next, time) {
	            if (imageUrl) {
	                ele.style.backgroundImage = 'url(' + imageUrl + ')';
	            }
	            // 获得当前背景图片位置索引
	            var index = Math.min(time / me.interval | 0, len - 1);
	            var position = positions[index].split(' ');
	            // 改变dom对象的背景图片位置
	            ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';

	            // 如果图片到最后一帧就执行next
	            if (index === len - 1) next();
	        };
	        type = TASK_ASYNC;
	    } else {
	        taskFn = next;
	        type = TASK_SYNC;
	    }
	    return this._add(taskFn, type);
	};

	/**
	 * 异步定时任务，通过定时改变image标签的src属性，实现帧动画
	 * @param ele image表现
	 * @param imglist 图片数组
	 */
	Animation.prototype.changeSrc = function (ele, imglist) {
	    var len = imglist.length;
	    var taskFn, type;
	    if (len) {
	        var me = this;
	        taskFn = function (next, time) {
	            // 获得当前图片索引
	            var index = Math.min(time / me.interval | 0, len - 1);
	            // 改变image对象的图片地址
	            ele.src = imglist[index];
	            if (index === len - 1) next();
	        };
	        type = TASK_ASYNC;
	    } else {
	        taskFn = next;
	        type = TASK_SYNC;
	    }
	    return this._add(taskFn, type);
	};

	/**
	 * 高级用法，异步定时执行的任务
	 * 自定义动画每帧执行的任务函数
	 * @param raskFn 自定义每帧执行的任务函数
	 */
	Animation.prototype.enterFrame = function (taskFn) {
	    return this._add(taskFn, TASK_ASYNC);
	};

	/**
	 * 同步任务，上一个任务完成后执行回调函数
	 * @param callback 回调函数
	 */
	Animation.prototype.then = function (callback) {
	    var taskFn = function (next) {
	        callback();
	        next();
	    };
	    return this._add(taskFn, TASK_SYNC);
	};

	/**
	 * 开始执行任务
	 * @param interval 异步定时任务执行的间隔
	 */
	Animation.prototype.start = function (interval) {
	    if (this.state === STATE_START) {
	        return this;
	    }
	    // 如果任务链中没有任务，则返回
	    if (!this.taskQueue.length) {
	        return this;
	    }
	    this.state = STATE_START;
	    this.interval = interval;
	    this._runTask();
	    return this;
	};

	/**
	 * 同步任务，该任务就是回退到上一个任务重
	 * 实现重复上一个任务的效果，可以定义重复的次数
	 * @param times 重复次数
	 */
	Animation.prototype.repeat = function (times) {
	    var me = this;
	    var taskFn = function () {
	        if (typeof times === 'undefined') {
	            // 无限回退到上一个任务
	            me.index--;
	            me._runTask();
	            return;
	        }
	        if (times) {
	            times--;
	            // 回退
	            me.index--;
	            me._runTask();
	            return;
	        } else {
	            // 达到了重复的次数，跳转到下一个任务
	            var task = me.taskQueue[me.index];
	            me._next(task);
	        }
	    };
	    return this._add(taskFn, TASK_SYNC);
	};

	/**
	 * 同步任务，相当于repeat()更友好的接口，无限循环上一次任务
	 */
	Animation.prototype.repeatForever = function () {
	    return this.repeat();
	};

	/**
	 * 设置当前任务执行结束后到下一个任务开始前的等待时间
	 * @param time 等待时长
	 */
	Animation.prototype.wait = function (time) {
	    if (this.taskQueue && this.taskQueue.length > 0) {
	        this.taskQueue[this.taskQueue.length - 1].wait = time;
	    }
	    return this;
	};

	/**
	 * 暂停当前异步定时任务
	 */
	Animation.prototype.pause = function () {
	    if(this.state === STATE_START){
	        this.state = STATE_STOP;
	        this.timeline.stop();
	        return this;
	    }
	    return this;
	};

	/**
	 * 重新执行上一次暂停的异步任务
	 */
	Animation.prototype.restart = function () {
	    if(this.state === STATE_STOP){
	        this.state = STATE_START;
	        this.timeline.restart();
	        return this;
	    }
	};

	/**
	 * 释放资源
	 */
	Animation.prototype.dispose = function () {
	    if(this.state !== STATE_INITIAL){
	        this.state = STATE_INITIAL;
	        this.taskQueue = null;
	        this.timeline.stop();
	        this.timeline = null;
	        return this;
	    }
	    return this;
	};

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


	/**
	 * 执行任务
	 * @private
	 */
	Animation.prototype._runTask = function () {
	    if (!this.taskQueue || this.state !== STATE_START) {
	        return;
	    }
	    // 当执行完所有任务释放资源
	    if (this.index === this.taskQueue.length) {
	        this.dispose();
	        return;
	    }
	    // 获得任务链上的当前任务
	    var task = this.taskQueue[this.index];
	    if (task.type === TASK_SYNC) {
	        this._syncTask(task);
	    } else {
	        this._asyncTask(task);
	    }
	};

	/**
	 * 同步任务
	 * @param task 执行的任务对象
	 * @private
	 */
	Animation.prototype._syncTask = function (task) {
	    var me = this;
	    var next = function () {
	        // 切换到下一个任务
	        me._next(task);
	    };
	    var taskFn = task.taskFn;
	    taskFn(next);
	};

	/**
	 * 异步任务
	 * @param task 执行的任务对象
	 * @private
	 */
	Animation.prototype._asyncTask = function (task) {
	    var me = this;
	    // 定义每一帧执行的回调函数
	    var enterFrame = function (time) {
	        var taskFn = task.taskFn;
	        var next = function () {
	            // 停止当前任务
	            me.timeline.stop();
	            // 执行下一个任务
	            me._next(task);
	        };
	        taskFn(next, time);
	    };
	    this.timeline.onenterframe = enterFrame;
	    this.timeline.start(this.interval);
	};

	/**
	 * 切换到下一个任务，如果当前任务需要等待，则延期执行
	 * @param task 执行的任务对象
	 * @private
	 */
	Animation.prototype._next = function (task) {
	    var me = this;
	    this.index++;
	    task.wait ? setTimeout(function () {
	        me._runTask();
	    }, task.wait) : this._runTask();
	};

	// 类似工厂创建的方法
	// 拿到Animation的实例
	module.exports = function(){
	    return new Animation();
	};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * 图片预加载
	 * @param images 图片数组或者对象
	 * @param callback 全部图片加载完毕后调用的回调函数
	 * @param timeout 加载超时的时长
	 */
	function loadImage(images, callback, timeout){
	    // 加载完成图片的计数器
	    var count = 0;
	    // 全部图片加载成功的一个标志位
	    var success = true;
	    // 超时timer的id
	    var timeoutId = 0;
	    // 是否加载超时的标志位
	    var isTimeout = false;

	    // 对图片数组（或对象）进行遍历
	    for(var key in images){
	        // 过滤prototype上的属性
	        if(!images.hasOwnProperty(key)){
	            continue;
	        }
	        // 获得每个图片元素
	        // 期望格式是个object：{src: xxx}
	        var item = images[key];
	        if(typeof item === 'string'){
	            item = images[key] = {
	                src: item
	            };
	        }
	        // 如果格式不满足期望，则丢弃此条数据进行下一次遍历
	        if(!item || !item.src){
	            continue;
	        }

	        // 计数 +1
	        count++;
	        // 设置图片元素的id
	        item.id = '__img__' + key + getId();
	        // 设置图片元素的img,它是一个Image对象
	        item.img = window[item.id] = new Image();
	        doLoad(item);
	    }

	    // 遍历完成如果计数为0，则直接调用callback
	    if(!count){
	        callback(success);
	    }else if(timeout){
	        timeoutId = setTimeout(onTimeout, timeout);
	    }

	    /**
	     * 真正进行图片加载的函数
	     * @param item 图片元素的对象
	     */
	    function doLoad(item) {
	        item.status = 'loading';
	        var img = item.img;
	        // 定义图片加载成功的回调函数
	        img.onload = function(){
	            success = success && true;
	            item.status = 'loaded';
	            done();
	        };

	        // 定义图片加载失败的回调函数
	        img.onerror = function(){
	            success = false;
	            item.status = 'error';
	        };

	        // 发起了一个http(https)请求
	        img.src = item.src;

	        /**
	         * 每张图片加载完成的回调函数
	         */
	        function done() {
	            // 及时清理事件，解除事件绑定
	            img.onload = img.onerror = null;
	            try{
	                delete window[item.id];
	            }catch (e){
	                // 兼容低版本ie浏览器
	            }
	            // 每张图片加载完成，计数器减一;
	            // 当所有图片加载完成且没有超时的情况，清除超时计时器，且执行回调函数
	            if(!--count && !isTimeout){
	                clearTimeout(timeoutId);
	                callback(success)
	            }
	        }
	    }

	    /**
	     * 超时函数
	     */
	    function onTimeout() {
	        isTimeout = true;
	        callback(false);
	    }
	}

	var __id = 0;
	function getId() {
	    return ++__id;
	}

	module.exports = loadImage;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	var DEFAULT_INTERVAL = 1000 / 60;

	var STATE_INITIAL = 0;
	var STATE_START = 1;
	var STATE_STOP = 2;

	// 闭包：做一次浏览器检测，赋值给变量
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

	/**
	 * 时间轴类
	 * @constructor
	 */
	function Timeline() {
	    this.animationHandler = 0;
	    this.state = STATE_INITIAL;
	}

	/**
	 * 时间轴上每一次回调执行的函数
	 * @param time 从动画开始到当前执行的时间
	 */
	Timeline.prototype.onenterframe = function (time) {

	};

	/**
	 * 动画开始
	 * @param interval 每一次回调的间隔时间
	 */
	Timeline.prototype.start = function (interval) {
	    if (this.state === STATE_START) return;
	    this.state = STATE_START;
	    this.interval = interval || DEFAULT_INTERVAL;
	    startTimeline(this, +new Date());
	};

	/**
	 * 动画停止
	 */
	Timeline.prototype.stop = function () {
	    if (this.state !== STATE_START) return;
	    this.state = STATE_STOP;
	    // 如果动画开始过，则记录动画从开始到现在经历的时间
	    if (this.startTime) {
	        this.dur = +new Date() - this.startTime;
	    }
	    cancelAnimationFrame(this.animationHandler);
	};

	/**
	 * 重新开始动画
	 */
	Timeline.prototype.restart = function () {
	    if(this.state === STATE_START) return; // 动画是开始状态，无法执行restart
	    if(!this.dur || !this.interval) return; // 经历时间为0或inter为0，表示还没有开始，无法执行restart
	    this.state = STATE_START;

	    // 无缝连接动画
	    startTimeline(this, +new Date() - this.dur);
	};

	/**
	 * 时间轴动画启动函数
	 * @param timeline 时间轴实例
	 * @param startTime 动画开始时间戳
	 */
	function startTimeline(timeline, startTime) {
	    timeline.startTime = startTime;
	    nextTick.interval = timeline.interval;

	    // 记录上一次回调的时间戳
	    var lastTick = +new Date();
	    nextTick();

	    /**
	     * 每一帧执行的函数
	     */
	    function nextTick() {
	        var now = +new Date();
	        timeline.animationHandler = requestAnimationFrame(nextTick);
	        // 如果当前时间与上一次回调的时间戳大于设置的时间间隔，
	        // 表示这一次可以执行回调函数
	        if (now - lastTick >= timeline.interval) {
	            timeline.onenterframe(now - startTime);
	            lastTick = now;
	        }
	    }
	}
	module.exports = Timeline;

/***/ })
/******/ ])
});
;