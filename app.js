// Built in
const express = require('express');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');




// User defined
const { registrationValidator} = require("./utils/validator");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Client
app.get("/register", (req, res) => {
    res.render("register");
})
// client
app.get("/login", (req, res) => {
    res.render("login");
})

// Post req for register and login
app.post('/register', async(req, res) => {
    const { name, username, email, password } = req.body;

    // Validation check
    try {
       await registrationValidator({ name, username, email, password });
    } catch (error) {
        return res.send({
            status: 400,
            message: "Invalid data type.",
            error: error
        })
    }

    // hashing the passord
    const hashedPassword = await bcrypt.hashSync(password, 9);
});

app.post("/login", (req, res) => {
    
});
app.get("/", (req,res)=>{
    res.send("App Started..");
})


// mongo atlas url
const mongoUrl = "mongodb+srv://manu:manu@cluster0.frte7pn.mongodb.net/dashboard"
app.listen(8000, () => {
    console.log("Server started....");
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to mongodb")).catch(err => console.Console.log(err));
    
});

