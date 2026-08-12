import { useState, useEffect } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import useAuthContext from "../src/Hooks/useAuthContext";
import usePatientContext from "../src/Hooks/usePatientContext";
import { toast } from 'react-toastify';

const AddPatientForm = ({ type }) => {
  const { patients } = usePatientContext();

  const { dispatch } = useAuthContext();

  const infoToast = () => toast.info("Proccessing your request.",);

  const errorToast = () => toast.error("Something Wrong happened");

  const successToast = () => toast.success("Operation was successfull!")
  

  const { user, dispatch: userDispatch } = useAuthContext();

  const { patient_id } = useParams();

  const [name, setName] = useState("");

  const [patientName, setPatientName] = useState('');

  const [phoneNumber, setPhoneNumber] = useState("");

  const [errorArray, setErrorArray] = useState([]);

  const [error, setError] = useState("");

  const [fetched, setFetched] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (type === "Edit" && patient_id) {
      const existingPatient = patients?.find((item) => item._id === patient_id);
      if (existingPatient) {
        setName(existingPatient.name);
        setPatientName(existingPatient.name)
        setPhoneNumber(existingPatient.phoneNumber);
      } else {
        // If patient not in context, fetch directly
        const fetchPatient = async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/patient/${patient_id}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const json = await response.json();
            if (response.ok) {
              setName(json.name);
              setPatientName(json.name)
              setPhoneNumber(json.phoneNumber);
            }
            else{
              toast.error("Something went wrong")
              if(response.status == 401){
                toast.dismiss();
                toast.info("Login needed");
                userDispatch({type:"LOGOUT"})
                setTimeout(() => {
                  navigate('/login')
                }, 1000);
              }
            }
          } catch (e) {
            setError("Failed to fetch patient data");
            toast.error("Connection Error")
          }
        };
        fetchPatient();
      }
    } else {
      setName("");
      setPhoneNumber("");
      setError("");
      setErrorArray("");
    }
  }, [type, patient_id, patients, user.token]);

  async function handlePatient(e) {
    e.preventDefault();
    infoToast();

    const method = type == "Edit" ? "PATCH" : "POST";

    const API = type == "Edit" ? `${import.meta.env.VITE_API_URL}/patient/${patient_id}` : `${import.meta.env.VITE_API_URL}/patient`;

    const patient = {
      name,
      phoneNumber,
    };
    try {
      const response = await fetch(API, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(patient),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
        setErrorArray(json.errorArray);
        toast.dismiss()
        errorToast()
        if(response.status == 401){
          toast.info("Login needed");
          userDispatch({type:"LOGOUT"})
          setTimeout(() => {
            navigate('/login')
          }, 1000);
        }
      } else if (response.ok) {
        setName("");
        setPhoneNumber("");
        setError(null);
        setErrorArray([]);
        toast.dismiss()
        successToast();
        setTimeout(() => {
          navigate('/Patients')
        }, 1000);
      }
    } catch (e) {
      setError("Server Error, try again later");
      toast.dismiss()
      errorToast()
      console.log(e.message);
    }
  }

  return (
    <div className="patientFrom">
      <h1> {type == "Edit" ? `Editing ${patientName}` : "Add"} </h1>
      <form onSubmit={handlePatient}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            className={errorArray.includes("name") ? "error" : ""}
            type="text"
            patient_id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <PhoneInput
            patient_id="phoneNumber"
            placeholder="xxxx xxx xxx"
            value={phoneNumber}
            onChange={setPhoneNumber}
            defaultCountry="SY"
            className={errorArray.includes("phoneNumber") ? "error" : ""}
          />
        </div>
        <div style={{color: "red", fontWeight: "bold"}}> {error} </div>
        <button> {type} </button>
      </form>
    </div>
  );
};
export default AddPatientForm;
