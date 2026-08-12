const ServerError = ({message, tryagain, valueTryAgain}) =>{
    return(
        <>
        <p className="no-data"> 
            { message }
            <button className="error-button" onClick={() => tryagain(!valueTryAgain)}> Try Again </button>
        </p>
        </>
    )
}
export default ServerError