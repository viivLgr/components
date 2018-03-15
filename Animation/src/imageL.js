function imageLoader(imagelist, callback, timeout){
    var count = 0;
    var success = true;  // 全部加载完成的标识
    var timeoutId = 0; // 超时timer的id
    var isTimeout = false; // 是否超时

    for(var key in imagelist){
        // 过滤掉prototype上的属性
        if(!imagelist.hasOwnProperty(key)){
            continue;
        }

        // 获得每个图片元素，期望格式是个object：{src: xxx}
        var item = imagelist[key];
        // 将string格式转成object
        if(typeof item === 'string') item = imagelist[key] = {src: item};
        // 格式不满足则丢弃此函数
        if(!item || !item.src) continue;

        // 计数
        count++;
        item.id = '__img__' + key + getId();

        // 设置图片的img，它是一个Image对象
        item.img = window[item.id] = new Image();
        doLoad(item);
    }

    if(!count){
        // 遍历完如果计数为0，则直接callback
        callback(success)
    }else if(timeout){
        timeoutId = setTimeout(onTimeout, timeout)
    }

    /**
     * 加载图片
     */
    function doLoad(item){
        item.status = 'loading';
        var img = item.img;
        img.onload = function(){
            success = success && true;
            item.status = 'loaded';
            done();
        };
        img.onerror = function(){
            success = false;
            item.status = 'error';
        };
        img.src = item.src;

        /**
         * 每张图片加载完成时的回调函数
         */
        function done() {
            // 清除绑定事件
            img.onload = img.onerror = null;
            try {
                delete window[item.id];
            } catch (e){

            }
            // 每张图片加载完成，计数器减一
            // 当所有图片加载完成且没有超时的情况，清除超时计时器，且执行回调函数
            if(!--count && !timeoutId){
                clearTimeout(timeoutId);
                callback(false);
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
function getId(){
    return ++__id;
}