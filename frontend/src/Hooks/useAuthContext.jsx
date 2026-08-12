import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const useAuthContext = () =>{
    const context = useContext(AuthContext);

    if(!context) throw Error("Invalid AuthContext");

    return context
}
export default useAuthContext