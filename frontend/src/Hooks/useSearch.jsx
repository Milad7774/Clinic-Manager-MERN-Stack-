import { useEffect, useState } from "react"

const useSearch = (patients, search) =>{
    const [searchedPatients, setSearchedPatients] = useState([]);
    useEffect(() =>{
        if(search == ""){
            setSearchedPatients(patients);
        }
        else{
            const filtered = patients.filter((patient) => patient.name.toLowerCase().includes(search.toLowerCase()));
            setSearchedPatients(filtered)
        }
    }, [patients, search])
    return {searchedPatients};
}
export default useSearch