import { useState } from "react"
import EmptyArray from "./EmptyArray";
import { Link, useNavigate } from "react-router-dom";

const Table = ({ data , onDelete, type}) =>{

    

    const navigate = useNavigate();

    

    if(data.length == 0){
        return(
            <EmptyArray message = {`No ${type} found`}/>
        )
    }
    else{
        let heads = Object.keys(data[0]);
        heads = heads.filter((item) => {
            const no_id = item != "_id";
            const no_patient_id = item != "patient_id";
            return no_id && no_patient_id
        })
        return(
            <div className="table-father">
            <table className="table-container dynamic-table">
                <thead>
                    <tr>
                    {heads.map((item) => (
                        <th key={item}> {item.charAt(0).toLocaleUpperCase() + item.slice(1)} </th>
                    ))}
                    <th>action</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item._id}>
                        {heads.map((head) =>{
                            if(head == "name"){
                                return(
                                    <td key={item[head]}> <Link to={`/sessions/${item._id}`} state={item[head]}>{item[head]}</Link> </td>
                                )
                            }
                            else if(head == "date"){
                                return(
                                    <td key={item[head]}> {new Date(item[head]).toLocaleDateString('en-UK')} </td>
                                )
                            }
                            else if(head == "description"){
                                return(
                                    <td key={item[head]}> <p style={{wordBreak: "keep-all"}}> {item[head]} </p> </td>
                                )
                            }
                            else{
                                return(
                                    <td key={item[head]}> {item[head]} </td>
                                )
                            }
                        })}
                        <td >
                            <div className="actions">
                             <button className="btn-edit" onClick={(e) => navigate(heads.includes('name') ? `/editPatient/${item._id}` : `/editSession/${item.patient_id}/${item._id}`)}>Edit</button>
                             <button className="btn-delete" onClick={() => onDelete(item._id)}>Delete</button>
                             </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )
    }
}
export default Table