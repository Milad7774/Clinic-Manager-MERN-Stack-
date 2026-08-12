import { createContext, useReducer } from "react";

export const PatientContext = createContext();


    export const patientReducer = (state, action) =>{
        switch(action.type){
            case "DELETE_PATIENT":
                return{
                    patients: state.patients.filter((p) => {
                         return p._id != action.payload
                    })
                }
            case "SET_PATIENTS": 
                return{
                    patients: action.payload
                }
            case "SET_NULL":
                return{
                    patients: null
                }
            default: 
                return state
        }
    }


export const PatientContextProvider = ( {children} ) =>{
    const [state, dispatch] = useReducer(patientReducer, {
        patients: null
    })
    

    return(
        <PatientContext.Provider value = {{...state, dispatch}}>
            { children }
        </PatientContext.Provider>
    )

}