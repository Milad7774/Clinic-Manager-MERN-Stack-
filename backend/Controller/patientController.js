const Patient = require('../modules/patientsModel');
const Session = require('../modules/sessionsModel')
const mongoose = require('mongoose')

// Get all patients for doc

const getAll = async (req, res) =>{

    const doc_id = req.doc._id;

    if(!mongoose.isValidObjectId(doc_id)){
       return res.status(400).json({ message: "Id is invalid" })
    }
    try{
        const patients = await Patient.find({ doc_id }).select({name: 1, phoneNumber: 1, _id: 1 })

        res.json( patients )
    }
    catch(e){
        res.status(500).json({ message: "Server Error", error: e.message })
    }
}

// Get a single patient

const getOne = async (req, res) =>{

    const _id = req.params.id

    if(!mongoose.isValidObjectId(_id)){
       return res.status(400).json({ message: "Id is invalid" })
    }
    try{
        const patient = await Patient.findOne({_id, doc_id :req.doc._id});

        if(!patient) return res.status(404).json({ message: "ID is not associated with any patient" })

        res.json( patient )
    }
    catch(e){
        res.status(500).json({  message: "Server Error", error: e.message  })
    }

}

// Add patient

const addPatient = async (req, res) =>{
    const {name, phoneNumber} = req.body

    const errorArray = [];

    if(name == "" || phoneNumber == ""){
        if(name == ""){
            errorArray.push("name")
        }
        if(phoneNumber == ""){
            errorArray.push("phoneNumber")
        }
        res.status(422).json({ message: "Fill in required fields!", errorArray  })
    }

    try{
        const patient = await Patient.create({ name, phoneNumber, doc_id: req.doc._id })

        res.json( patient )

    }
    catch(e){
        res.status(500).json({  message: "Server Error", error: e.message, errorArray  })
    }
}

//? Updated patient

const updatePatient = async (req, res) =>{

    const _id = req.params.id
    const {name, phoneNumber} = req.body;
    const errorArray = [];

    if(!mongoose.isValidObjectId(_id)) return res.status(400).json({ message: "Invalid patient ID" });

    if(name == "" || phoneNumber == ""){
        if(name == ""){
            errorArray.push("name")
        }
        if(phoneNumber == ""){
            errorArray.push("phoneNumber")
        }
        res.status(422).json({ message: "Fill in required fields!", errorArray  })
    }

    try{
        const patient = await Patient.findOneAndUpdate({_id, doc_id: req.doc._id}, {name, phoneNumber} ,{returnDocument: 'after', runValidators: true})

        if(!patient) return res.status(404).json({ message: "Patient does not exist" })

        res.json({ message: "Updated successfully", patient} )
    }
    catch(e){
        res.status(500).json({ message :"Server error", error: e.message })
    }

}

//! Delete patient and his sessions

const deletePatient = async (req,res) =>{

    const _id = req.params.id

    if(!mongoose.isValidObjectId(_id)) return res.status(400).json({ message: "invalid patient ID" });

    try{
        // patient
        const patient = await Patient.findOneAndDelete({_id, doc_id: req.doc._id});

        if(!patient) return res.status(404).json({ message: "patient does not exist or has already been deleted" });
        // sessions
        const sessions = await Session.deleteMany({patient_id: _id, doc_id: req.doc._id});

        res.json({ message: "Deleted successfully", deleted: patient.name })
    }
    catch(e){
        res.status(500).json({ message: "Server error", error: e.message })
    }

}


    
module.exports = {
    getAll,
    getOne,
    addPatient,
    updatePatient,
    deletePatient,
}