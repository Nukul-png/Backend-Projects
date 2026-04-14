const express = require("express");
const app = express();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const path = require("path");

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


// create connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "delta_app"
});

// connect DB
connection.connect((err) => {
    if (err) {
        console.log("DB connection failed ❌");
        console.log(err);
    } else {
        console.log("Connected to MySQL ✅");
    }
});


// 🔥 Faker function
let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password()
    ];
};


// 🔥 Insert 100 users (ONLY ONCE)
function seedUsers() {
    let users = [];

    for (let i = 0; i < 100; i++) {
        users.push(getRandomUser());
    }

    let q = "INSERT INTO user (id, username, email, password) VALUES ?";

    connection.query(q, [users], (err, result) => {
        if (err) {
            console.log("Insert Error ❌");
            console.log(err);
        } else {
            console.log("100 Users Inserted ✅");
        }
    });
}

// 👉 Call this ONCE
seedUsers();


// 🏠 Home
app.get("/", (req, res) => {
    res.send("Server Running 🚀");
});


// 📄 Get all users
app.get("/users", (req, res) => {
    let q = "SELECT * FROM user";

    connection.query(q, (err, users) => {
        if (err) return res.send("DB Error");

        res.render("home.ejs", { users });
    });
});


// 👤 Get single user
app.get("/users/:id", (req, res) => {
    let { id } = req.params;

    let q = "SELECT * FROM user WHERE id = ?";

    connection.query(q, [id], (err, result) => {
        if (err) return res.send("DB Error");

        if (result.length === 0) {
            return res.send("User Not Found ❌");
        }

        let user = result[0];

        res.render("detail.ejs", { user });
    });
});


// //edit route
// app.get("/users/:id/edit",(req,res)=>{
//     let {id}=req.params;
//     let q="SELECT *FROM user WHERE id=?";
//     connection.query(q,[id],(err,result)=>{
//         if (err) return res.send("DB error");
//         if (result.length===0){
//             return res.send("User Not Found");
//         }
//         let user=result[0];
//         res.render("edit.ejs",{user});
//     })
// })

// //patch request
// app.patch("/users/:id",(req,res)=>{
//     let {id}=req.params;
//     let {username,email,password}=req.body;
//     let q="SELECT * FROM userWHERE id =?";
//     connection.query(q,[id],(err,result)=>{
//         if (err){
//             res.send("DB error");
//         }
//         let user=result[0];
//         if (password!=user.password){
//             return res.send("Wrong password");
//         }
//         let q2="UPDATE user SET username=?,email=? WHERE id=?";
//         connection.query(q2,[username,email,id],(err,result)=>{
//             if (err) return res.send("Update error");
//             res.redirect("/users");
//         });
//     });
// })

//edit route
app.get("/users/:id/edit",(req,res)=>{
    //first get the id to edit
    let {id}=req.params;
    let q="SELECT * FROM user WHHERE id=?";
    connection.query(q,[id],(err,result)=>{
        if (err){
            console.log("error in DB");
            return res.send("Error in Database");
        }
        if (result.length==0){
            return res.send("User Not found");
        }
        let user=result[0];
        res.render("edit.ejs",{user});
    });
});

//patch request
app.get("/uesrs/:id",(req,res)=>{
    let {id}=req.params;
    let {username,email,password}=req.body;
    let q="SELECT * FROM user WHERE id=?";
    connection.query(q,[id],(err,result)=>{
        if (err) throw err;
        if (result.length===0){
            res.send("User Not Found");
        }
        let user=result[0];
        let q2="UPDATE user SET username=?,email=?,password=?";
        connection.query(q,[username,email,password],(err,result)=>{
            if (err){
                console.log("Error in DB");
                res.send("Erro:",err);
            }
            res.redirect("/users");
        });
    });
});

app.delete("/users/:id",(req,res)=>{
    let {id}=req.params;
    let q="DELETE FROM user WHERE id=?";
    connection.query(q,[id],(err,result)=>{
        if (err){
            console.log("Error in Database");
            return res.send("Data base error");
        }
        console.log("user deleted");
        alert("user deleted successfully");
        res.redirect("/users");
    })
})

app.listen(8000, () => {
    console.log("Server running at port 8000");
});