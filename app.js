// Built in
const express = require('express');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const validator = require('validator');
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);

// User defined
const { registrationValidator, loginValidation} = require("./utils/validator");
const UserSchema = require('./model/UserSchema');
const {auth} = require("./utils/auth");

const app = express();

// mongo atlas url
const mongoUrl = "mongodb+srv://manu:manu@cluster0.frte7pn.mongodb.net/dashboard";
let store = new MongoDBStore({
    uri: mongoUrl,
    collection : "sessions"
})

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// session auth
app.use(session({
    secret: 'This is a secret',
    store: store,
    resave: true,
    saveUninitialized: true
}))
app.set("view engine", "ejs");
mongoose.set('strictQuery', false)

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
    // check exiting user
    let existingUser;
    try {
        existingUser = await UserSchema.findOne({ email });
        existingUser = existingUser || await UserSchema.findOne({ username });
    } catch (error) {
         return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
    if (existingUser) {
        return res.send({
            status: 400,
            message: "User already existed.",
            error: ""
        })
    }
    // hashing the passord
    const hashedPassword = await bcrypt.hashSync(password, 9);
    let user = new UserSchema({ name, username, email, password: hashedPassword });

    try {
        await user.save();
        
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }

    res.redirect("/login");

});

app.post("/login", async(req, res) => {
    let { loginId, password } = req.body;
    try {
        await loginValidation({ loginId, password });
    } catch (error) {
           return res.send({
            status: 400,
            message: "Invalid data type.",
            error: error
        })
    }

    // Find the user 
    let userDB;
    try {
        if (validator.isEmail(loginId)) {
            userDB = await UserSchema.findOne({ email: loginId });
        } else {
            userDB = await UserSchema.findOne({ username: loginId });
        }
    } catch (error) {
         return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }
    // user does not exists
    console.log(userDB);
    if (!userDB) {
         return res.send({
            status: 400,
            message: "Please provide valid login details.",
            error: ""
        })
    }
    // macth password
    let isMacth = await bcrypt.compare(password, userDB.password);
    if (!isMacth) {
        return res.send({
            status: 400,
            message: "Wrong password.",
            error: ""
        })
    }

    req.session.isAuth = true;
    req.session.user = {
        _id: userDB._id,
        name: userDB.name,
        username: userDB.username,
        email : userDB.email
    }
    res.redirect("/profile");
});
app.get("/profile", auth, (req, res) => {
    
   res.render("profile");
})
app.get("/profile-data", auth, async(req, res) => {
    try {
        let profleData = await UserSchema.find({ username: req.session.user.username });
        res.send({
            status: 200,
            message: "Get profile data.",
            data: profleData
        })
    } catch (error) {
           return res.send({
            status: 500,
            message: "Internal server error",
            error: error
        })
    }  
})
app.get("/", (req,res)=>{
    res.send("App Started..");
})



app.listen(8000, () => {
    console.log("Server started....");
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to mongodb")).catch(err => console.Console.log(err));

});

