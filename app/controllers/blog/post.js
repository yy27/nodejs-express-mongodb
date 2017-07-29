var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');
  Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/article', router);
};
router.get('/', function (req, res, next) {
  var sortObj = {};
  sortObj['created'] = 'desc';
  Post.find({published:true}).sort(sortObj).populate('category').populate('author').exec(function (err, posts) {
    
    var pageC = 5;
    var nowPage = req.query.page || 1
    var postsT = posts.length;
    var pageT = Math.ceil(postsT/pageC);
    if(nowPage>pageT){
      nowPage = pageT
    }
    if (err) return next(err);
    res.render('blog/index', {
      title: 'Generator-Express MVC',
      posts: posts.slice((nowPage-1)*pageC,nowPage*pageC),
      pageT:pageT,
      nowPage:nowPage,
      startPage:nowPage-5,
      pretty:true,
    });
  });
});

router.get('/category/:name', function (req, res, next) {
  var Cname = req.params.name;
  Category.find({name:Cname}).exec(function(err,categories){
    if(err) return next(err);
    Post.find({category:categories,published:true})
      .sort('created')
      .populate('category')
      .populate('author')
      .exec(function (err,posts){
        if(err) return next(err);
        var pageC = 5;
        var nowPage = req.query.page || 1
        var postsT = posts.length;
        var pageT = Math.ceil(postsT/pageC);
        if(nowPage>pageT){
          nowPage = pageT
        }
        res.render('blog/category', {
          name:Cname,
          title: 'Generator-Express MVC',
          posts: posts.slice((nowPage-1)*pageC,nowPage*pageC),
          pageT:pageT,
          nowPage:nowPage,
          startPage:nowPage-5,
          postsT:postsT,
          pretty:true
        });
      });
    
  });
});

router.get('/view/:_id', function (req, res, next) {
  Post.find({_id:req.params._id})
    .populate('category')
    .populate('author')
    .exec(function (err,posts){
      if(err) return next(err);
      res.render('blog/view', {
        title: 'detail',
        posts:posts,
      });
    })
  
});
router.get('/zan', function (req, res) {
  var nowId = req.query.id;
  Post.findOne({_id:nowId})
    .exec(function (err,posts){
      if(err) return res.json({result:-1});
      var ajax = {
        result:1,
        posts:posts
      };
      posts.meta.fava = posts.meta.fava+1;
      posts.markModified('meta');
      posts.save(function (err){
        if(err){
          return res.json({result:-2});
        }
      });
      return res.json(ajax);
  })
});
router.get('/comment',function (req,res){
  var nowId = req.query.id;
  var content = req.query.content;
  var user = req.query.user;
  Post.findOne({_id:nowId})
    .exec(function (err,posts){
      if(err) return res.json({result:-1});
      var ajax = {
        result:1
      };
      var comment = {
        content:content,
        time:new Date(),
        user:user
      }
      posts.comments.push(comment);
      posts.markModified('comments');
      posts.save(function(err){
        if(err){
          return res.json({result:-2});
        }
      });
      return res.json({result:1});
  })
})
// router.get('/contact', function (req, res, next) {
//   res.render('blog/index', {
//     title: 'contact us'
//   });
// });
