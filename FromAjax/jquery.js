// 模拟表单请求数据
$.extend({
    StandardPost:function(url, type, args){
        var body = $(document.body),
            form = $("<form id='form' method='" + type + "'></form>"), // enctype='multipart/form-data'
            input;
        form.attr({"action":url});
        $.each(args,function(key,value){
            input = $("<input type='hidden'>");
            input.attr({"name":key});
            input.val(value);
            form.append(input);
        });
        form.appendTo(document.body);
        document.body.removeChild(form[0]);
        return form;
    }
});

var options = {
    target: '#output1',
    // 从服务传过来的数据显示在这个div内部
    beforeSubmit: showRequest,
   // ajax提交之前的处理
    success:  showResponse
   // 处理之后的处理
};
$(form).ajaxSubmit(options);
