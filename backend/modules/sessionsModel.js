const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    patient_id: {
         type: Schema.Types.ObjectId, ref: 'Patient',
         required: true
         },
    doc_id: { 
        type: Schema.Types.ObjectId, ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    payment: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true })

module.exports = mongoose.model('Session', sessionSchema)