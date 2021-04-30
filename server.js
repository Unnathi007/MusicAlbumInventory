const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017/Music';
const dbName='Music';
var db
MongoClient.connect(url,{ useUnifiedTopology: true }, (err,database)=>{
    if(err) return console.log(err);
    db=database.db(dbName);
    console.log(`Database : ${dbName}`);
});
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('views'));
app.get('/', (req,res)=>{
    db.collection('Albums').find().toArray((err,result)=>{
    if(err) return console.log(err)
      res.render('stockdetails.ejs',{data :result})
    })
});
app.get('/create', (req,res)=>{
    res.render('addstock.ejs')
});
app.post('/AddData',(req,res)=>{
    db.collection('Albums').insertOne(req.body,(err,result)=>{
        if(err) return console.group(err)
        res.redirect('/')    
      })
});
app.get('/updatestock', (req,res)=>{
    res.render('updatestock.ejs')
});
app.post('/update',(req,res)=>{
    db.collection('Albums').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].product_id==req.body.product_id){
                s=result[i].quantity
                break
            }
        }
        db.collection('Albums').findOneAndUpdate({product_id:req.body.product_id},{
            $set:{quantity: parseInt(s)+parseInt(req.body.quantity)}},{sort:{_id:-1}},
            (err,result)=>{
            if(err) return console.log(err)
            res.redirect('/')
        })
    })
})
app.get('/deleteproduct', (req,res)=>{
    res.render('deleteproduct.ejs')
});
app.post('/delete',(req,res)=>{
    db.collection('Albums').findOneAndDelete({product_id:req.body.product_id},(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})
.listen(3000);