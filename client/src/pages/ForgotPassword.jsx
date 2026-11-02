
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");


    const handleSubmit = (event) => {
        event.preventDefault();

        setMessage(
            "Password reset feature will be available soon. Please contact the administrator for help."
        );
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <span>Event</span> Hub
                </div>

                <div className="login-heading">
                    <h1>Forgot Password?</h1>
                    <p>
                        Enter your registered email address to get help
                        recovering your account.
                    </p>
                </div>

                {message && (
                    <div
                        className="login-success"
                        role="status"
                    >
                        {message}
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="reset-email">Email Address</label>
                        <input
                            id="reset-email"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setMessage("");
                            }}
                            required
                        />
                    </div>

                    <button type="submit" className="login-submit">
                        Continue <span>→</span>
                    </button>
                </form>

                <div className="register-text">
                    Remember your password?{" "}
                    <Link to="/login">Back to Login</Link>
                </div>

                <button
                    type="button"
                    className="forgot-back-btn"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
