import Navbar from "../components/Navbar.jsx";
import "../styles/contact.css"
import {useState} from "react";
import axios from "axios";

function Contact() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [error, setError] = useState({});

    const validateForm = () =>{

        const newErrors = {};

        if(formData.name.trim() === ""){
            newErrors.name = "Name is required";
        }
        if (formData.email.trim() === ""){
            newErrors.email = "Email is required";
        }
        if (formData.subject.trim() === ""){
            newErrors.subject = "Subject is required";
        }
        if (formData.message.trim() === ""){
            newErrors.message = "Message is required";
        }
        setError(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if(!isValid){
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5000/api/contacts",
                formData
            );
            console.log(response.data);

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });


        } catch (error) {
            console.log(error);
        }

    };

    return (
        <>
            <Navbar />


            <main className="contact-page">

                {/* Hero Section */}
                <section className="contact-hero">
                    <h1>Let's Plan Your Perfect Event</h1>
                    <p>
                        Have a question or want to discuss your event?
                        We'd love to hear from you.
                    </p>
                </section>

                {/* Contact Section */}
                <section className="contact-section">

                    {/* Contact Information */}
                    <div className="contact-info">
                        <h2>Get In Touch</h2>
                        <p>
                            Whether you're planning a wedding, birthday,
                            corporate event, or any special occasion,
                            we're here to help.
                        </p>

                        <div className="contact-details">

                            <div className="contact-item">
                                <h3>📍 Address</h3>
                                <p>Rajkot, Gujarat, India</p>
                            </div>

                            <div className="contact-item">
                                <h3>📞 Phone</h3>
                                <p>+91 98765 43210</p>
                            </div>

                            <div className="contact-item">
                                <h3>✉️ Email</h3>
                                <p>support@eventplanner.com</p>
                            </div>

                            <div className="contact-item">
                                <h3>🕐 Working Hours</h3>
                                <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                            </div>

                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-container">
                        <h2>Send Us a Message</h2>

                        <form className="contact-form" onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })
                                    }
                                />
                                {error.name && <p className="error">{error.name}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e)=>
                                    setFormData({...formData, email: e.target.value})
                                    }

                                />
                                {error.email && <p className="error">{error.email}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    placeholder="What is your event about?"
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subject: e.target.value
                                        })
                                    }
                                />
                                {error.subject && <p className="error">{error.subject}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    rows="6"
                                    placeholder="Tell us about your event..."
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            message: e.target.value
                                        })
                                    }
                                ></textarea>
                                {error.message && <p className="error">{error.message}</p>}
                            </div>

                            <button type="submit">
                                Send Message
                            </button>

                        </form>
                    </div>

                </section>

            </main>
        </>
    );
}

export default Contact;