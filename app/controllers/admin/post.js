var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  Category = mongoose.model('Category'),
  User = mongoose.model('User'),
  slug = require('slug');

module.exports = function (app) {
  app.use('/admin/article', router);
};
router.get('/', function (req, res, next) {
  //json 数据的排序
  var sorttype = req.query.sorttype ? req.query.sorttype:'created';
  var sortdir = req.query.sortdir ? req.query.sortdir:'desc';
  var sortObj = {};
  sortObj[sorttype] = sortdir;

  Post.find({published:true}).sort(sortObj).populate('category').populate('author').exec(function (err, posts) {
    
    var pageC = 10;
    var nowPage = req.query.page || 1
    var postsT = posts.length;
    var pageT = Math.ceil(postsT/pageC);
    if(nowPage>pageT){
      nowPage = pageT
    }
    if (err) return next(err);
    res.render('admin/index', {
      title: 'Generator-Express MVC',
      posts: posts.slice((nowPage-1)*pageC,nowPage*pageC),
      pageT:pageT,
      sorttype:sorttype,
      sortdir:sortdir,
      nowPage:nowPage,
      startPage:nowPage-5,
      pretty:true,
    });
  });
});

router.get('/edit/:_id',function (req,res,next){
  var id = req.params._id;
  var type=req.query.type;
  Post.findOne({_id:req.params._id}).populate('category').populate('author').exec(function(err,post){
    res.render('admin/add', {
      title: '编辑页面',
      post:post,
      type:'edit/'+id
    });
  });
});
router.post('/edit/:_id',function (req,res,next){
  var id = req.params._id;
  var n_title = req.body.title;
  var n_content = req.body.content;
  var n_category = req.body.category;
  var n_published = req.body.published;
  var n_author = 'admin';
  Category.findOne({name:n_category}).exec(function (err,category){
    Post.findOne({_id:id}).exec(function (err,post){
      if(err) return next(err);
      
      post.title = n_title;
      post.content = n_content;
      post.category = category;
      post.published = n_published;
      post.created = new Date();
      post.save(function (err){
        if(err){
          return next(err);
        } else{
          console.log('edit保存成功');
        }
        
      });
    });
  })
  
  res.redirect('/admin/article');
});
router.get('/add',function (req,res,next){
  var type=req.query.type;
  res.render('admin/add', {
    title: '添加文章',
    post:{id:'',title:'',category:'',author:'',published:''},
    type:'add/'
  });
});
router.post('/add',function (req,res,next){
  var n_title = req.body.title;
  var n_content = req.body.content;
  var n_category = req.body.category;
  var n_published = req.body.published;
  var n_author = 'admin';
User.findOne({name:n_author}).exec(function (err,author){
  if(err) return console.log('cannot find user');
  Category.findOne({name:n_category}).exec(function (err,category){
    if(err) return console.log('cannot find categories');
      var post = new Post({
        title:n_title,
        content:n_content,
        category:category,
        author:author,
        slug:slug(n_title),
        published:n_published,
        meta:{fava:0},
        comments:[],
        created:new Date()
      });
      post.save(function(err){
        if(err) console.log('add数据保存失败！');
      })
  })
})
  
  res.redirect('/admin/article');
});
router.post('/delect',function (req,res,next){
  postid = req.body.postid;
  // console.log(postid);
  Post.remove({_id:postid},function (err){
    if(err){
      return res.json({result:-1});
    } else {
      return res.json({result:1});
    }
  });
})