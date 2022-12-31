const validator = require("validator");

// Validator
const registrationValidator = ({name,username, email, password}) => {
    
    return new Promise((resolve, reject) => {
        // Invalid type 
        if (typeof email != "string") reject("Invalid Email");
        if (typeof name != "string") reject("Invalid Name");
        if (typeof username != "string") reject("Invalid Username");
        if (typeof password != "string") reject("Invalid Password");

        // one of the data null undefined, falsy
        if (!email || !name || !username || !password) reject("Invalid Data");
        
        // invalid email format
        if (!validator.isEmail(email)) reject("Inavalid Email format");

        // required username length between 3 to 20
        if (username.length <= 3) reject("Username too short");
        if (username.length > 20) reject("Username too long");

        // required password length between 3 to 20
        if (password.length <= 3) reject("password too short");
        if (password.length > 20) reject("password too long");

        // 
        resolve();

    })
}
const loginValidation = ({loginId, password}) => {
    return new Promise((resolve, reject) => {
        if (typeof loginId !== "string" || typeof password !== "string" || !loginId || !password) {
            reject("Invalid data.");
        }
        resolve();
    })
}

module.exports = {
    registrationValidator,
    loginValidation
}