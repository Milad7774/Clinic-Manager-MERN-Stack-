import { createContext, useReducer } from "react";

export const SessionContext = createContext();


export const sessionReducer = (state, action) => {
    switch(action.type){
        case "SET_SESSIONS":
            return{
                sessions: action.payload
            }
        case "DELETE_SESSION":
            return{
                sessions: state.sessions.filter((session) => session._id !== action.payload)
            }
        case "SET_NULL":
            return{
                sessions: null
            }
    }
}

export const SessionContextProvider = ({ children }) =>{
    const [state, dispatch] = useReducer(sessionReducer, {
        sessions: null
    })

    return (
        <SessionContext.Provider value={{...state, dispatch}}>
            { children }
        </SessionContext.Provider>
    )
}