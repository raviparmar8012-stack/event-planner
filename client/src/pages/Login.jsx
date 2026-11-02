import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [selectedRole, setSelectedRole] = useState("customer");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/users/login",
                formData
            );

            const user = response.data.user;

            // ==========================================
            // ROLE CHECK
            // ==========================================

            let roleMatches = false;

            // Customer login
            if (selectedRole === "customer") {
                roleMatches = user.role === "customer";
            }

            // Vendor login
            if (selectedRole === "vendor") {
                roleMatches = user.role === "vendor";
            }

            // Admin login
            // Admin button represents:
            // super_admin
            // onboarding_manager
            // finance_manager
            // customer_support
            if (selectedRole === "admin") {
                roleMatches = [
                    "super_admin",
                    "onboarding_manager",
                    "finance_manager",
                    "customer_support"
                ].includes(user.role);
            }

            // Wrong role selected
            if (!roleMatches) {
                setError(
                    `This account is not registered as ${selectedRole}.`
                );

                return;
            }

            // ==========================================
            // SAVE USER
            // ==========================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // ==========================================
            // ROLE-BASED REDIRECT
            // ==========================================

            // SUPER ADMIN
            if (user.role === "super_admin") {
                navigate("/admin/dashboard");
                return;
            }

            // ONBOARDING MANAGER
            if (user.role === "onboarding_manager") {
                navigate("/admin/dashboard");
                return;
            }

            // FINANCE MANAGER
            if (user.role === "finance_manager") {
                navigate("/admin/dashboard");
                return;
            }

            // CUSTOMER SUPPORT
            if (user.role === "customer_support") {
                navigate("/admin/dashboard");
                return;
            }

            // VENDOR
            if (user.role === "vendor") {
                navigate("/vendor/dashboard");
                return;
            }

            // CUSTOMER
            const from = location.state?.from || "/";

            navigate(from);

        } catch (error) {
            console.log(
                "Login Error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                {/* Brand */}
                <div className="login-brand">
                    <span>Event</span> Hub
                </div>


                {/* Heading */}
                <div className="login-heading">

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to continue planning your
                        perfect event.
                    </p>

                </div>


                {/* Role Selector */}
                <div className="role-selector">

                    {/* Customer */}
                    <button
                        type="button"
                        className={
                            selectedRole === "customer"
                                ? "role-btn active"
                                : "role-btn"
                        }
                        onClick={() =>
                            setSelectedRole("customer")
                        }
                    >
                        Customer
                    </button>


                    {/* Vendor */}
                    <button
                        type="button"
                        className={
                            selectedRole === "vendor"
                                ? "role-btn active"
                                : "role-btn"
                        }
                        onClick={() =>
                            setSelectedRole("vendor")
                        }
                    >
                        Vendor
                    </button>


                    {/* Admin */}
                    <button
                        type="button"
                        className={
                            selectedRole === "admin"
                                ? "role-btn active"
                                : "role-btn"
                        }
                        onClick={() =>
                            setSelectedRole("admin")
                        }
                    >
                        Admin
                    </button>

                </div>


                {/* Error */}
                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}


                {/* Login Form */}
                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    {/* Email */}
                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Password */}
                    <div className="form-group">

                        <div className="password-label">

                            <label>
                                Password
                            </label>

                            <span
                                className="forgot-link"
                                onClick={() =>
                                    navigate(
                                        "/forgot-password"
                                    )
                                }
                            >
                                Forgot Password?
                            </span>

                        </div>


                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Login Button */}
                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Login"
                        }

                        {!loading && (
                            <span>
                                →
                            </span>
                        )}

                    </button>

                </form>


                {/* Register */}
                <div className="register-text">

                    Don't have an account?

                    <span
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Account
                    </span>

                </div>

            </div>

        </div>
    );
}

export default Login;