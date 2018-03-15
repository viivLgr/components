// 防止作用域污染所以使用自执行函数
(function(){
    var datePicker = {};
    var monthData;
    var $wrapper;
    var today;
    datePicker.getMonthData = function(year, month){
        var ret = []
        if(!year || !month){
            today = new Date()
            year = today.getFullYear()
            month = today.getMonth() + 1;
        }

        var firstDay = new Date(year, month - 1, 1);
        var firstDayWeekDay = firstDay.getDay(); // 获取第一天是周几
        if(firstDayWeekDay === 0) firstDayWeekDay = 7; // 将周日的0赋值成7，符合国情

        year = firstDay.getFullYear();
        month = firstDay.getMonth() + 1;

        var lastDayOfLastMonth = new Date(year, month - 1, 0); // 获取上个月最后一天
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate(); // 获取上个月最后一天是几号

        var preMonthDayCount = firstDayWeekDay - 1; // 上月需要显示的天数

        var lastDay = new Date(year, month, 0); // 获取当月最后一天
        var lastDate = lastDay.getDate();

        for(var i = 0; i < 7 * 6; i++){
            var date = i + 1 - preMonthDayCount; // 日期
            var showDate = date; // 应该显示的是哪一天
            var thisMonth = month;
            
            if(date <= 0){
                // 上月
                thisMonth = month - 1;
                showDate = lastDateOfLastMonth + date;
            }else if(date > lastDate){
                // 下一个月
                thisMonth = month + 1;
                showDate = showDate - lastDate;
            }
            if(thisMonth === 0) thisMonth = 12;
            if(thisMonth === 13) thisMonth = 1;

            ret.push({
                month: thisMonth,
                date: date,
                showDate: showDate
            })
        }
        return{
            year: year,
            month: month,
            days: ret
        };
    }

    datePicker.buildUI = function(year, month){
        monthData = this.getMonthData(year, month);
        var html = ' <div class="ui-date-picker-header">' +
        '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>' +
        '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' +
        '<span class="ui-datepicker-curr-month">' + monthData.year + '-' + ((monthData.month < 10) ? '0' + monthData.month : monthData.month) + '</span>' +
        '</div>' +
        '<div class="ui-datepicker-body">' +
        '<table><thead><tr>'+
        '<th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th>' +
        '</tr></thead><tbody>';
        
        console.log(monthData)
        // 主体部分
        var curday = today.getDate();
        console.log(curday)
        for(var i = 0, len = monthData.days.length; i < len; i++){
            var date = monthData.days[i];
            var month = monthData.month;
            if(i%7 === 0) html += '<tr>';
            if(date.month === month && date.showDate == curday){
                html += '<td data-date="'+ date.date+'" class="cur-day">'+ date.showDate +'</td>'
            }else if(date.month === month){
                console.log('jint')
                html += '<td data-date="'+ date.date+'" class="cur-month">'+ date.showDate +'</td>'
            }else{
                html += '<td data-date="'+ date.date+'">'+ date.showDate +'</td>'
            }
            if(i%7 === 6) html += '</tr>';
        }
        html += '</tbody></table></div>';
        return html;
    }

    datePicker.render = function(direction){
        var year, month;
        if(monthData){
            year = monthData.year;
            month = monthData.month;
        }else{

        }
        if(direction === 'prev') {
            month--;
            if(month === 0) {
                month = 12; 
                year--;
            }
        }
        if(direction === 'next') month++;

        var html = this.buildUI(year, month);
        if(!$wrapper){
            $wrapper = document.createElement('div');
            document.body.appendChild($wrapper);
            $wrapper.className = 'ui-datepicker-wrapper';
        }
        $wrapper.innerHTML = html;
    }

    datePicker.init = function(input){
        datePicker.render();
        var $input = document.querySelector(input);
        var isOpen = false;
        $input.addEventListener('click', function(){
            if(isOpen){
                $wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen = false;
            }else{
                $wrapper.classList.add('ui-datepicker-wrapper-show');
                var left = $input.offsetLeft;
                var top = $input.offsetTop + $input.offsetHeight + 2;
                $wrapper.style.top = top + 'px';
                $wrapper.style.left = left + 'px';
                isOpen = true;
            }
        }, false);

        // 切换月份
        $wrapper.addEventListener('click', function(e){
            var $target = e.target;
            console.log($target)
            // 不是切换月份的按钮
            if(!$target.classList.contains('ui-datepicker-btn'))
                return;
            if($target.classList.contains('ui-datepicker-prev-btn')){
                datePicker.render('prev');
            }else if($target.classList.contains('ui-datepicker-next-btn')){
                datePicker.render('next');
            }
        }, false);

        // 点击选择日期
        $wrapper.addEventListener('click', function(e){
            var $target = e.target;
            if($target.tagName.toLowerCase() !== 'td') return;
            var date = new Date(monthData.year, monthData.month - 1, $target.dataset.date)
            $input.value = format(date);
            $wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = false;
        }, false);
    }

    function format(date){
        var ret = '';
        var padding = function(num){
            if(num <= 9){
                return '0' + num;
            }
            return num;
        }
        ret += date.getFullYear() + '-' ;
        ret += padding(date.getMonth() + 1) + '-';
        ret += padding(date.getDate());
        return ret;
    }
    // 对外暴露dataPicker方法
    window.datePicker = datePicker;
})();