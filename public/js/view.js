$(function(){
  $('.zan').click(function(){
     var zan = $(this);
    var _id = zan.data('id');
    $.ajax({
      type: "GET",
      url: "/article/zan",
      data: {id:_id},
      contentType:'application/json; charset=UTF-8',
      dataType: "json",
      success: function(data){
        var bnum = zan.children("b");
        bnum.text(bnum.text()/1+1);
        console.log(data);
      },
      error:function(err){
        console.log(err);
      }
     });
  });
  $('#comment-btn').click(function(){
    var c_text = $(".comment-text").val();
    var c_id = $(this).data('id');
    var user = $('#user').text();
    if(c_text){
      $.ajax({
        type:'GET',
        url:'/article/comment',
        data:{id:c_id,content:c_text,user:user},
        contentType:'application/json; charset=UTF-8',
        dataType:'json',
        success:function(data){
          console.log(data);
        },
        error:function(err){
          console.log(err);
        }
      })
    } else {
      var wrong = '<div class="alert alert-danger" role="alert">'
                +'<button type="button" class="close" data-dismiss="alert"aria-hidden="true">'
                +'&times;</button>请输入评论内容</div>'
      $('.msg').empty().append(wrong);
    }
  })
})