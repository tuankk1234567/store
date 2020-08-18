const express = require('express');
const engines = require('consolidate');
const app = express();


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://tuandz123:3O6AaLvx8mcA0PLL@cluster0.v7dmx.mongodb.net/mystore";
//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.get('/',(req,res)=>{
    res.render('index');
})

 app.get('/products',async function(req,res){
     let client= await MongoClient.connect(url);
     let dbo = client.db("mystore");
     let results = await dbo.collection("products").find({}).toArray();
     res.render('allProducts',{model:results});
 })

app.get('/products2',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("mystore");
    let results = await dbo.collection("products2").find({}).toArray();
    res.render('allProducts2',{model:results});
})
 app.get('/insertProducts',(req,res)=>{
     res.render('insertProducts');
 }) 

 app.post('/doInsertProducts',async (req,res)=>{
    let inputId = req.body.txtId;
    let inputName = req.body.txtName;
     let inputSize = req.body.txtSize;
     let inputPrice = req.body.txtPrice;
     let inputAmount = req.body.txtAmount;
     let newProducts = { id_product:inputId, name : inputName , size : inputSize , price :inputPrice,amount : inputAmount};
     if(inputName.trim().length ==0){
        let modelError ={
                idError:"You must enter id!",
                nameError:"You must enter Name!",
                sizeError:"You must enter Size",
                priceError:"You must enter Price",
                amountError:"You must enter Amount",
            };
        res.render('insertProducts',{model:modelError});
    }else if(isNaN(inputAmount)){
            let modelError1 =  {amountError:"Enter number" };
            res.render('insertProducts',{model:modelError1});
        }else{
     let client= await MongoClient.connect(url);
     let dbo = client.db("mystore");
     await dbo.collection("products").insertOne(newProducts);
     res.redirect('/products');
    }
 })

app.get('/insertProducts2',(req,res)=>{
    res.render('insertProducts2');
})

app.post('/doInsertProducts2',async (req,res)=>{
    let inputId = req.body.txtId;
    let inputName = req.body.txtName;
     let inputSize = req.body.txtSize;
     let inputPrice = req.body.txtPrice;
     let inputAmount = req.body.txtAmount;
     let newProducts = { id_product:inputId, name : inputName , size : inputSize , price :inputPrice,amount : inputAmount};
     if(inputName.trim().length ==0){
        let modelError ={
                idError:"You have not entered a id!",
                nameError:"You have not entered a Name!",
                sizeError:"You have not entered a Size",
                priceError:"You have not entered a Price",
                amountError:"You have not entered a Amount",
            };
        res.render('insertProducts',{model:modelError});
    }else if(isNaN(inputAmount)){
            let modelError1 =  {amountError:"Only enter number" };
            res.render('insertProducts',{model:modelError1});
        }else{
     let client= await MongoClient.connect(url);
     let dbo = client.db("mystore");
     await dbo.collection("products2").insertOne(newProducts);
     res.redirect('/products2');
    }
 })


 app.get('/delete',async (req,res)=>{
     let inputId = req.query.id;
     let client= await MongoClient.connect(url);
     let dbo = client.db("mystore");
     var ObjectID = require('mongodb').ObjectID;
     let condition = {"_id" : ObjectID(inputId)};
     await dbo.collection("products").deleteOne(condition);
     res.redirect('/products');

 })

app.get('/delete2',async (req,res)=>{
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("mystore");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    await dbo.collection("products2").deleteOne(condition);
    res.redirect('/products2');     

})

 app.post('/doSearchProducts',async (req,res)=>{
     let inputName = req.body.txtName;
     let client= await MongoClient.connect(url);
     let dbo = client.db("mystore");
     let results = await dbo.collection("products").find({name: new RegExp(inputName,'i')}).toArray();
    
     res.render('allProducts',{model:results});

 })

app.post('/doSearchProducts2',async (req,res)=>{
    let inputName = req.body.txtName;
    let client= await MongoClient.connect(url);
    let dbo = client.db("mystore");
    let results = await dbo.collection("products2").find({name: new RegExp(inputName,'i')}).toArray();
    
    res.render('allProducts2',{model:results});

})

app.get('/update',async function(req,res){
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("mystore");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    let results = await dbo.collection("products").find(condition).toArray();
    res.render('update',{model:results});
})

 app.post('/doupdate',async (req,res)=>{
    let inputId = req.body.id;
    let inputId1 = req.body.txtId;
    let inputName = req.body.txtName;
    let inputSize = req.body.txtSize;
    let inputPrice = req.body.txtPrice;
    let inputAmount = req.body.txtAmount;
    let Change = {$set:{id_product:inputId1, name : inputName , size : inputSize , price : inputPrice , amount : inputAmount }};
        let client= await MongoClient.connect(url);
        var ObjectID = require('mongodb').ObjectID;
        let dbo = client.db("mystore"); 
        await dbo.collection("products").updateOne({_id : ObjectID(inputId)},Change);
        res.redirect('/products');

})



app.get('/update2',async function(req,res){
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("mystore");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    let results = await dbo.collection("products2").find(condition).toArray();
    res.render('update2',{model:results});
})

app.post('/doupdate2',async (req,res)=>{
    let inputId = req.body.id;
    let inputId1 = req.body.txtId;
    let inputName = req.body.txtName;
    let inputSize = req.body.txtSize;
    let inputPrice = req.body.txtPrice;
    let inputAmount = req.body.txtAmount;
    let Change = {$set:{id_product:inputId1, name : inputName , size : inputSize , price : inputPrice , amount : inputAmount }};
        let client= await MongoClient.connect(url);
        var ObjectID = require('mongodb').ObjectID;
        let dbo = client.db("mystore"); 
        await dbo.collection("products2").updateOne({_id : ObjectID(inputId)},Change);
        res.redirect('/products2');

})  

const PORT = process.env.PORT || 5000;
var server=app.listen(PORT,function() {});