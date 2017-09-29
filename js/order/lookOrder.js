/**
 * Created by Administrator on 2017/9/14.
 */
console.log(sessionStorage.getItem('orderId'))
$.ajax({
    type:"post",
    url: http + "order/getOrderByShopping",
    async:true,
    contentType: "application/json;charset=utf-8",
    dataType: 'json',
    data: JSON.stringify({
        "orderId":sessionStorage.getItem('orderId')
    }),
    success: function(data){
        console.log(data);
       // var orderTime = data.obj.orderListVo.orderTime;
        var payTime = data.obj.payTime;
        //orderTime = (orderTime==null||orderTime=='')?'':orderTime.substring(0,orderTime.length-2);
        payTime = (payTime==null||payTime=='')?'':payTime.substring(0,payTime.length-2);
        $("#orderSn").val(data.obj.payOrderSn);
        $('#mobile').val(data.obj.code)
        $('#userName').val(data.obj.shopName)
        $('#price').val(data.obj.price)
        if(data.obj.payType==0){
            $('#moneyType').val('积分支付')
        }
        else if(data.obj.payType==1){
            $('#moneyType').val('支付宝')
        } else if(data.obj.payType==2){
            $('#moneyType').val('微信')
        }else if(data.obj.payType==3){
            $('#moneyType').val('银联')
        }
        $('#time').val(payTime)
        if(data.obj.type==0){
            $('#type').val('商家配送')
        }else if(data.obj.type==1){
            $('#type').val('自提')
        }
        if(data.obj.state==0){
            $('#state').val('代付款')
        }else if(data.obj.state==1){
            $('#state').val('未接单')
        }else if(data.obj.state==2){
            $('#state').val('已接单')
        }else if(data.obj.state==3){
            $('#state').val('配送中')
        }else if(data.obj.state==4){
            $('#state').val('已完成')
        }else if(data.obj.state==5){
            $('#state').val('申请退款')
        }else if(data.obj.state==6){
            $('#state').val('已退款')
        }else if(data.obj.state==7){
            $('#state').val('退款失败')
        }
        var list = '';
        var totalMoney = 0;
        for(var i=0;i<data.obj.shoppings.length;i++){
            var goods=data.obj.shoppings[i];
            list += '<tr>'+
                '<td class="goodsId">'+goods.goodsName+'</td>'+
                '<td class="goodsName">'+goods.shopName+'</td>'+
                '<td class="goodsTypeName">'+goods.typeName+'</td>'+
                '<td class="goodsPrice">'+goods.price+'</td>'+
                '<td class="number" >'+goods.number+'</td>'+
                '</tr>'
        }
        $('#tbody').html(list);

    }
});