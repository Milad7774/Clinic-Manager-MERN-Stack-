import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthContext from "../src/Hooks/useAuthContext";
import { toast } from 'react-toastify';

const AddSessionForm = ({ type }) => {
    const { user, dispatch: userDispatch } = useAuthContext();
    const { patient_id, session_id } = useParams();
    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [payment, setPayment] = useState("");
    const [errorArray, setErrorArray] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const infoToast = () => toast.info("Processing your request.");
    const errorToast = () => toast.error("Something went wrong");
    const successToast = () => toast.success("Operation was successful!");

    useEffect(() => {
        if (type === "Edit" && session_id) {
            const fetchSession = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/session/${session_id}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    const json = await response.json();
                    if (response.ok) {
                        // Format date for input (YYYY-MM-DD)
                        const formattedDate = json.date ? json.date.split('T')[0] : "";
                        setDate(formattedDate);
                        setTime(json.time || "");
                        setDescription(json.description || "");
                        setPayment(json.payment || "");
                    } else {
                        toast.error("Failed to fetch session data");
                        if (response.status === 401) {
                            toast.info("Login needed");
                            userDispatch({ type: "LOGOUT" });
                            setTimeout(() => navigate('/login'), 1000);
                        }
                    }
                } catch (e) {
                    setError("Failed to fetch session data");
                    toast.error("Connection Error");
                }
            };
            fetchSession();
        } else {
            setDate("");
            setTime("");
            setDescription("");
            setPayment("");
            setError("");
            setErrorArray([]);
        }
    }, [type, session_id, user.token, userDispatch, navigate]);

    async function handleSession(e) {
        e.preventDefault();
        infoToast();
        setLoading(true);

        const method = type === "Edit" ? "PATCH" : "POST";
        const API = type === "Edit" 
            ? `${import.meta.env.VITE_API_URL}/session/${session_id}` 
            : `${import.meta.env.VITE_API_URL}/session/${patient_id}`;

        const sessionData = {
            date,
            time,
            description,
            payment: parseFloat(payment),
        };

        try {
            const response = await fetch(API, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(sessionData),
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.message || "Something went wrong");
                setErrorArray(json.errorArray || []);
                toast.dismiss();
                errorToast();
                if (response.status === 401) {
                    toast.info("Login needed");
                    userDispatch({ type: "LOGOUT" });
                    setTimeout(() => navigate('/login'), 1000);
                }
            } else if (response.ok) {
                setDate("");
                setTime("");
                setDescription("");
                setPayment("");
                setError(null);
                setErrorArray([]);
                toast.dismiss();
                successToast();
                setTimeout(() => {
                    navigate(`/sessions/${patient_id || json.patient_id}`);
                }, 1000);
            }
        } catch (e) {
            setError("Server Error, try again later");
            toast.dismiss();
            errorToast();
            console.log(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="patientFrom">
            <h1>{type === "Edit" ? "Edit Session" : "Add Session"}</h1>
            <form onSubmit={handleSession}>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        className={errorArray.includes("date") ? "error" : ""}
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="time">Time:</label>
                    <input
                        className={errorArray.includes("time") ? "error" : ""}
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        className={errorArray.includes("description") ? "error" : ""}
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter session description"
                        required
                        rows="3"
                    />
                </div>
                <div>
                    <label htmlFor="payment">Payment:</label>
                    <input
                        className={errorArray.includes("payment") ? "error" : ""}
                        type="number"
                        id="payment"
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                        placeholder="0.00"
                        required
                        step="0.01"
                        min="0"
                    />
                </div>
                <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : type === "Edit" ? "Update Session" : "Add Session"}
                </button>
            </form>
        </div>
    );
};

export default AddSessionForm;