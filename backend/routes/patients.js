const express = require('express')

const router = express.Router();

const requireAuth = require('../middleware/requireAuth')

const {
    getAll,
    getOne,
    addPatient,
    deletePatient,
    updatePatient
} = require('../Controller/patientController')
//? Athentication
router.use(requireAuth);

// Get all patients for the doc
router.get('/', getAll)

// get a single patien
router.get('/:id', getOne)

// Add a patient
router.post('/', addPatient)

//? Update a patient
router.patch('/:id', updatePatient)

//! Delete a patient
router.delete('/:id',deletePatient)



module.exports = router;