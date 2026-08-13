import { useState } from "react";
import useAuthContext from "../src/Hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const User = ({ type }) => {
  const { user, dispatch: userDispatch } = useAuthContext();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleData(e) {
    e.preventDefault();
    setLoading(true);
    toast.info("Backend might need a minute to wake up, (Render Free Tier)", {autoClose: 5000})
    //Post or fetch account
    const Doctor = {
      email,
      password,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/doc/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Doctor),
      });

      const json = await response.json();

      if (response.ok) {
        setLoading(false);
        setError(null);
        userDispatch({ type: "LOGIN", payload: json });
        localStorage.setItem("user", JSON.stringify(json));
        navigate('/addPatient')
      } else if (!response.ok) {
        setLoading(false);
        setError(json.message);
      }
    } catch (e) {
      setError("Server error, try again later");
      setLoading(false)
    }
  }

  return (
    <div className="form">
      <h1> {type == "login" ? "Welcome Back" : "Create an Account"} </h1>
      <form onSubmit={handleData}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div style={{color: "red", fontWeight: "bold"}}> {error} </div>}
        <button disabled = {loading}>
          {" "}
          {!loading && (type == "login" ? "Login" : "Sign up")}{" "}
          {loading && "Just a moment"}
        </button>
      </form>
    </div>
  );
};

export default User;
