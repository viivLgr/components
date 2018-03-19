requirejs.config({
    paths: {
        jquery: 'jquery.min'
    }
});

requirejs(['jquery', 'backtop'], function($, backtop){
    // new backtop.BackTop($('#backTop'), {
    //     mode: 'move',
    //     pos: 100,
    //     speed: 2000
    // });

    // jquery插件的写法
    $('#backTop').backtop({
        mode: 'move'
    })


    // var scroll = new scrollto.ScrollTo({
    //     dest: 0,
    //     speed: 800
    // });
    // // $.proxy(方法, this)
    // $('#backTop').on('click', $.proxy(scroll.move, scroll));
    // $(window).on('scroll', function(){
    //     checkPosition($(window).height());
    // });
    // checkPosition($(window).height());
    // function move(){
    //     $('html, body').animate({
    //         scrollTop: 0
    //     }, 800);
    // }
    // function go(){
    //     $('html, body').scrollTop(0);
    // }
    // function checkPosition(pos){
    //     if($(window).scrollTop() > pos){
    //         $('#backTop').fadeIn();
    //     }else{
    //         $('#backTop').fadeOut();
    //     }
    // }
});