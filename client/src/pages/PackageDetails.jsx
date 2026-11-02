import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import packageImages from "../assets/Data/packageImages";
import "../styles/packagDetais.css";

function PackageDetails() {
    const { id } = useParams();

    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchPackage = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/packages/${id}`
                );

                if (isMounted) {
                    setPkg(response.data.package);
                }
            } catch (err) {
                console.error("Package Details Error:", err);

                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load package details."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPackage();

        return () => {
            isMounted = false;
        };
    }, [id]);

    // PACKAGE IMAGE

    const getPackageImage = (currentPackage) => {
        const imagePath = currentPackage.image;

        if (typeof imagePath === "string" && imagePath.trim()) {
            return imagePath;
        }

        const images = packageImages?.[currentPackage.category];

        if (Array.isArray(images) && images.length > 0) {
            const index =
                Math.abs(Number(currentPackage.id) || 0) % images.length;

            return images[index];
        }

        return null;
    };


    if (loading) {
        return (
            <>
                <Navbar />
                <main className="package-details-page">
                    <div className="package-details-status">
                        <div className="package-loading-spinner"></div>
                        <p>Loading package details...</p>
                    </div>
                </main>
            </>
        );
    }

    if (error || !pkg) {
        return (
            <>
                <Navbar />
                <main className="package-details-page">
                    <div className="package-details-error">
                        <div className="package-error-icon">!</div>
                        <h2>{error || "Package not found"}</h2>
                        <p>
                            The package you're looking for could not be found.
                        </p>
                        <Link
                            to="/packages"
                            className="back-packages-btn"
                        >
                            ← Back to Packages
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    const imageUrl = getPackageImage(pkg);
    const locationText = [pkg.city, pkg.state]
        .filter((part) => typeof part === "string" && part.trim())
        .join(", ");

    return (
        <>
            <Navbar />

            <main className="package-details-page">
                <div className="package-details-container">

                    <Link to="/packages" className="package-back-link">
                        ← Back to Packages
                    </Link>

                    {/* HERO PACKAGE CARD */}
                    <section className="package-details-card">

                        <div className="package-details-image">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={pkg.title || "Event package"}
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <div className="package-image-placeholder">
                                    🎉
                                </div>
                            )}

                            <div className="package-image-overlay"></div>
                            <span className="package-image-label">
                                Complete Event Package
                            </span>
                        </div>

                        <div className="package-details-content">
                            <span className="package-details-badge">
                                {pkg.category || "Event Package"}
                            </span>

                            <h1>{pkg.title}</h1>

                            <div className="package-details-rating">
                                <span>★</span> {pkg.rating ?? "N/A"} / 5
                            </div>

                            <p className="package-details-location">
                                📍 {locationText || "Location not available"}
                            </p>

                            <div className="package-details-info">

                                <div className="package-detail-box">
                                    <span className="detail-icon">👥</span>
                                    <div>
                                        <small>Guest Capacity</small>
                                        <strong>
                                            {pkg.guests || "Not specified"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="package-detail-box">
                                    <span className="detail-icon">📅</span>
                                    <div>
                                        <small>Duration</small>
                                        <strong>
                                            {pkg.duration || "Not specified"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="package-detail-box">
                                    <span className="detail-icon">📍</span>
                                    <div>
                                        <small>Location</small>
                                        <strong>
                                            {pkg.city || pkg.location || "Not specified"}
                                        </strong>
                                    </div>
                                </div>

                            </div>

                            <div className="package-details-price-section">
                                <div>
                                    <span>Complete Package</span>
                                    <h2>{pkg.price || "Contact for price"}</h2>
                                    <small>Full event package price</small>
                                </div>

                                <Link
                                    to={`/booking?packageId=${pkg.id}`}
                                    className="package-book-btn"
                                >
                                    Book This Package <span>→</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* DESCRIPTION + INCLUDED */}
                    <section className="package-details-info-section">

                        <div className="package-about">
                            <span className="section-eyebrow">
                                PACKAGE OVERVIEW
                            </span>

                            <h2>About This Package</h2>

                            <p>
                                {pkg.description ||
                                    "Explore the services and details available in this event package."}
                            </p>

                            <p>
                                This package is designed to make your event
                                planning simple, organized and memorable.
                                Professional services and event coordination
                                are combined into one complete package.
                            </p>
                        </div>

                        <div className="package-included-section">
                            <span className="section-eyebrow">WHAT YOU GET</span>
                            <h2>What's Included</h2>

                            <div className="package-included-grid">
                                {Array.isArray(pkg.includes) &&
                                    pkg.includes.map((item, index) => (
                                        <div
                                            className="package-included-item"
                                            key={`${item}-${index}`}
                                        >
                                            <span className="included-check">
                                                ✓
                                            </span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </section>

                    {/* WHY CHOOSE */}
                    <section className="package-why-section">
                        <div className="package-why-heading">
                            <span className="section-eyebrow">EVENT HUB</span>
                            <h2>Why Choose This Package?</h2>
                            <p>
                                Everything you need for a smoother and more
                                enjoyable event experience.
                            </p>
                        </div>

                        <div className="package-benefits">
                            <div className="package-benefit">
                                <span className="benefit-icon">✓</span>
                                <div>
                                    <h3>Complete Planning</h3>
                                    <p>
                                        Important event services are combined
                                        in one package.
                                    </p>
                                </div>
                            </div>

                            <div className="package-benefit">
                                <span className="benefit-icon">★</span>
                                <div>
                                    <h3>Trusted Services</h3>
                                    <p>
                                        Professional event services help create
                                        a memorable experience.
                                    </p>
                                </div>
                            </div>

                            <div className="package-benefit">
                                <span className="benefit-icon">→</span>
                                <div>
                                    <h3>Easy Booking</h3>
                                    <p>
                                        Choose your package and continue
                                        directly to booking.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FINAL CTA */}
                    <section className="package-details-cta">
                        <div>
                            <span>READY TO PLAN YOUR EVENT?</span>
                            <h2>Make your event unforgettable.</h2>
                        </div>

                        <Link
                            to={`/booking?packageId=${pkg.id}`}
                            className="package-cta-btn"
                        >
                            Book Package →
                        </Link>
                    </section>

                </div>
            </main>
        </>
    );
}

export default PackageDetails;