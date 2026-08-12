const jwt = require('jsonwebtoken');
const Doc = require('../modules/doctorModel');

const requireAuth = async (req, res, next) =>{

    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({ message: "Authorization Token required" });
    }

    const token = authorization.split(" ")[1]

    try{
        const { _id } = jwt.verify(token, process.env.SECRET)

        req.doc = await Doc.findOne({ _id }).select('_id')
        if(!req.doc) throw Error ("Email is not Associated to any account");
        next()
    }
    catch(e){
        res.status(401).json({ message: "Token invalid", error: e.message })
    }
}

module.exports = requireAuth;