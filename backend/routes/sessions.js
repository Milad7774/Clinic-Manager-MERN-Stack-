const express = require('express');

const router = express.Router();


const {
    getAll,
    getOne,
    getPatientSessions,
    updateSession,
    addSession,
    deleteSession,
} = require('../Controller/sessionsController')

const requireAuth = require('../middleware/requireAuth')

//? Authentication
router.use(requireAuth)

// get all sessions for doc
router.get('/', getAll)

// get a single session
router.get('/:sessionId', getOne)

// get sessions for each patient
router.get('/patient/:patientId', getPatientSessions)

// Add session
router.post('/:patientId', addSession)

//? Update session
router.patch('/:sessionId', updateSession)

//! delete session
router.delete('/:sessionId', deleteSession);




module.exports = router