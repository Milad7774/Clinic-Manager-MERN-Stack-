import { useEffect, useState } from "react";
import usePatientContext from "../src/Hooks/usePatientContext";
import useAuthContext from "../src/Hooks/useAuthContext";
import Table from "../components/Table";
import Loader from "../components/Loader";
import ServerError from "../components/ServerError";
import useSessionContext from "../src/Hooks/useSessionContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const { patients, dispatch: patientsDispatch } = usePatientContext();

  const {dispatch: sessionsDispatch} = useSessionContext();

  const navigate = useNavigate();

  const { user, dispatch: userDispatch } = useAuthContext();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [tryagain, setTryagain] = useState(false)

  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchPatients() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/patient`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();
        
        if (response.ok) {
          patientsDispatch({ type: "SET_PATIENTS", payload: json });
          setLoading(false);
          setError(null);
        }
        if (!response.ok) {
          setLoading(false);
          setError(json.message);
          if(response.status == 401){
            toast.info("Login needed");
            userDispatch({type:"LOGOUT"})
            setTimeout(() => {
              navigate('/login')
            }, 1000);
          }
        }
      } catch (e) {
        console.log("Server Error", e.message);
        setLoading(false);
        setError("Connection Failure");
      }
    }
    fetchPatients()
  }, [tryagain]);

  const handleDelete = async (patientId) => {
    toast.info("Processing your request.")
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/patient/${patientId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        patientsDispatch({ type: "DELETE_PATIENT", payload: patientId });
        sessionsDispatch({type: "DELETE_PATIENT_SESSIONS", payload: patientId})
        toast.dismiss()
        toast.success("Deleted Successfully")
      }
      else{
        if(response.status == 401){
          toast.dismiss()
          toast.info("Login needed");
          userDispatch({type:"LOGOUT"})
          setTimeout(() => {
            navigate('/login')
          }, 1000);
        }
        toast.dismiss()
        toast.error("Something went wrong")
      }
    }
    catch(e){
      console.log(e);
      toast.error("Connection error");
    }
  };

  return (
    <>
      <Loader loader={loading} />
      <h1 style={{ textAlign: "center" }}>Patients</h1>
      {error && !loading && (
        <ServerError message={error} tryagain = {setTryagain} valueTryAgain = { tryagain }/>
      )}
      {!error && !loading && <Table data = { patients } onDelete = { handleDelete } type = "patient"/>}
    </>
  );
};
export default Patients;
