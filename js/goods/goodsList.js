/**
 * Created by Administrator on 2017/9/20.
 */
//获取商户类别
shoptype();
//设置特价商品
// $('[data-type="checkbox"]').change(function () {
//     if($(this).is(':checked')){
//         console.log(666)
//     }else{
//         console.log(777)
//     }
// });


var pageSize =10; //每页显示数量
var pageNum = 1; //当前页数
var total = 0; //总页数
var bTestTag = true;
orderList()

function orderList(pageNum, isInit) {
    var shopName = $('#shopName').val(); //店铺名称
    var selectType = $('#selectType').val(); //商户类别
    console.log(selectType)
    var status = $('#type').val(); //商户状态
    var isDelToPainc=null;
    if(selectType == -1) {
        selectType = null;
    }
    if(status == -1) {
        status = null;
    }
    if($('[data-type="checkbox"]').is(':checked')){
        isDelToPainc=0
    }else{
        isDelToPainc=null;
    }
    $.ajax({
        type: "post",
        url: http + "goods/getGoodsInfoList",
        async: true,
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            "name":shopName,
            "shopId":selectType,
            "isDel":status,
            "isDelToPainc":isDelToPainc,
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
                        var detailLength=list[i].detail.length;
                        var detail2=list[i].detail
                        if(detailLength>11){
                            detail=detail2.substring(0,11)+'...'
                        }else{
                            detail=list[i].detail
                        }
                        if(list[i].price==null){
                        	list[i].price=''
                        }
                        if(list[i].presentPrice==null){
                        	list[i].presentPrice=''
                        }
                        if(list[i].salesVolume==null){
                        	list[i].salesVolume=''
                        }
                        html+='<tr>'
                        html+='<td class="am-text-middle"><img src="'+list[i].img+'" class="tpl-table-line-img" alt=""></td>'
                        html+='<td class="am-text-middle">'+list[i].goodsId+'</td>'
                        html+='<td class="am-text-middle">'+list[i].name+'</td>'
                        html+='<td class="am-text-middle">'+list[i].shopName+'</td>'
                        html+='<td class="am-text-middle">'+list[i].typeName+'</td>'
                        html+='<td class="am-text-middle">'+list[i].price+'</td>'
                        html+='<td class="am-text-middle">'+list[i].presentPrice+'</td>'
                        html+='<td class="am-text-middle">'+list[i].salesVolume+'</td>'
                        html+='<td class="am-text-middle"><a title="'+detail2+'"  href="javascript:;">'+detail+'</a></td>'
                        if(list[i].isDel==0){
                            html+='<td class="am-text-middle">正常</td>'
                        }else{
                            html+='<td class="am-text-middle">下架</td>'
                        }
                        html+='<td class="am-text-middle">'
                        html+='<div class="tpl-table-black-operation">'
                        html+='<a href="javascript:;" class="table-warning start" style="border-color:#ea6e0c;color:#ea6e0c;"  goodsId="'+list[i].goodsId+'"  isDel="'+list[i].isDel+'">'
                        if(list[i].isDel==0){
                            html+='<i class="am-icon-archive"></i>下架'
                        }else{
                            html+='<i class="am-icon-archive"></i>正常'
                        }
                        html+='</a>'
                        html+='<a href="javascript:;" class="tpl-table-black-operation-del look" goodsId="'+list[i].goodsId+'">'
                        html+='<i class="am-icon-binoculars"></i> 查看'
                        html+='</a>'
                        html+='</div>'
                        html+='</td>'
                        html+='</tr>'
                    }

                    $('.list').html(html)
                    //查看
                    $('.look').click(function() {
                        var goodsId = $(this).attr("goodsId");
                     console.log(goodsId)
                        $('.shade').show();
                        $('.popup').show();
                        lookDetail(goodsId)

                    })
                    //点击启用
                    $('.start').click(function(){

                        var goodsId = $(this).attr("goodsId");
                        var isDel=$(this).attr("isDel");
                        if(isDel==1){
                            isDel=0
                        }else if(isDel==0){
                            isDel=1
                        }
                        //console.log(typeId,isDel)
                        $.ajax({
                            type: "post",
                            url: http + "goods/editGoods",
                            async: true,
                            contentType: "application/json;charset=utf-8",
                            dataType: 'json',
                            data: JSON.stringify({
                                "goodsId":goodsId,
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

$('.specialGoods').click(function(){
    $('.shade').show();
    $('.setGoods').show();
})


function shoptype() {
    $.ajax({
        type: "post",
        url: http + "shop/getShopInfo",
        async: true,
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            "name": null,
            "page": 1,
            "size": 10000000,
        }),
        success: function(data) {
            //console.log(data);
            if(data.code == 200) {
                var list = data.obj;
                if(list.length != 0) {
                    var html = ''
                    html += '<option value="-1">请选择</option>'
                    for(var i = 0; i < list.length; i++) {
                        html += '<option value="' + list[i].shopId + '">' + list[i].name + '</option>'
                    }
                    $('#selectType').html(html)
                } else {

                }
            } else {

            }
        }
    })
}

//关闭查看按钮
$('.close').click(function(){
    $('.shade').hide();
    $('.popup').hide();
})
//查看商品详情方法
function lookDetail(goodsId){
    $.ajax({
        type:'POST',
        url:http+'goods/getGoodsInfoList',
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify({
            "goodsId":goodsId
        }),
        success:function(data){
                console.log(data)
            var obj=data.obj[0];
            $('#goodsId').val(obj.goodsId);
            $('#goodsName').val(obj.name)
            $('#nameShop').val(obj.shopName)
            $('#typeName').val(obj.typeName)
            $('#price').val(obj.price);
            $('#presentPrice').val(obj.presentPrice)//现价
            $('#salesVolume').val(obj.salesVolume);
            $('#remark').val(obj.detail)
            $('#ImgPic').attr('src',obj.img)
        },
        error:function(data){

        }

    })

}
var panicId=null
$('#searchBtn').click(function(){
    panicId= $('#search') .val();
    if(panicId==''){
        panicId=null
    }
    getPanicToSpecialOffer();
})
//获取抢购商品列表
getPanicToSpecialOffer();
function getPanicToSpecialOffer(){
		
    $.ajax({
        type:'POST',
        url:http+'panic/getPanicToSpecialOffer',
        dataType:'json',
         async: false,
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify({
            "isSpecialOffer":0,
            "page":"1",
            "size":100000,
            "panicId":panicId
        }),
        success:function(data){
            console.log('抢购列表')
            console.log(data);//点击删除为什么这里有输出？
            var list=data.obj;
            $('.goodsList').html('');
            var str=''
            if(list.length!=0){
            	for(var i=0;i<list.length;i++){
            		str+='<div class="am-u-sm-12">'
		            str+='<div class="am-u-sm-3">'
		            str+='<input type="checkbox"  value="'+list[i].panicId+'" class="check" name="test" goodsname="'+list[i].name+'">'
		            str+='</div>'
		            str+='<div class="am-u-sm-3">'+list[i].panicId+'</div>'
		            str+='<div class="am-u-sm-6">'+list[i].name+'</div>'
		            str+='</div>'
            	} 
            	$('.goodsList').html(str);
            }else{
                $('.goodsList').html('暂无数据')
            }
        }
    })
}
//获取特价商品列表
getSpecial()
function getSpecial(){

    $.ajax({
        type:'POST',
        url:http+'panic/getPanicToSpecialOffer',
        dataType:'json',
         async: false,
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify({
            "isSpecialOffer":1,
            "page":"1",
            "size":100000,
        }),
        success:function(data){
        	console.log('特价商品列表')
            console.log(data);
            var list=data.obj;
            var htmlstr=''
                 $('.specialList').html('');
            if(list.length!=0){
                for(var i=0;i<list.length;i++){
                    htmlstr+='<div class="am-u-sm-12 special">'
                    htmlstr+='<div class="am-u-sm-3">'+list[i].panicId+'</div>'
                    htmlstr+='<div class="am-u-sm-6">'+list[i].name+'</div>'
                    htmlstr+='<div class="am-u-sm-3">'
                    htmlstr+='<span class="specailBtn" id="'+list[i].panicId+'">删除</span>'
                    htmlstr+='</div>'
                    htmlstr+='</div>'
                }
                $('.specialList').html(htmlstr);
                //删除特价商品
                $('.specailBtn').off('click').on('click',function(){
                    var id= $(this).attr('id');
                    var objone={};
                    objone.panicId=id;
                    objone.isSpecialOffer=0;
                    var arr1=[];
                    arr1.push(objone);
                    Special(arr1);
                    getSpecial()
                    getPanicToSpecialOffer();
                    

                })
            }else{
               // $('.specialList').html('暂无数据')
            }
        }
    })
}
//
//向右
$('.right').off('click').click(function(){
    if($("input[name='test']:checked").length >= 4)
    {
        alert("最多选3个!")
        return false;
    } 
//判断是否存在某个class
if($(".specialList").children().hasClass("special")){
	console.log(666)
	if($('.special').length==3){
		alert('只能有三个特价商品')
		return false;
	}
}
    var specialArr=[];
    var str=''
    var goodsArr=[]
    $('input[name="test"]:checked').each(function(index,text){
    	 var obj={};
    	 var goodsObj={}

		obj.panicId=$(this).val();
		obj.isSpecialOffer=1;
		specialArr.push(obj);
        goodsObj.id=$(this).val();
        goodsObj.name=$(this).attr('goodsname')
        goodsArr.push(goodsObj);
	});

//  for(var i=0;i<goodsArr.length;i++){
//      str+='<div class="am-u-sm-12 special">'
//      str+='<div class="am-u-sm-4">'+goodsArr[i].id+'</div>'
//      str+='<div class="am-u-sm-4">'+goodsArr[i].name+'</div>'
//      str+='<div class="am-u-sm-4">'
//      str+='<span class="specailBtn" id="'+goodsArr[i].id+'">删除</span>'
//      str+='</div>'
//      str+='</div>'
//  }
//  $('.specialList').append(str);
console.log(specialArr)
    Special(specialArr)
    getSpecial()
    getPanicToSpecialOffer();//抢购列表



})
//将抢购商品变成特价商品
function Special(arr){
    console.log(arr)
    $.ajax({
        type:'POST',
        url:http+'panic/setPanicBySpecialOffer',
        dataType:'json',
          async: false,
        contentType: "application/json;charset=utf-8",
        data:JSON.stringify({
            "panics":arr
        }),
        success:function(data){

        }
    })
}


//特价商品确定
$('.typeSure').click(function(){

})
//特价商品取消
$('.typeCancle').click(function(){
    $('.shade').hide();
    $('.setGoods').hide();
})