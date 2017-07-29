var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  Category = mongoose.model('Category'),
  User = mongoose.model('User'),
  slug = require('slug');

module.exports = function (app) {
  app.use('/admin/category', router);
};
router.get('/',function (req,res,next){
  Category.find().exec(function (err,categories){
    if(err) return next(err);
    res.render('admin/category', {
      title: 'Generator-Express MVC',
      categories:categories
    });
  });
});
router.post('/add',function (req,res,next){
  var name = req.body.c_name;
  Category.find({name:name}).sort('name').exec(function (err,category){
    if(err){
      return res.json({result:-1});
    } else if(category.length > 0) {//分类名在数据库中查询到
      return res.json({result:0});
    } else{
      //分类名数据中不存在，可以添加
      var category = new Category({
        name:name,
        slug:slug(name),
        created:new Date()
      });
      category.save(function(err){
        if(err){
          return res.json({result:-1});
        }else{
          return res.json({result:1});
          res.redirect('/admin/category');
        }
        
      });
    }

  });


});
router.post('/edit',function (req,res,next){
  var name = req.body.c_name;
  var edit_id = req.body.edit_id;
  Category.find({name:name}).exec(function (err,category){
    if(err){
      return res.json({result:-1});
    } else if(category.length > 0) {//分类名在数据库中查询到
      if(category[0].id == edit_id){
        //查询到的id和正在修改的id相同
        //分类名没有更改
        return res.json({result:1});
        res.redirect('/admin/category');
      } else{
        //名字已存在
        return res.json({result:0});
      }
      
    } else{
      Category.findOne({_id:edit_id}).exec(function (err,cate){
        cate.name = name;
        cate.slug = slug(name);
        cate.created = new Date();
        console.log(cate);
        cate.save(function(err){
          if(err){
            return res.json({result:-1});
          } else{
            return res.json({result:1});
            res.redirect('/admin/category');
          }
        })
      });
      
     //分类名数据中不存在，可以添加
    }

  });
});
router.post('/delect',function (req,res,next){
  var c_id = req.body.c_id;
  var c_name = req.body.c_name;
  Category.remove({_id:c_id},function(err){
    if(err){
      return res.json({result:-1});
    } else {
      return res.json({result:1});
    }
  });
});