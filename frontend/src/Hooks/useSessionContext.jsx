import { useContext } from "react"
import { SessionContext } from "../context/SessionContext"

const useSessionContext = () =>{
    const context = useContext(SessionContext);

    if(!context) throw Error("Invalid SessionContext");

    return context
}

export default useSessionContext