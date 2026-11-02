
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import "../styles/Vendor.css";

function Vendor() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Fetch vendors from backend
    useEffect(() => {
        let isMounted = true;

        const fetchVendors = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/vendors"
                );

                if (!isMounted) return;

                if (response.data?.success) {
                    setVendors(response.data.vendors || []);
                } else {
                    setError("Failed to load vendors.");
                }
            } catch (err) {
                if (!isMounted) return;

                console.error("Vendor Fetch Error:", err);
                setError("Failed to load vendors. Please try again.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchVendors();

        return () => {
            isMounted = false;
        };
    }, []);

    // Get unique states
    const states = useMemo(
        () =>
            [
                ...new Set(
                    vendors
                        .map((vendor) => vendor.state)
                        .filter(Boolean)
                ),
            ].sort(),
        [vendors]
    );

    // Get cities based on selected state
    const cities = useMemo(
        () =>
            [
                ...new Set(
                    vendors
                        .filter(
                            (vendor) =>
                                !selectedState ||
                                vendor.state === selectedState
                        )
                        .map((vendor) => vendor.city)
                        .filter(Boolean)
                ),
            ].sort(),
        [vendors, selectedState]
    );

    // Get unique categories
    const categories = useMemo(
        () =>
            [
                ...new Set(
                    vendors
                        .map((vendor) => vendor.category)
                        .filter(Boolean)
                ),
            ].sort(),
        [vendors]
    );

    // Filter vendors
    const filteredVendors = useMemo(
        () =>
            vendors.filter(
                (vendor) =>
                    (!selectedState ||
                        vendor.state === selectedState) &&
                    (!selectedCity ||
                        vendor.city === selectedCity) &&
                    (!selectedCategory ||
                        vendor.category === selectedCategory)
            ),
        [vendors, selectedState, selectedCity, selectedCategory]
    );

    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
        setSelectedCity("");
    };

    const clearFilters = () => {
        setSelectedState("");
        setSelectedCity("");
        setSelectedCategory("");
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="vendor-page">
                    <p className="vendor-status">Loading vendors...</p>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <main className="vendor-page">
                    <p className="vendor-error">{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="vendor-page">
                <section className="vendor-header">
                    <h1>Find Your Perfect Vendor</h1>
                    <p>
                        Explore trusted event vendors across India
                    </p>
                </section>

                <section className="vendor-filters">
                    <select
                        value={selectedState}
                        onChange={handleStateChange}
                        aria-label="Filter by state"
                    >
                        <option value="">All States</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedCity}
                        onChange={(event) =>
                            setSelectedCity(event.target.value)
                        }
                        aria-label="Filter by city"
                    >
                        <option value="">All Cities</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(event) =>
                            setSelectedCategory(event.target.value)
                        }
                        aria-label="Filter by category"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                </section>

                <div className="vendor-results-count">
                    Showing {filteredVendors.length} of {vendors.length} vendors
                </div>

                {filteredVendors.length > 0 ? (
                    <section className="vendor-grid">
                        {filteredVendors.map((vendor) => (
                            <article
                                className="vendor-card"
                                key={vendor.id}
                            >
                                <div className="vendor-image">
                                    {vendor.image ? (
                                        <img
                                            src={vendor.image}
                                            alt={vendor.name || "Event vendor"}
                                            loading="lazy"
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                                event.currentTarget.parentElement.classList.add(
                                                    "vendor-image-failed"
                                                );
                                            }}
                                        />
                                    ) : (
                                        <div className="vendor-image-placeholder">
                                            <span>🎉</span>
                                            <span>Image unavailable</span>
                                        </div>
                                    )}
                                </div>

                                <div className="vendor-content">
                                    <span className="vendor-category">
                                        {vendor.category}
                                    </span>

                                    <h2>{vendor.name}</h2>

                                    <p className="vendor-location">
                                        📍 {vendor.city}, {vendor.state}
                                    </p>

                                    <p className="vendor-rating">
                                        ⭐ {vendor.rating}
                                    </p>

                                    <p className="vendor-price">
                                        {vendor.price}
                                    </p>

                                    <Link
                                        to={`/vendors/${vendor.id}`}
                                        className="vendor-details-btn"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <div className="vendor-status">
                        <h2>No vendors found</h2>
                        <p>
                            Try changing your selected filters.
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}

export default Vendor;
