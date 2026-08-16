import { useEffect, useState } from "react";
import usePatientContext from "../src/Hooks/usePatientContext";
import useAuthContext from "../src/Hooks/useAuthContext";
import Table from "../components/Table";
import Loader from "../components/Loader";
import ServerError from "../components/ServerError";
import useSessionContext from "../src/Hooks/useSessionContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useSearch from "../src/Hooks/useSearch";

const Patients = () => {
  const { patients, dispatch: patientsDispatch } = usePatientContext();

  const {dispatch: sessionsDispatch} = useSessionContext();

  const navigate = useNavigate();

  const { user, dispatch: userDispatch } = useAuthContext();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [tryagain, setTryagain] = useState(false);

  const [search, setSearch] = useState('');

  const  {searchedPatients} = useSearch(patients, search)

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
          
          setError(null);
        }
        if (!response.ok) {
          
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
        setError("Connection Failure");
      }
      finally{
        setLoading(false);
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
      {!error && !loading && (
        <input 
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Patient"
        className="searchInput" />
      )}
      {!error && !loading  &&  <Table data = { searchedPatients ?? patients } onDelete = { handleDelete } type = "patient"/>}
    </>
  );
};
export default Patients;
