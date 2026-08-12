import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../src/Hooks/useAuthContext";
import { toast } from 'react-toastify';

const NavBar = () => {
  const { user, dispatch: userDispatch } = useAuthContext();

  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();

    userDispatch({ type: "LOGOUT" });

    navigate("/login");
  }

  async function handleDelete() {
    if (!confirm("Delete Account?")) {
      return;
    }
    try{
        const responseDeleteDoc = await fetch(`${import.meta.env.VITE_API_URL}/doc/delete`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        const jsonDoc = await responseDeleteDoc.json();

        if(responseDeleteDoc.ok){
            
            toast.success("Delete Successfull")
            userDispatch({type: "LOGOUT"})
            setTimeout(() => {
                navigate('/signup')
            }, 1000);
        }
        else{
            
            toast.error("Something went wrong");
            if(responseDeleteDoc.status == 401){
                toast.dismiss()
                toast.info("Login Needed");
                userDispatch({type: "LOGOUT"})
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        }
    }
    catch(e){
        console.log(e)
        toast.error("Connection Error");
    }
  }

  return (
    <header className="navbar">
      <h1> Clinic Manager </h1>
      {!user && (
        <div className="links">
          <Link to="/login">Login</Link>
          <Link to="/signup"> Sign Up </Link>
        </div>
      )}
      {user && (
        <div className="email">
          {user.email}
          <div style={{display: "flex", gap: "10px"}}>
            <button onClick={handleLogout}> Log out </button>
            <button onClick={handleDelete} style={{ color: "red" }}>
              {" "}
              Delete Account{" "}
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className="navigation">
          <Link to={"/addPatient"}>Add Patient</Link>
          <Link to={"/Patients"}>All Pateints</Link>
          <Link to={"/Appointments"}>Appointments</Link>
        </div>
      )}
    </header>
  );
};
export default NavBar;
