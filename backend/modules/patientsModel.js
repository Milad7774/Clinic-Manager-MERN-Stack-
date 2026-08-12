const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    doc_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
}, { timestamps: true })

module.exports = mongoose.model('Patient', patientSchema)