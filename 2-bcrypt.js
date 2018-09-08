let bcrypt = require("bcryptjs");


//==================
//|Hashing password|
//==================
let password = "hi";
// second arg - basicly, telling bcrypt how STRONG the hash should be 
//  the higher the number - the higher is the hash
let hash_pass = bcrypt.hashSync(password, 14); 
console.log(hash_pass);

//=======================================
//|Comparing hashed password to original|
//=======================================
let areEqual = bcrypt.compareSync(password, hash_pass);
console.log('Passwords are matched?',areEqual);