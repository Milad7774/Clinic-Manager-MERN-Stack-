require('dotenv').config()
// Well you need these
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//? Routes
const DocsRoutes = require('./routes/Docs')
const patientRoutes = require('./routes/patients')
const sessionRoutes = require('./routes/sessions')

const app = express();
//? Port listening
mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log('connected to DB'))
    .then(() =>{
        app.listen(process.env.PORT, () =>{
            console.log(`Listening to ${process.env.PORT}`)
        })
    })

// Access req.body
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],
    credentials: true
}));

app.use((req, res, next) =>{
    console.log("Request is: ", req.method);
    console.log("Path is: ", req.path);
    console.log("Req.body: ", req.body);
    next()
})

app.use('/api/doc', DocsRoutes)

app.use('/api/patient', patientRoutes)

app.use('/api/session', sessionRoutes)

// TODO: 
// 1- doc/patient modules (done)
// 2- doc login/signup statics (done)
// 3- doc login/signup routes (done) 
// 4- Authentication (done)
// 5- patients routes (done)
// 6- sessions routes (done)