import { createContext, useReducer } from "react";

export const AuthContext = createContext();

export const userReducer = ( state, action ) =>{
    switch(action.type){
        case 'LOGIN':
            return{
                user: action.payload
            }
        case 'LOGOUT':
            localStorage.removeItem('user')
            return{
                user: null
            }
        default: 
            return state
    }
}


export const AuthContextProvider = ({ children }) =>{

    const [state, dispatch] = useReducer(userReducer, {
        user: JSON.parse(localStorage.getItem('user')) ?? null
    })

    return(
        <AuthContext.Provider value = {{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}