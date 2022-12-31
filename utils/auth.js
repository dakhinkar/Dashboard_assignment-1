const { model } = require("mongoose");

const auth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
       return res.send({
        status: 401,
        message: "You are not authenticated"
        })  
    }
   
}

module.exports = {
    auth
};