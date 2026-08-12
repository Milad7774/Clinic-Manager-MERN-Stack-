const Doc = require('../modules/doctorModel');
const Patient = require('../modules/patientsModel');
const Session = require('../modules/sessionsModel')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
    // Create Token
function createToken(_id){
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' })
}
//? login
const login = async (req, res) =>{
    const { email, password } = req.body;

    try{
        const user = await Doc.login(email, password)

        const token = createToken(user._id)

        res.json({ email, token })
    }
    catch(e){
        res.status(400).json({ message: e.message })
    }
}
//? signup
const signUp = async (req, res) =>{
    const { email, password } = req.body;

    try{
        const user =  await Doc.signUp(email, password);

        const token = createToken(user._id);

        res.json({ email, token })

    }
    catch(e){
        res.status(400).json({ message: e.message })
    }
}
//! Delete
const deleteAccount = async (req, res) =>{

    const _id  = req.doc._id;

    if(!mongoose.isValidObjectId(_id) || !_id){
       return res.status(400).json({ message: "Invalid ID" })
    }

    try{
        //doc
        const Account = await Doc.findByIdAndDelete(_id);

        if(!Account) return res.status(404).json({ message: "Account not Found" });
        
        //patinet
        const patients = await Patient.deleteMany({ doc_id: _id });

        //sessions
        const sessions = await Session.deleteMany({ doc_id: _id });

        res.json({ message: "Account Deleted succesfully", email: Account.email })
    }
    catch(e){
        res.status(500).json({ message: "Server Error", error: e.message })
    }
}

module.exports = {
    login,
    signUp,
    deleteAccount
}