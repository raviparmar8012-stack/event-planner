
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/package.css";

const Packages = () => {
    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [failedImages, setFailedImages] = useState(new Set());

    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [tierFilter, setTierFilter] = useState("");

    // Fetch packages from backend
    useEffect(() => {
        let isMounted = true;

        const fetchPackages = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/packages"
                );

                if (!isMounted) return;

                if (response.data?.success) {
                    setPackages(response.data.packages || []);
                } else {
                    setError("Failed to load packages.");
                }
            } catch (err) {
                if (!isMounted) return;

                console.error("Package Fetch Error:", err);
                setError("Unable to load packages. Please try again.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPackages();

        return () => {
            isMounted = false;
        };
    }, []);

    // Available states
    const states = useMemo(
        () =>
            [...new Set(
                packages
                    .map((pkg) => String(pkg.state || ""))
                    .filter(Boolean)
            )].sort(),
        [packages]
    );

    // Available cities
    const cities = useMemo(() => {
        const filtered = stateFilter
            ? packages.filter(
                (pkg) => pkg.state === stateFilter
            )
            : packages;

        return [...new Set(
            filtered
                .map((pkg) => String(pkg.city || ""))
                .filter(Boolean)
        )].sort();
    }, [packages, stateFilter]);

    // Available event categories
    const categories = useMemo(
        () =>
            [...new Set(
                packages
                    .map((pkg) => String(pkg.category || ""))
                    .filter(Boolean)
            )].sort(),
        [packages]
    );

    // Search and filters
    const filteredPackages = useMemo(() => {
        return packages.filter((pkg) => {
            const searchText = search.toLowerCase().trim();
            const title = String(pkg.title || "");
            const city = String(pkg.city || "");
            const state = String(pkg.state || "");
            const category = String(pkg.category || "");

            const matchesSearch =
                !searchText ||
                title.toLowerCase().includes(searchText) ||
                city.toLowerCase().includes(searchText) ||
                state.toLowerCase().includes(searchText) ||
                category.toLowerCase().includes(searchText);

            const matchesState =
                !stateFilter || state === stateFilter;

            const matchesCity =
                !cityFilter || city === cityFilter;

            const matchesCategory =
                !categoryFilter || category === categoryFilter;

            const matchesTier =
                !tierFilter ||
                title.toLowerCase().startsWith(
                    tierFilter.toLowerCase()
                );

            return (
                matchesSearch &&
                matchesState &&
                matchesCity &&
                matchesCategory &&
                matchesTier
            );
        });
    }, [
        packages,
        search,
        stateFilter,
        cityFilter,
        categoryFilter,
        tierFilter,
    ]);

    // Filter handlers
    const handleStateChange = (event) => {
        setStateFilter(event.target.value);
        setCityFilter("");
    };

    const clearFilters = () => {
        setSearch("");
        setStateFilter("");
        setCityFilter("");
        setCategoryFilter("");
        setTierFilter("");
    };

    // Navigation
    const handleViewDetails = (id) => {
        navigate(`/packages/${id}`);
    };

    const handleBookPackage = (id) => {
        navigate(`/booking?packageId=${id}`);
    };

    // Loading screen
    if (loading) {
        return (
            <div className="packages-state">
                <div className="packages-loader"></div>
                <p>Finding perfect packages...</p>
            </div>
        );
    }

    // Error screen
    if (error) {
        return (
            <div className="packages-state error-state">
                <div className="package-error-icon">📦</div>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="packages-page">
            {/* Hero */}
            <section className="packages-hero">
                <div className="packages-hero-overlay">
                    <span className="packages-eyebrow">
                        CURATED EVENT EXPERIENCES
                    </span>

                    <h1>
                        Everything You Need.
                        <br />
                        One Perfect Package.
                    </h1>

                    <p>
                        Discover professionally curated event
                        packages across India's most exciting cities.
                    </p>
                </div>
            </section>

            {/* Main content */}
            <section className="packages-container">
                <div className="packages-heading">
                    <div>
                        <span className="section-label">
                            EXPLORE PACKAGES
                        </span>

                        <h2>
                            Find the right package
                            for your event.
                        </h2>

                        <p>
                            Choose from carefully designed
                            packages based on your city,
                            event type and requirements.
                        </p>
                    </div>

                    <div className="package-count">
                        <strong>{filteredPackages.length}</strong>
                        <span>packages found</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="package-filters">
                    <div className="filter-group search-group">
                        <label>Search</label>
                        <input
                            type="text"
                            placeholder="Search package, city..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="filter-group">
                        <label>State</label>
                        <select
                            value={stateFilter}
                            onChange={handleStateChange}
                        >
                            <option value="">All States</option>
                            {states.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>City</label>
                        <select
                            value={cityFilter}
                            onChange={(event) =>
                                setCityFilter(event.target.value)
                            }
                        >
                            <option value="">All Cities</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Event</label>
                        <select
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(event.target.value)
                            }
                        >
                            <option value="">All Events</option>
                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Package</label>
                        <select
                            value={tierFilter}
                            onChange={(event) =>
                                setTierFilter(event.target.value)
                            }
                        >
                            <option value="">All Packages</option>
                            <option value="Essential">Essential</option>
                            <option value="Premium">Premium</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    </div>

                    <button
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>
                </div>

                {/* Empty state */}
                {filteredPackages.length === 0 && (
                    <div className="packages-state">
                        <div className="package-empty-icon">🔍</div>
                        <h2>No packages found</h2>
                        <p>Try changing your filters or search.</p>
                        <button onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Package cards */}
                {filteredPackages.length > 0 && (
                    <div className="packages-grid">
                        {filteredPackages.map((pkg) => {
                            const packageId = Number(pkg.id);
                            const rating = Number(pkg.rating) || 0;
                            const imageUrl =
                                typeof pkg.image === "string"
                                    ? pkg.image.trim()
                                    : "";

                            const showImage =
                                imageUrl &&
                                !failedImages.has(packageId);

                            return (
                                <article
                                    className="package-card"
                                    key={packageId}
                                >
                                    {/* Package image */}
                                    <div className="package-image">
                                        {showImage ? (
                                            <img
                                                className="package-image-photo"
                                                src={imageUrl}
                                                alt={`${pkg.category || "Event"} package`}
                                                loading="lazy"
                                                onError={() => {
                                                    setFailedImages((previous) => {
                                                        const next = new Set(previous);
                                                        next.add(packageId);
                                                        return next;
                                                    });
                                                }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />
                                        ) : (
                                            <div className="package-image-placeholder">
                                                <span>🎉</span>
                                            </div>
                                        )}

                                        <div className="package-rating">
                                            ⭐ {rating}
                                        </div>

                                        <div className="package-category">
                                            {String(pkg.category || "")}
                                        </div>
                                    </div>

                                    {/* Package information */}
                                    <div className="package-card-content">
                                        <div className="package-location">
                                            📍 {String(pkg.city || "")},{" "}
                                            {String(pkg.state || "")}
                                        </div>

                                        <h3>
                                            {String(pkg.title || "")}
                                        </h3>

                                        <p className="package-description">
                                            {String(pkg.description || "")}
                                        </p>

                                        {/* Guests and duration */}
                                        <div className="package-meta">
                                            <span>
                                                👥 {String(pkg.guests || "")}
                                            </span>
                                            <span>
                                                📅 {String(pkg.duration || "")}
                                            </span>
                                        </div>

                                        {/* Price and details */}
                                        <div className="package-bottom">
                                            <div className="package-price">
                                                <span>Complete package</span>
                                                <strong>
                                                    {String(pkg.price || "")}
                                                </strong>
                                            </div>

                                            <button
                                                className="package-details-btn"
                                                onClick={() =>
                                                    handleViewDetails(packageId)
                                                }
                                            >
                                                View Details
                                            </button>
                                        </div>

                                        {/* Booking */}
                                        <button
                                            className="package-book-btn"
                                            onClick={() =>
                                                handleBookPackage(packageId)
                                            }
                                        >
                                            Book This Package
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Packages;
