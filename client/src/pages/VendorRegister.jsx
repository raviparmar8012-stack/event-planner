import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/vendorRegister.css";

function VendorRegister() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setMessage("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setMessage("");
            setError("");

            const response = await axios.post(
                "http://localhost:5000/api/users/vendor/register",
                formData
            );

            setMessage(
                response.data.message ||
                "Vendor registration submitted successfully."
            );

            setFormData({
                name: "",
                email: "",
                password: ""
            });

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Vendor registration failed."
            );
        }
    };

    return (
        <div className="vendor-register-page">

            <div className="vendor-register-card">

                {/* LEFT BRAND SECTION */}
                <div className="vendor-register-brand">

                    <div className="vendor-brand-logo">
                        <span>Event</span> Hub
                    </div>

                    <div className="vendor-brand-content">

                        <span className="vendor-eyebrow">
                            JOIN EVENT HUB
                        </span>

                        <h1>
                            Grow your
                            <br />
                            <span>event business.</span>
                        </h1>

                        <p>
                            Showcase your services, connect with
                            customers and grow your business through
                            Event Hub.
                        </p>

                    </div>

                    <div className="vendor-brand-footer">
                        Become a trusted Event Hub vendor
                    </div>

                </div>


                {/* RIGHT FORM SECTION */}
                <div className="vendor-register-form-section">

                    <div className="vendor-register-form-wrapper">

                        <div className="vendor-register-heading">

                            <span className="vendor-eyebrow">
                                VENDOR REGISTRATION
                            </span>

                            <h2>
                                Create your vendor account
                            </h2>

                            <p>
                                Submit your details to join the
                                Event Hub marketplace.
                            </p>

                        </div>


                        {message && (
                            <div className="vendor-success">
                                {message}
                            </div>
                        )}


                        {error && (
                            <div className="vendor-error">
                                {error}
                            </div>
                        )}


                        <form
                            className="vendor-register-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="vendor-form-group">

                                <label>
                                    Business / Vendor Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your business name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="vendor-form-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your business email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="vendor-form-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="vendor-register-submit"
                            >
                                Submit Application
                                <span>→</span>
                            </button>

                        </form>


                        <div className="vendor-login-text">

                            Already have a vendor account?

                            <span
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Login
                            </span>

                        </div>

                        <div className="vendor-customer-text">

                            Looking to book an event?

                            <span
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                Create Customer Account
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default VendorRegister;