import { useContext } from "react"
import { PatientContext } from "../context/PatientContext";

const usePatientContext = () =>{
    const context = useContext(PatientContext);

    

    if(!context) throw Error("Invalid PatientContext");

    return context
}
export default usePatientContext