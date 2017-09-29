/**
 * Created by Administrator on 2017/9/14.
 */
jQuery.support.cors=true;
//获取用户名
var userName=sessionStorage.getItem('userName');
if(userName==null){
    location.href='../login/login.html'
}else{
    $('.userName').html(userName)
}
//点击退出
$('.back').on('click',function(){
    sessionStorage.removeItem('userName')
    $.ajax({
        type:"post",
        url: http + "admin/exit",
        async:true,
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({

        }),
        success: function(data){
            console.log(data)
            if(data.code==200){
            	sessionStorage.removeItem('userName')
                location.href='../login/login.html'
                
            }
        }
    })
})
//弹出层取消
$('.close').click(function(){
    $('.mask').hide();
    $('.box').hide();
})

//时间
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if(/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for(var k in date) {
        if(new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
