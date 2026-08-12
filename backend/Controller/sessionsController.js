const Session = require('../modules/sessionsModel');
const Patient = require('../modules/patientsModel')
const mongoose = require('mongoose');

// Get all sessions for the Doc
const getAll = async (req, res) =>{
    const doc_id = req.doc._id

    if(!mongoose.isValidObjectId(doc_id)) return res.status(400).json({ message: "Id is not Valid" });

    try {
        const sessions = await Session.find({ doc_id, date: {$gte: new Date()} })
            .populate('patient_id', 'name phoneNumber')
            .select({patient_id: 1, date: 1, time: 1, description: 1})
            .sort({ date: 1 });

        res.json( sessions );
    } catch (e) {
        res.status(500).json({ message: "Server Error", error: e.message });
    }
}

// Get all sessions for the patient

const getPatientSessions = async (req, res) =>{
    const patient_id = req.params.patientId

    if(!mongoose.isValidObjectId(patient_id)) return res.status(400).json({ message: "Id is not Valid" });

     //Check if patietnt exists

     const patient = await Patient.findOne({ _id: patient_id, doc_id: req.doc._id });

     if(!patient) return res.status(404).json({ message: "Patient is not Found" });

     try{
        const session = await Session.find({ patient_id, doc_id: req.doc._id }).select({date: 1, time: 1,description: 1, payment: 1, patient_id: 1} );

        res.json( session );
     }
     catch(e){
        res.status(500).json({ message: "Server Error", error: e.message })
     }
}

// Get a single session

const getOne = async (req, res) =>{
    const _id = req.params.sessionId

    if(!mongoose.isValidObjectId(_id)) return res.status(400).json({ message: "Id is not Valid" });

    try{
        const session = await Session.findOne({ _id, doc_id: req.doc._id })

        if(!session) return res.status(404).json({ message: "Session not found" })

        res.json( session );

    }
    catch(e){
        res.status(500).json({ message: "Server Error", error: e.message })
    }
}
// Add sesssion

const addSession = async (req, res) =>{
    const patient_id = req.params.patientId
    const doc_id = req.doc._id
    const {date, time, description, payment} = req.body

    if(!mongoose.isValidObjectId(patient_id) || !mongoose.isValidObjectId(doc_id)) return res.status(400).json({ message: "Id is invalid" });

    //Check if patietnt exists

    const patient = await Patient.findOne({_id: patient_id, doc_id});

    if(!patient) return res.status(404).json({ message: "Patient is not Found" })

    try{
        const session = await Session.create({date, time, description, payment, doc_id, patient_id})

        res.json( session )
    }
    catch(e){
        res.status(500).json({ message: "Server Error", error: e.message })
    }
}

//? Update session

const updateSession = async (req, res) =>{
    const _id = req.params.sessionId;
    const {date, time, description, payment} = req.body

    if(!mongoose.isValidObjectId(_id)) return res.status(400).json({ message: "Id is invalid" });

    try{
        const session = await Session.findOneAndUpdate({_id, doc_id: req.doc._id}, {date, time, description, payment}, {returnDocument: 'after', runValidators: true})
        
        if(!session) return res.status(404).json({ message: "Session not Found" });

        res.json({ message: "Updated successfully", session} )
    }
    catch(e){
        res.status(500).json({ message: "Server Error", error: e.message })
    }
}

//! Delete 
const deleteSession = async (req, res) =>{
    const _id = req.params.sessionId

    if(!mongoose.isValidObjectId(_id)) return res.status(400).json({ message: "Invalid Id" });

    try{
        const session = await Session.findOneAndDelete({_id, doc_id: req.doc._id});

        if(!session) return res.status(404).json({ message: "Session does not exist or already been deleted" });

        res.json({ message: "Deleted Successfully", session })
    }
    catch(e){
        res.status(500).json({ message: "Server Error", error: e.message })
    }
}



module.exports = {
    getAll,
    getOne,
    getPatientSessions,
    addSession,
    updateSession,
    deleteSession,
}