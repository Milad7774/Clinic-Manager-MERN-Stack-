import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useSessionContext from "../src/Hooks/useSessionContext";
import useAuthContext from "../src/Hooks/useAuthContext";
import Table from "../components/Table";
import Loader from "../components/Loader";
import ServerError from "../components/ServerError";
import { toast } from "react-toastify";

const PatientSessions = () => {
  const { sessions, dispatch: sessionsDispatch } = useSessionContext();

  const location = useLocation();

  const { user, dispatch: userDispatch } = useAuthContext();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [tryagain, setTryagain] = useState(false);

  const { patient_id } = useParams()

  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchSessions() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/session/patient/${patient_id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();
        if (response.ok) {
          sessionsDispatch({ type: "SET_SESSIONS", payload: json });
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
    fetchSessions();
  }, [tryagain]);

  const handleDelete = async (sessionId) => {
    toast.info("Processing your request.")
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/session/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        sessionsDispatch({ type: "DELETE_SESSION", payload: sessionId });
        toast.dismiss()
        toast.success("Deleted Successfully")
      }
      else{
        toast.dismiss()
        toast.error("Something went wrong")
        if(response.status == 401){
          toast.dismiss()
          toast.info("Login needed");
          userDispatch({type:"LOGOUT"})
          setTimeout(() => {
            navigate('/login')
          }, 1000);
        }
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
      {!loading && <Link to={`/addSession/${patient_id}`} style={{textDecoration: "none"}}><h1 className="add-session">Add Session to {location.state}</h1></Link>}
      {error && !loading && (
        <ServerError
          message={error}
          tryagain={setTryagain}
          valueTryAgain={tryagain}
        />
      )}
      {!error && !loading && <Table data={sessions} onDelete={handleDelete} type = "sessions" />}
    </>
  );
};
export default PatientSessions;
