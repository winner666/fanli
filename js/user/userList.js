
var pageSize =10; //每页显示数量
var pageNum = 1; //当前页数
var total = 0; //总页数
var bTestTag = true;
orderList(1)

function orderList(pageNum, isInit) {
    var name = $('#name').val(); //用户名
    var vipGrade = $('#vipGrade').val(); //会员等级
    var phone = $('#phone').val(); //手机号码
    if(name==''){
        name=null
    }
    if(vipGrade==''){
        vipGrade=null
    }
    if(phone==''){
        phone=null
    }
    $.ajax({
        type: "post",
        url: http + "user/getUserInfo",
        async: true,
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            "code":phone,
            "name":name,
            "vipGrade":vipGrade,
            "page": pageNum,
            "size": pageSize
        }),
        success: function(data) {
            console.log(data);
            if(data.code == 200) {
                total = Math.ceil(data.total / pageSize);
                if(bTestTag || isInit == -1) {
                    //console.log("为什么没进来？")
                    bTestTag = false
                    isInit = !isInit
                    page()
                } else {
                    //console.log("执行下一页")
                }
                var list = data.obj;
                if(list.length != 0) {
                    var html = '';

                    for(var i = 0; i<list.length; i++) {
                        var newDate = new Date();
                        var createTime = list[i].createTime
                        newDate.setTime(createTime);
                        time = newDate.format('yyyy-MM-dd hh:mm:ss');

                        html+='<tr>'
                        if(list[i].name==null){
                            list[i].name=''
                        }
                        html+='<td class="am-text-middle">'+list[i].name+'</td>'
                        html+='<td class="am-text-middle">'+list[i].code+'</td>'
                        if(list[i].sex==1){
                            html+='<td class="am-text-middle">女</td>'//性别
                        }else if(list[i].sex==0){
                            html+='<td class="am-text-middle">男</td>'//性别
                        }else{
                            html+='<td class="am-text-middle">不确定</td>'//性别
                        }
                        if(list[i].inName==null){
                            list[i].inName=''//上级名称
                        }
                        html+='<td class="am-text-middle">'+list[i].inName+'</td>'
                        html+='<td class="am-text-middle">'+list[i].supMoney+'</td>'
                        if(list[i].agentOne==null){
                            list[i].agentOne=0
                        }
                        if(list[i].agentTwo==null){
                            list[i].agentTwo=0
                        } if(list[i].agentThree==null){
                            list[i].agentThree=0
                        }

                        html+='<td class="am-text-middle">'+list[i].agentOne+'</td>'
                        html+='<td class="am-text-middle">'+list[i].agentTwo+'</td>'
                        html+='<td class="am-text-middle">'+list[i].agentThree+'</td>'
                        html+='<td class="am-text-middle">'+list[i].vipGrade+'</td>'
                        html+='<td class="am-text-middle">'+time+'</td>'
                        if(list[i].isDel==0){
                            html+='<td class="am-text-middle">启用</td>'
                        }else{
                            html+='<td class="am-text-middle">未启用</td>'
                        }

                        html+='<td class="am-text-middle">'
                        html+='<div class="tpl-table-black-operation">'
                        html+='<a href="javascript:;" class="table-warning start" style="border-color:#ea6e0c;color:#ea6e0c;"  userId="'+list[i].userId+'"  isDel="'+list[i].isDel+'">'
                        if(list[i].isDel==0){
                            html+='<i class="am-icon-archive"></i>未启用'
                        }else{
                            html+='<i class="am-icon-archive"></i>启用'
                        }
                        html+='</a>'
                        html+='</div>'
                        html+='</td>'
                        html+='</tr>'
                    }

                    $('.list').html(html)
                    //点击启用
                    $('.start').click(function(){
                        console.log(56)
                        var userId = $(this).attr("userId");
                        var isDel=$(this).attr("isDel");
                        if(isDel==1){
                            isDel=0
                        }else if(isDel==0){
                            isDel=1
                        }
                        //console.log(typeId,isDel)
                        $.ajax({
                            type: "post",
                            url: http + "user/updateUser",
                            async: true,
                            contentType: "application/json;charset=utf-8",
                            dataType: 'json',
                            data: JSON.stringify({
                                "userId":userId,
                                "isDel": isDel

                            }),
                            success: function(data) {

                                if(data.code==200){
                                    console.log('启用成功')
                                    orderList(pageNum)
                                }
                            }
                        })
                    })
                } else {
                    $('.list').html('暂无数据')
                }

            } else {
                $('.list').html('网络错误')
            }

        },
        error: function(data) {
            console.log(data)
        }
    });
}

//分页
function page() { //这段代码不能放在函数内执行，会引起下一页出问题
    $(".tcdPageCode").remove();
    $(".isPage").append("<div class='tcdPageCode'></div>");

    $(".tcdPageCode").createPage({
        pageCount: total,
        current: 1,
        backFn: function(p) {
            pageNum=p
            orderList(p)
        }
    });
}