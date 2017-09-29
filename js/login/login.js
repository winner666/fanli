/**
 * Created by Administrator on 2017/9/14.
 */
$('.login').click(function(){
	
    if($('#userName').val()==''){
        $('.prompt').html("请输入用户名！")
       
        return false;
    }
    else if($('#userPass').val()==""){
        $('.prompt').html("请输入密码！")
        return false;
    }
    
    else{
    	 jQuery.support.cors=true;
        $.ajax({
            type:"post",
            url: http + "admin/login",
            async:false,
            contentType: "application/json;charset=utf-8",
            dataType: 'json',
            crossDomain: true ,
            data: JSON.stringify({
                "code": $('#userName').val(),
                "pwd": $('#userPass').val()
            }),
            success: function(data){
                console.log(data);
               
                if(data.msg == "验证通过!"){
                    window.location.href = "../index/index.html";
                    var userName=$('#userName').val();
                    sessionStorage.setItem('userName',userName)
                }
                else{
                    $('.prompt').html(data.msg)
                }
            }
        });
    }
})
console.log(jQuery.fn.jquery);
    console.log($.fn.jquery);
    console.log($.prototype.jquery);