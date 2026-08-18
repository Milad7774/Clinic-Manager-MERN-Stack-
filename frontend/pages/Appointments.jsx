import { useEffect, useState } from "react"
import useAuthContext from "../src/Hooks/useAuthContext"
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import ServerError from "../components/ServerError";
import useSessionContext from "../src/Hooks/useSessionContext";
import { Link, useNavigate } from "react-router-dom";
import EmptyArray from "../components/EmptyArray";

const Appointments = () =>{

    const { user, dispatch: userDispatch } = useAuthContext();

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [tryagain, setTryagain] = useState(false);

    const [data, setData] = useState([])

    useEffect(() =>{
        setLoading(true);
        async function fetchAppoinements(){
            try{
                const response = await fetch(`${import.meta.env.VITE_API_URL}/session`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                const json = await response.json();
                if(response.ok){
                    setData(json)
                }
                else{
                    setError(json.message)
                    if(response.status == 401){
                        toast.info("Login Needed");
                        userDispatch({type: "LOGOUT"});
                        setTimeout(() => {
                            navigate("/login");
                        }, 1000);
                    }
                }
            }
            catch(e){
                setError("Connection Error")
            }
            finally{
                setLoading(false);
            }
        }
        fetchAppoinements()
    },[tryagain])
    return(
        <>
        <Loader loader = {loading}/>
        {!loading && <h1 style={{ textAlign: "center" }}>Appointments</h1>}
        {error && !loading && (
            <ServerError message={error} tryagain = {setTryagain} valueTryAgain = { tryagain }/>
        )}
        {data.length > 0 && !loading && (
            <div className="table-father">
                <table className="dynamic-table table-container">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) =>(
                        <tr key={item._id}>
                            <td> <Link to={`/sessions/${item.patient_id._id}`} state={item.patient_id.name}> {item.patient_id.name} </Link> </td>
                            <td> {item.patient_id.phoneNumber} </td>
                            <td> <p>{item.description}</p> </td>
                            <td> {new Date(item.date).toLocaleDateString('en-UK')} </td>
                            <td> {item.time.slice(0, 5)} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        )}
        {data.length == 0 && !loading && !error&& (
            <EmptyArray message = "You have no Appointments"/>
        )}
        </>
    )
}
export default Appointments