import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import User from "../pages/User"
import ProtectedRoutes from "../components/ProtectedRoutes"
import AddPatient from "../pages/AddPatient"
import Patients from "../pages/Patients"
import Loader from "../components/Loader"
import { ToastContainer, toast } from 'react-toastify';
import PatientSessions from "../pages/PatientsSessions"
import Appointments from "../pages/Appointments"
import AddSessionForm from "../components/AddSessionForm"

//TODO:
// 1- Fix table 
// 2- pages you need:
  // a- Appointments (Filter from the backend)
  // b- Sessions for each patient
  // d- add session and edit session

const App = () =>{

  const PublicRoutes = [
    {path: "/login", element: <User type = "login"/>},
    {path: "/signup", element: <User type = "signup"/>}
  ]

  const PrivateRoutes = [
    {path : "/addPatient", element: <AddPatient type= "Add Patient" />},
    {path: "/editPatient/:patient_id", element: <AddPatient type = "Edit"/>},
    {path: "/addSession/:patient_id", element: <AddSessionForm type = "Add Session"/>},
    {path: "/editSession/:patient_id/:session_id", element: <AddSessionForm type = "Edit"/>},
    {path: "/Patients", element: <Patients/>},
    {path: "/sessions/:patient_id", element: <PatientSessions/>},
    {path: '/Appointments', element: <Appointments/>}
  ]

  return(
    <Router>
      <NavBar/>
      <span className="MadeBy">Developed By <a href="https://github.com/Milad7774">Milad</a></span>
      <ToastContainer autoClose={1500} theme="colored" closeOnClick position="top-left"/>
      <Routes>
        {PublicRoutes.map((route) =>(
          <Route
          key = { route.path }
          path = { route.path }
          element = { route.element } />
        ))}
        
        {PrivateRoutes.map((route) =>(
          <Route
          key = { route.path }
          path = { route.path }
          element = {<ProtectedRoutes> { route.element } </ProtectedRoutes>} />
        ))}
        <Route path="*" element = {<Navigate to = "/addPatient"/>}/>
      </Routes>
    </Router>
  )
}
export default App