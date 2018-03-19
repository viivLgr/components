# components

## DatePicker 日期选择器
- [code](https://github.com/viivLgr/components/tree/master/DatePicker)
- [预览地址](https://viivlgr.github.io/components/DatePicker/index.html)

## Animation 帧动画
- [code](https://github.com/viivLgr/components/tree/master/Animation)
- [预览地址](https://viivlgr.github.io/components/Animation/demo/index.html)


## 图片预加载
- 原生js [code](https://github.com/viivLgr/components/blob/master/Animation/src/imageLoader.js)
- 基于jQuery [code](https://github.com/viivLgr/components/blob/master/PreLoading/Camaro/preload.js)

## 星级评定
1. 使用js
- 全星 
- 半星
[预览](https://viivlgr.github.io/components/Start/index3.html)
组件基于jQuery，并学习了设计模式中的母类继承 [code](https://github.com/viivLgr/components/tree/master/Start)
2. 使用css
- css3： 使用hover属性和target属性 [预览](https://viivlgr.github.io/components/Start/index4.html)
- 不使用css3: 使用可视区的特性`over:hidden;`，可以让锚点元素显示在可视区内，兼容到ie6及以上 [预览](https://viivlgr.github.io/components/Start/index5.html)
3. 最完善功能 **推荐！！！**
- 使用策略模式，将两个星星完成全星、半星评定方式。

    - 实现1： 借助多个标签，采用事件委托方式监听`mouseover`,判断鼠标所选位置
        [code](https://github.com/viivLgr/components/blob/master/Start/index8.html)
        [预览](https://viivlgr.github.io/components/Start/index8.html)
    - 实现2：仅需两个标签，通过`e.pageX - $el.offset().left`的距离计算所选位置 **推荐！！**
        [code](https://github.com/viivLgr/components/blob/master/Start/index9.html)
        [预览](https://viivlgr.github.io/components/Start/index9.html)



# tips
使用github pages预览页面
1. Setting 中找到 GitHub Pages，选择Source中的master分支，并保存。
2. 会生成一个 https://viivlgr.github.io/components/ 类似的地址，在后面追加文件目录即可预览。