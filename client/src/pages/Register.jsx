import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/users/register",
                formData
            );

            setSuccessMessage(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1800);

        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">

                <span className="about-eyebrow">
                    WELCOME TO EVENTHUB
                </span>

                <h1>Create Account</h1>

                <p>
                    Join EventHub and start planning your special events.
                </p>

                {successMessage && (
                    <div className="success-message" role="status">
                        ✓ {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="error-message" role="alert">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || Boolean(successMessage)}
                    >
                        {loading
                            ? "Creating Account..."
                            : successMessage
                                ? "Account Created ✓"
                                : "Create Account →"}
                    </button>
                </form>

                <div className="register-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </div>

            </div>
        </div>
    );
}

export default Register;