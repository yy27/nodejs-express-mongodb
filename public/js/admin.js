$(".delect").click(function(){
	var _this = this;
	var postid = $(_this).data('id');
	console.log(postid);
	$.post('/admin/article/delect',{postid:postid},function(data){
		if(data.result>0){
			$(_this).parents("tr").remove();
			alert("删除成功！");
		} else {
			alert('删除失败！');
		}
	})
});
$('#add_category').click(function(){
	$(".window-wrap").show();
});
$("#edit_category").click(function(){
	var category = $('input[name="category"]:checked').val();
	if(!category){
		alert("请选择需要修改的分类！");
	} else {
		var c_arr = category.split('/');
		$(".c-edit").attr("data-id",c_arr[0]);
		$(".c-name").attr('value',c_arr[1]);
		$(".window-wrap").show();
	}
	
});
$('#del_category').click(function(){
	var category = $('input[name="category"]:checked').val();
	if(!category){
		alert("请选择需要修改的分类！");
	} else {
		var c_arr = category.split('/');
		var c_id = c_arr[0];
		var c_name = c_arr[1];
		$.post('/admin/category/delect',{c_id:c_id,c_name:c_name},function(data){
			if(data.result<0){
				window.location.reload();
			} else {
				$('.c-del-msg').find('.text').empty().text("删除分类失败！");
				$('.c-del-msg').show();
				setTimeout("$('.c-del-msg').hide()",2000);
			}
		});
	}
});
function send_c(){
	var c_name = $('#c_name').val();//添加时-输入的分类名
	var edit_name = $('.c-edit').data('id');//修改时-分类名id
	if(!edit_name){
		$.post('/admin/category/add',{c_name:c_name},function(data){
			if(data.result>0){
				$(".window-wrap").hide();
				window.location.reload();
			} else if(data.result==0) {
				$(".c-danger-msg").find(".text").empty().text("分类已存在！")
				$(".c-danger-msg").show();
			} else {
				$(".c-danger-msg").find(".text").empty().text("分类保存失败！")
				$(".c-danger-msg").show();
			}
		});
	} else {
		$.post('/admin/category/edit',{c_name:c_name,edit_id:edit_name},function(data){
			if(data.result>0){
				$(".window-wrap").hide();
				window.location.reload();
			} else if(data.result==0) {
				$(".c-danger-msg").find(".text").empty().text("分类已存在！")
				$(".c-danger-msg").show();
			} else {
				$(".c-danger-msg").find(".text").empty().text("分类保存失败！")
				$(".c-danger-msg").show();
			}
		});
	}
}