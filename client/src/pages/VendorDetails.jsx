
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/vendorDetails.css";

function VendorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        axios
            .get(`http://localhost:5000/api/vendors/${id}`)
            .then((response) => {
                setVendor(response.data.vendor);
            })
            .catch((err) => {
                console.error("Error fetching vendor:", err);
                setError("Unable to load vendor details. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="vendor-details-page">
                <p className="vendor-details-message">
                    Loading vendor details...
                </p>
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="vendor-details-page">
                <p className="vendor-details-message">
                    {error || "Vendor not found."}
                </p>
                <button
                    className="book-vendor-btn"
                    onClick={() => navigate("/vendors")}
                >
                    Back to Vendors
                </button>
            </div>
        );
    }

    return (
        <div className="vendor-details-page">
            <h1>Vendor Details</h1>

            <div className="vendor-details">
                {/* Main vendor information */}
                <div className="vendor-details-main">
                    <div className="vendor-detail-image-section">
                        {vendor.image ? (
                            <img
                                src={vendor.image}
                                alt={vendor.name}
                                className="vendor-detail-img"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="vendor-detail-img vendor-image-placeholder">
                                <span>📷</span>
                                <span>Image not available</span>
                            </div>
                        )}
                    </div>

                    <div className="vendor-basic-info">
                        <h2>{vendor.name}</h2>

                        <p>
                            <strong>Category:</strong> {vendor.category}
                        </p>

                        <p>
                            <strong>Rating:</strong> ⭐ {vendor.rating ?? "N/A"}
                        </p>

                        <p>
                            <strong>Location:</strong> {vendor.city},{" "}
                            {vendor.state}
                        </p>

                        <p>
                            <strong>Price:</strong> {vendor.price ?? "Contact for price"}
                        </p>
                    </div>
                </div>

                {/* Vendor information sections */}
                <div className="vendor-details-info">
                    <section>
                        <h2>About This Vendor</h2>

                        <p>
                            {vendor.name} is a professional{" "}
                            {vendor.category} based in {vendor.city},{" "}
                            {vendor.state}. They provide event services and
                            work with clients to help create memorable and
                            well-organized events.
                        </p>
                    </section>

                    <section>
                        <h2>Services Offered</h2>

                        <ul>
                            <li>Professional {vendor.category} Services</li>
                            <li>Event Planning &amp; Coordination</li>
                            <li>Customized Event Requirements</li>
                            <li>On-site Event Support</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Suitable For</h2>

                        <ul>
                            <li>Weddings</li>
                            <li>Birthday Parties</li>
                            <li>Engagements</li>
                            <li>Corporate Events</li>
                            <li>Private Events</li>
                        </ul>
                    </section>

                    {/* Why Choose Us */}
                    <section className="vendor-why-section">
                        <h2>Why Choose This Vendor?</h2>

                        <p>
                            Find services that suit your event needs and
                            make your special occasions memorable.
                        </p>

                        <div className="vendor-why-grid">
                            <div className="vendor-why-card">
                                <h3>⭐ Quality Service</h3>
                                <p>
                                    Professional {vendor.category} services
                                    for your special occasions.
                                </p>
                            </div>

                            <div className="vendor-why-card">
                                <h3>📍 Local Expertise</h3>
                                <p>
                                    Explore event services based in{" "}
                                    {vendor.city}, {vendor.state}.
                                </p>
                            </div>

                            <div className="vendor-why-card">
                                <h3>💰 Pricing Information</h3>
                                <p>
                                    Review the listed price and choose a
                                    vendor that suits your requirements.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Booking button */}
                <button
                    className="book-vendor-btn"
                    onClick={() =>
                        navigate(`/booking?vendorId=${vendor.id ?? id}`)
                    }
                >
                    Book This Vendor
                </button>
            </div>
        </div>
    );
}

export default VendorDetails;
