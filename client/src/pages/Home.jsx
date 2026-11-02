import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import FeatureCard from "../components/FeatureCard";


import "../styles/home.css";

function Home() {


    const [services, setServices] = useState([]);
    const [features, setFeatures] = useState([]);

    useEffect(() => {

        const fetchHomeData = async () => {

            try {

                const [

                    servicesResponse,
                    featuresResponse
                ] = await Promise.all([
                    axios.get("http://localhost:5000/api/vendors"),
                    axios.get("http://localhost:5000/api/packages"),
                    axios.get("http://localhost:5000/api/services"),
                    axios.get("http://localhost:5000/api/features")
                ]);


                setServices(servicesResponse.data.services || []);
                setFeatures(featuresResponse.data.features || []);

            } catch (error) {

                console.log("Home Data Error:", error);

            }

        };

        void fetchHomeData();

    }, []);





    return (
        <div className="home-page">

            <Navbar />


            {/* ========================================
                HERO SECTION
            ======================================== */}

            <section className="home-hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <span className="hero-eyebrow">
                        PLAN • CELEBRATE • REMEMBER
                    </span>

                    <h1>
                        Your Event.
                        <br />
                        <span>Your Moment.</span>
                    </h1>

                    <p>
                        Discover trusted vendors, curated packages,
                        and everything you need to create an
                        unforgettable event.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/packages"
                            className="primary-btn"
                        >
                            Explore Events
                            <span>→</span>
                        </Link>

                        <Link
                            to="/vendor"
                            className="secondary-btn"
                        >
                            Find a Vendor
                        </Link>

                    </div>

                </div>


                <div className="hero-floating-card">

                    <div className="hero-card-icon">
                        ✦
                    </div>

                    <div>
                        <strong>Everything in one place</strong>
                        <span>
                            Vendors • Packages • Booking
                        </span>
                    </div>

                </div>

            </section>


            {/* ========================================
                EVENT CATEGORIES
            ======================================== */}

            <section className="event-categories">

                <div className="section-heading">

                    <span className="section-label">
                        FIND YOUR EVENT
                    </span>

                    <h2>
                        What are you planning?
                    </h2>

                    <p>
                        Start with an event type and discover
                        everything you need.
                    </p>

                </div>


                <div className="category-grid">

                    <Link
                        to="/packages?category=Wedding"
                        className="category-card wedding"
                    >
                        <span>💍</span>
                        <h3>Wedding</h3>
                        <p>Make your big day unforgettable.</p>
                    </Link>


                    <Link
                        to="/packages?category=Birthday"
                        className="category-card birthday"
                    >
                        <span>🎂</span>
                        <h3>Birthday</h3>
                        <p>Celebrate every special moment.</p>
                    </Link>


                    <Link
                        to="/packages?category=Corporate"
                        className="category-card corporate"
                    >
                        <span>💼</span>
                        <h3>Corporate</h3>
                        <p>Professional events, perfectly planned.</p>
                    </Link>


                    <Link
                        to="/packages?category=Engagement"
                        className="category-card engagement"
                    >
                        <span>💫</span>
                        <h3>Engagement</h3>
                        <p>Celebrate the beginning of forever.</p>
                    </Link>


                    <Link
                        to="/packages?category=College & Farewell"
                        className="category-card farewell"
                    >
                        <span>🎓</span>
                        <h3>College & Farewell</h3>
                        <p>Memories worth celebrating.</p>
                    </Link>


                    <Link
                        to="/packages?category=Garba & Navratri"
                        className="category-card garba"
                    >
                        <span>🪔</span>
                        <h3>Garba & Navratri</h3>
                        <p>Celebrate with colour and energy.</p>
                    </Link>

                </div>

            </section>


            {/* ========================================
                SERVICES
            ======================================== */}

            <section className="home-services">

                <div className="section-heading">

                    <span className="section-label">
                        WHAT WE OFFER
                    </span>

                    <h2>
                        Everything your event needs.
                    </h2>

                    <p>
                        From planning to execution, find the
                        right services for your celebration.
                    </p>

                </div>


                <div className="service-container">

                    {services.map((service) => (

                        <ServiceCard
                            key={service.id}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                        />

                    ))}

                </div>

            </section>


            {/* ========================================
                HOW IT WORKS
            ======================================== */}

            <section className="how-it-works">

                <div className="section-heading">

                    <span className="section-label">
                        SIMPLE PROCESS
                    </span>

                    <h2>
                        Plan. Choose. Celebrate.
                    </h2>

                </div>


                <div className="steps-container">

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <h3>Discover</h3>

                        <p>
                            Explore event packages and trusted
                            vendors that match your needs.
                        </p>

                    </div>


                    <div className="step-line"></div>


                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <h3>Choose</h3>

                        <p>
                            Compare options and choose what
                            works best for your event.
                        </p>

                    </div>


                    <div className="step-line"></div>


                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <h3>Book</h3>

                        <p>
                            Select your dates and submit your
                            booking in just a few steps.
                        </p>

                    </div>

                </div>

            </section>



            {/* ========================================
                WHY EVENT HUB
            ======================================== */}

            <section className="why-event-hub">

                <div className="why-content">

                    <span className="section-label">
                        WHY EVENT HUB
                    </span>

                    <h2>
                        Less stress.
                        <br />
                        More celebration.
                    </h2>

                    <p>
                        We bring vendors, packages and event
                        planning together in one simple platform,
                        so you can focus on enjoying your event.
                    </p>

                    <Link
                        to="/packages"
                        className="primary-btn dark-btn"
                    >
                        Start Planning
                        <span>→</span>
                    </Link>

                </div>


                <div className="why-stats">

                    <div className="stat-box">

                        <strong>168+</strong>

                        <span>
                            Vendors
                        </span>

                    </div>


                    <div className="stat-box">

                        <strong>20+</strong>

                        <span>
                            Packages
                        </span>

                    </div>


                    <div className="stat-box">

                        <strong>6</strong>

                        <span>
                            Event Types
                        </span>

                    </div>

                </div>

            </section>


            {/* ========================================
                FEATURES
            ======================================== */}

            <section className="features-section">

                <div className="section-heading">

                    <span className="section-label">
                        THE EVENT HUB DIFFERENCE
                    </span>

                    <h2>
                        Why choose us?
                    </h2>

                </div>


                <div className="features-container">

                    {features.map((feature) => (

                        <FeatureCard
                            key={feature.id}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />

                    ))}

                </div>

            </section>


            {/* ========================================
                FINAL CTA
            ======================================== */}

            <section className="home-cta">

                <div>

                    <span className="section-label">
                        YOUR NEXT EVENT STARTS HERE
                    </span>

                    <h2>
                        Ready to create
                        something memorable?
                    </h2>

                    <p>
                        Explore our packages and vendors
                        and start planning today.
                    </p>

                    <Link
                        to="/packages"
                        className="cta-button"
                    >
                        Explore Events
                        <span>→</span>
                    </Link>

                </div>

            </section>


            {/* ========================================
                FOOTER PLACEHOLDER
            ======================================== */}

            <footer className="home-footer">

                <div className="footer-logo">
                    Event Hub
                </div>

                <p>
                    Plan better. Celebrate more.
                </p>

                <div className="footer-links">

                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/packages">Packages</Link>
                    <Link to="/vendor">Vendors</Link>
                    <Link to="/contact">Contact</Link>

                </div>

                <span className="footer-copy">
                    © 2026 Event Hub. All rights reserved.
                </span>

            </footer>

        </div>
    );
}

export default Home;