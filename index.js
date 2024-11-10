require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

//modified:
const dns=require('dns');
const fetch=require('fetch');
const mongoose=require('mongoose');
const axios=require('axios');
const bodyParser=require('body-parser');
bodyParserMiddleware=bodyParser.urlencoded({extended:false});
let UrlDB=require('/workspace/boilerplate-project-urlshortener/urlDB_init.js');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//Modified from here until..
let index=1;
app.use(bodyParserMiddleware);

app.post('/api/shorturl',(req,res)=>{
 // console.log('#1');
  oUrl=req.body.url;
  
  if(oUrl.slice(0,8)!='https://' && oUrl.slice(0,7)!='http://'){
    res.send({ error: 'invalid url' });
    return;
  }
  else{
    urlobj=new URL(oUrl);
    hostval=urlobj.hostname.replace('www.','');
  }
 // console.log('oUrl:'+oUrl);
 // console.log('hostval:'+hostval);
  dns.lookup(hostval,(err,address)=>{
    if(err) return console.log(err);
    else{
     // console.log('address:'+address);
      recordinst=new UrlDB({short_url:index,origin_url:oUrl});//one instance in mongoDB
      recordinst.save().then(()=>{
        res.json({original_url:oUrl,short_url:index});
        index++;
       // console.log('Now,index='+index);
      });
    //>> Checking for Duplicates may be required.
    }
  });
});
app.get('/api/shorturl/:sUrl',(req,res)=>{
  sUrl=new Number(req.params.sUrl);
  UrlDB.find({short_url:sUrl}).then(function(data,err){
    if(err) return console.log('#2'+err);
    //console.log('#3:data:'+data+",type:"+typeof(data));
    outobj=JSON.parse(JSON.stringify(data[0]));
    outUrl=outobj.origin_url;
    //console.log('outUrl:'+outUrl);
    
   //outres=fetch.fetchUrl(outUrl);
   /*outres=axios.get(outUrl).then((response)=>{
      console.log('outres:'+response.data);
      res.send(response.data);
    });
    
    Window.open(outres);
    /*var newWindow = new Window().open();
    newWindow.document.write(html_response);*/
    res.redirect(outUrl);
  });
});

//until HERE.
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
