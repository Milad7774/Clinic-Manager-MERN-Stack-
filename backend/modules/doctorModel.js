//Create the Data
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Protecting and Verifying the data
const validator = require('validator');
const bcrypt = require('bcrypt');

//? Definig data
const doctorSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })


doctorSchema.statics.signUp = async function (email, password){
    //! validating data
    if(!email || !password){
        throw Error("All fields Must be filled!");
    }
    if(!validator.isEmail(email)){
        throw Error("Invalid Email format!");
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Use Stronger Password!");
    }
    const exists = await this.findOne({ email })

    if(exists){
        throw Error("Email already in use");
    }
    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await this.create({email, password: hashed})

    return user
}

doctorSchema.statics.login = async function(email, password){
    //! Validating
    if(!email || !password){
        throw Error("All fields Must be filled!");
    }
    if(!validator.isEmail(email)){
        throw Error("Incorrect Email format")
    }

    const user = await this.findOne({ email });

    if(!user){
        throw Error("Email is not associated with an account");
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error("Incorrect Password!");
    }

    return user
}

module.exports = mongoose.model('Doctor', doctorSchema)