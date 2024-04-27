const express = require("express")
const app = express()
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");
const { time } = require("console");
mongoose.connect("mongodb://localhost:27017/Restaurant")



const UserSchema = new mongoose.Schema({
    name: String,
    address: String,
    email_Id: String,
    password : String
})


const NewUser = mongoose.model("NewUsers",UserSchema)



app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, "public")));



//--------------------------------------------------- 
//              dashboard routing
//---------------------------------------------------



app.get("/yummy" , (req,res) => {
    res.sendFile(__dirname + "/public/" + "navbar.html")
})




// -----------------------------------------------------
//              create account routing
// -----------------------------------------------------

app.get("/create_account" ,(req,res) => {
    res.sendFile(__dirname + "/public/" + "login.html")
    
})



app.post("/create_account" ,(req,res) => {

    let data = new NewUser( {name : req.body.name, address : req.body.address, email_Id: req.body.email, password : req.body.password} )

    NewUser.findOne({email_Id : req.body.email}).then(user => {
        if(user) {
            console.log(user)
            console.log("Account Already exists")
            res.send(`<script>alert('Account already exists with this Email Id . You are being redirected to the login page.');setTimeout(function(){window.location.href = '/login';}, 4000);</script>`);
            
        }else{
            data.save().then(doc => {
                console.log(doc)
                console.log("New user created!!")
                res.send(`<script>alert('You have successfully created your account ');setTimeout(function(){window.location.href = '/yummy';}, 4000);</script>`);

            }).catch(err => {
                console.error(err)
            })
        }
    }).catch(err => {
        console.error("Error finding user:", err);
        res.status(500).send("Error checking user data. Please try again.");
    })

})




//------------------------------------------------------- 
//              login page routing
//-------------------------------------------------------

app.get("/login" , (req,res) => {
    res.sendFile(__dirname + "/public/" + "login2.html")
})

app.post("/login" , (req,res) => {

    
    NewUser.findOne({email_Id : req.body.email , password : req.body.password}).then(user => {
        if(user){
            console.log("Login Succesfull")
            console.log(user)
            res.send(`<script>alert('Login successfull. You are being redirected to the restaurant home page.');setTimeout(function(){window.location.href = '/yummy';}, 4000);</script>`);

        }else{
            console.log("Invalid cedentials")
            res.send("Invalid email or password OR you have not created account. Please try again. ");   // Respond with an error message
        }

    }).catch(err => {
        console.log(err)
        res.status(500).send("Internal Server Error");    // Respond with a server error if something goes wrong
    })

})

// -----------------------------------------------
//              Table booking
// -----------------------------------------------

const TableSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    date: { type: Date, default: Date.now },
    time: String,
    people: Number

});

const table = mongoose.model("NewTable",TableSchema)
let total_Tables_at_present = 50

// app.get("/book_table" , (req,res)=>{
//     res.sendFile(__dirname + "/public/" + "navbar.html")
// })

app.post("/book_table" , (req,res) => {


    if(total_Tables_at_present >= req.body.people){

        total_Tables_at_present = total_Tables_at_present - req.body.people;

        let data1 = new table( {name : req.body.name, email : req.body.email, phone : req.body.phone,  date : req.body.date , time : req.body.time , people : req.body.people } )


        data1.save().then(doc => {
            if(doc){
                res.send(`<script>alert('Your table for ${req.body.people} persons has been booked Successfully');window.location.href='/yummy'</script>`)
                console.log("Table Booked")
            }else{
                res.send("Something went wrong");
            }
        }).catch(err => {
            console.error(err)
        })
        console.log(`total tables present ${total_Tables_at_present}`)
    }else{


        if(total_Tables_at_present == 0){
            res.send(`<script>alert('Sorry for inconvenience , Our restaurant is full'); window.location.href='/yummy';</script>`)
        }
        else{
            res.send(`<script>alert('tables available ${total_Tables_at_present} only'); window.location.href='/yummy';</script>`)
            console.log("Restaurant is full")
        }
    }
})


app.listen(2000, () => {
    console.log(`Server started at port 2000`)
})