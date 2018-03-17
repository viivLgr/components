/**
 * 图片预加载
 */
(function ($) {
    function Preload(imgs, options) {
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
        this.opts = $.extend({}, Preload.DEFAULTS, options);
        if(this.opts.order === 'ordered'){
            this._ordered();
        }else{
            this._unordered();
        }
    }
    Preload.DEFAULTS = {
        order: 'unordered', // 默认情况使用无序预加载
        each: null, // 每一张图片加载完毕后执行
        all: null // 所有图片加载完毕后执行
    };

    /**
     * 无序加载
     */
    Preload.prototype._unordered = function(){
        var imgs = this.imgs;
        var opts = this.opts;
        var count = 0;
        var len = imgs.length;
        $.each(imgs, function(index, src){
            if(typeof src != 'string') return;
            var imgObj = new Image();
            $(imgObj).on('load error', function(){
                opts.each && opts.each(count);
                if(count >= len - 1){
                    opts.all && opts.all();
                }
                count++;
            });
            imgObj.src = src;
        });
    };

    /**
     * 有序预加载
     */
    Preload.prototype._ordered = function(){
        var count = 0;
        var imgs = this.imgs;
        var opts = this.opts;
        load();
        function load(){
            var imgObj = new Image();
            $(imgObj).on('load error', function(){
                opts.each && opts.each(count);
                if(count >= imgs.length){
                    opts.all && opts.all();
                }else{
                    load();
                }
                count++;
            });
            imgObj.src = imgs[count];
        }
    };
    $.extend({
        preload: function(imgs, opts){
            new Preload(imgs, opts);
        }
    })
})(jQuery);