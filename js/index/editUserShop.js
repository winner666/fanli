/**
 * Created by Administrator on 2017/9/14.
 */


var shopId=sessionStorage.getItem('shopId');
//获取商户类别
shoptype();
//省列表
province(100000)
edit()
function edit(){
	$.ajax({
		type: "post",
		url: http + "shop/getShopById",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: 'json',
		data: JSON.stringify({
			"shopId":shopId
		}),
		success: function(data) {
			//console.log(data);
			var obj=data.obj
			$('.shopName').val(obj.name)
			$('#shopType').val(obj.shopTypeId)
			$('#adShow').attr('src',obj.img)
			$('#address').val(obj.address);
			$('#call').val(obj.tel);
			$('#remark').val(obj.detail)
			$('#provice').val(obj.cityVo.province);
				city(obj.cityVo.province)
			$('#city').val(obj.cityVo.city);
			area(obj.cityVo.city)
			$('#area').val(obj.city)
		}
		})
}

















var proviceId = -1; //省ID
var cityId = -1; //市ID
var areaId = -1; //区县ID

$(document).ready(function() {
	getTokenMessage();
});
/*获取七牛上传tocken方法
 * 在该ajax回调方法中,调用上传控件初始化方法*/
function getTokenMessage() {
	$.ajax({
		url: http + 'main/upToken',
		type: 'POST',
		data: {},
		cache: false,
		contentType: false, //不可缺
		processData: false, //不可缺
		dataType: 'json',
		success: function(data) {
			var obj = data;
			//console.log(data);
			/*初始化方法, param1:请求tocken|param2上传控件ID*/
			uploaderReady(obj.uptoken, 'AddPicture');
		}
	});
}

/*上传图片*/
var number = 0;
var aImgUpLoadBack = new Array();

function uploaderReady(token, divId) {
	var uploader = Qiniu.uploader({
		runtimes: 'html5,flash,html4',
		browse_button: divId, //上传按钮的ID
		container: adImg, //上传按钮的上级元素ID
		drop_element: 'btn-uploader',
		max_file_size: '100mb', //最大文件限制
		dragdrop: false,
		chunk_size: '4mb', //分块大小
		//Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
		uptoken: token,
		// 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
		// save_key: true,
		// 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
		domain: 'http://ojantumyo.bkt.clouddn.com/', //自己的七牛云存储空间域名
		multi_selection: false, //是否允许同时选择多文件
		//文件类型过滤，这里限制为图片类型
		filters: {
			mime_types: [{
				title: "Image files",
				extensions: "jpg,jpeg,gif,png"
			}]
		},
		auto_start: true,
		unique_names: true,
		init: {
			'FilesAdded': function(up, files) {
				//do something
			},
			'BeforeUpload': function(up, file) {
				//do something
			},
			'UploadProgress': function(up, file) {
				//可以在这里控制上传进度的显示
				//可参考七牛的例子
			},
			'UploadComplete': function() {
				//do something
			},
			'FileUploaded': function(up, file, info) {
				//每个文件上传成功后,处理相关的事情
				var domain = up.getOption('domain');
				var res = eval('(' + info + ')');
				var sourceLink = domain + res.key; //**获取上传文件的链接地址**
				$('#adShow').attr('src', sourceLink)

			},
			'Error': function(up, err, errTip) {
				//alert(errTip);
			},
			'Key': function(up, file) {
				//当save_key和unique_names设为false时，该方法将被调用
				return "";
			}
		}
	});
	uploader.start();
}



function province(cityId) {
	//console.log(66)
	$.ajax({
		type: "post",
		url: http + "city/getCity",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: 'json',
		data: JSON.stringify({
			"parentCode": cityId,
			"page": 1,
			"size": "100000000"
		}),
		success: function(data) {
			// console.log(data);
			var list = data.obj;
			var html = '<option value="-1">请选择</option>';
			for(var i = 0; i < list.length; i++) {
				html += '<option value="' + list[i].code + '">' + list[i].fullName + '</option>'
			}
			$('#provice').html(html)
		}
	})
}
//获取城市列表
function city(cityId) {

	$.ajax({
		type: "post",
		url: http + "city/getCity",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: 'json',
		data: JSON.stringify({
			"parentCode": cityId,
			"page": 1,
			"size": "100000000"
		}),
		success: function(data) {
			// console.log(data);
			var list = data.obj;
			var html = '<option value="-1">请选择</option>';
			for(var i = 0; i < list.length; i++) {
				html += '<option value="' + list[i].code + '">' + list[i].fullName + '</option>'
			}
			$('#city').html(html)
		}
	})
}
//获取区县

function area(cityId) {

	$.ajax({
		type: "post",
		url: http + "city/getCity",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: 'json',
		data: JSON.stringify({
			"parentCode": cityId,
			"page": 1,
			"size": "100000000"
		}),
		success: function(data) {
			// console.log(data);
			var list = data.obj;
			var html = '<option value="-1">请选择</option>';
			for(var i = 0; i < list.length; i++) {
				html += '<option value="' + list[i].code + '">' + list[i].fullName + '</option>'
			}
			$('#area').html(html)
		}
	})
}
//省改变
$('#provice').change(function() {
	proviceId = $(this).val();
	city(proviceId);
})
//市改变
$('#city').change(function() {
	cityId = $(this).val();
	area(cityId)
})
//区改变
$('#area').change(function() {
	areaId = $(this).val();
})



function shoptype() {
	$.ajax({
		type: "post",
		url: http + "shopPC/pcgetShopTypeList",
		async: false,
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
					for(var i = 0; i < list.length; i++) {
						html += '<option value="' + list[i].typeId + '">' + list[i].name + '</option>'
					}
					$('#shopType').html(html)
				} else {
					alert('请添加商户类别')
				}
			} else {
				alert('获取商户类别失败')
			}
		}
	})
}

//提交按钮
$('.btn').click(function() {
	addUserShop()
})

function addUserShop() {
	var shopName = $('.shopName').val(); //店铺名称
	var adShow = $('#adShow').attr('src'); //店铺照片	
	var address = $('#address').val(); //详细地址
	var call = $('#call').val(); //服务热线
	var remark = $('#remark').val(); //店铺简介
	var shoptype = $('#shopType').val(); //店铺类型
	var areaId=$('#area').val();
    console.log(areaId,shopName,adShow,address)
	if(areaId == -1 || shopName == '' || adShow == '' || address == '') {
		alert('请将信息填写完整');
		return false;
	}  

	$.ajax({
		type: "post",
		url: http + "shop/updateShop",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: 'json',
		data: JSON.stringify({
            "shopId":shopId,
            "name":shopName,
            "city":areaId,
            "address":address,
            "shopTypeId":shoptype,
            "detail":remark,
            "img":adShow,
            "tel":call
		}),
		success: function(data) {
			if(data.code==200){
				location.href='index.html'
			}
		}
	})

}