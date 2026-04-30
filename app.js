const express=require("express");
const app=express();
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
const { v4: uuidv4 } = require("uuid");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

//our database
let tweets = [
    {
        id: uuidv4(),
        username: "Nukul",
        content: "Learning backend",
        createdAt: new Date()
    },
    {
        id: uuidv4(),
        username: "Aman",
        content: "Hello Twitter!",
        createdAt: new Date()
    }
];
//to get all tweets
app.get("/tweets",(req,res)=>{
    res.render("index",{tweets});
});

//post new user
app.get("/tweets/new",(req,res)=>{
    res.render("new");
});
 
app.post("/tweets",(req,res)=>{
    let {username,content}=req.body;
    let newTweet={
        id:uuidv4(),
        username,
        content,
        createdAt:new Date()
    }
    tweets.push(newTweet);
    res.redirect("/tweets");
});

//view single tweet
app.get("/tweets/:id",(req,res)=>{
    let {id}=req.params;
    let tweet=tweets.find((t)=>t.id===id);
    res.render("show",{tweet});
});

app.delete("/tweets/:id",(req,res)=>{
    let {id}=req.params;
    tweets=tweets.filter((tweet)=>tweet.id!=id);
    res.redirect("/tweets");
});

app.get("/tweets/:id/edit",(req,res)=>{
    let {id}=req.params;
    let tweet=tweets.find((t)=>t.id===id);
    res.render("edit",{tweet});
});


app.patch("/tweets/:id",(req,res)=>{
    let {id}=req.params;
    let {username,content}=req.body;
    let tweet=tweets.find((tweet)=>tweet.id==id);
    tweet.username=username;
    tweet.content=content;
    res.redirect("/tweets");
});

app.listen(8000,()=>{
    console.log("server running at port 8000");
});