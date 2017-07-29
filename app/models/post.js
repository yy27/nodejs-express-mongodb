// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var postSchema = new Schema({
  title: { type:String,require:true },
  content:{ type:String,require:true },
  category:{ type:Schema.Types.ObjectId,ref:'Category' },
  author:{ type:Schema.Types.ObjectId,ref:'User' },
  slug:{ type:String,require:true },
  published:{ type:Boolean,default:false },
  meta:{ type:Schema.Types.Mixed },
  comments:[ Schema.Types.Mixed ],
  created: { type:Date }
});

mongoose.model('Post', postSchema);

