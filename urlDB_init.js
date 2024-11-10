let mongoose=require('mongoose')
let urlDB=new mongoose.Schema({
    short_url:Number,
    origin_url:String
});
module.exports=mongoose.model('UrlDB',urlDB);