# DatePicker

获取当月第一天
```
new Date(year, month-1, 1)
```

获取当月最后一天
```
new Date(year, month, 0) // 0 会倒回到month月查看最后一天
```

获取dom元素的class [Element.classList](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList) IE8以下不兼容
```
document.querySelector('.ui-datepicker-wrapper').classList
// DOMTokenList ["ui-datepicker-wrapper", value: "ui-datepicker-wrapper"]

// 删除class
$wrapper.classList.remove('ui-datepicker-wrapper-show');

// 添加class
$wrapper.classList.add('ui-datepicker-wrapper-show');

// 判断是否存在
$target.classList.contains('ui-datepicker-prev-btn')
```
