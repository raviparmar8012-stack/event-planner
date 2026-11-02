import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/venues.css";

const Venues = () => {
    const navigate = useNavigate();

    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [eventFilter, setEventFilter] = useState("");
    const [capacityFilter, setCapacityFilter] = useState("");

    // ==================== FETCH VENUES ====================

    useEffect(() => {
        let isMounted = true;

        const fetchVenues = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/venues"
                );

                if (!isMounted) return;

                if (response.data?.success) {
                    setVenues(response.data.venues || []);
                } else {
                    setError("Failed to load venues");
                }
            } catch (err) {
                if (!isMounted) return;

                console.log("Venue Fetch Error:", err);

                setError(
                    "Unable to load venues. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchVenues();

        return () => {
            isMounted = false;
        };
    }, []);

    // ==================== UNIQUE STATES ====================

    const states = useMemo(() => {
        return [
            ...new Set(
                venues.map((venue) => String(venue.state || ""))
            )
        ]
            .filter(Boolean)
            .sort();
    }, [venues]);

    // ==================== CITIES ====================

    const cities = useMemo(() => {
        let filtered = venues;

        if (stateFilter) {
            filtered = filtered.filter(
                (venue) =>
                    String(venue.state || "") === stateFilter
            );
        }

        return [
            ...new Set(
                filtered.map((venue) =>
                    String(venue.city || "")
                )
            )
        ]
            .filter(Boolean)
            .sort();
    }, [venues, stateFilter]);

    // ==================== EVENT TYPES ====================

    const eventTypes = useMemo(() => {
        const allTypes = venues.flatMap((venue) =>
            Array.isArray(venue.eventTypes)
                ? venue.eventTypes.map((type) => String(type))
                : []
        );

        return [...new Set(allTypes)].sort();
    }, [venues]);

    // ==================== FILTER VENUES ====================

    const filteredVenues = useMemo(() => {
        return venues.filter((venue) => {
            const searchText = search.toLowerCase().trim();

            const venueName = String(venue.name || "");
            const venueCity = String(venue.city || "");
            const venueState = String(venue.state || "");
            const venueCategory = String(venue.category || "");

            const matchesSearch =
                !searchText ||
                venueName.toLowerCase().includes(searchText) ||
                venueCity.toLowerCase().includes(searchText) ||
                venueState.toLowerCase().includes(searchText) ||
                venueCategory.toLowerCase().includes(searchText);

            const matchesState =
                !stateFilter ||
                venueState === stateFilter;

            const matchesCity =
                !cityFilter ||
                venueCity === cityFilter;

            const venueEvents = Array.isArray(venue.eventTypes)
                ? venue.eventTypes.map((type) => String(type))
                : [];

            const matchesEvent =
                !eventFilter ||
                venueEvents.includes(eventFilter);

            const venueCapacity =
                Number(venue.capacity) || 0;

            let matchesCapacity = true;

            if (capacityFilter === "small") {
                matchesCapacity = venueCapacity <= 300;
            }

            if (capacityFilter === "medium") {
                matchesCapacity =
                    venueCapacity > 300 &&
                    venueCapacity <= 600;
            }

            if (capacityFilter === "large") {
                matchesCapacity = venueCapacity > 600;
            }

            return (
                matchesSearch &&
                matchesState &&
                matchesCity &&
                matchesEvent &&
                matchesCapacity
            );
        });
    }, [
        venues,
        search,
        stateFilter,
        cityFilter,
        eventFilter,
        capacityFilter
    ]);

    // ==================== STATE CHANGE ====================

    const handleStateChange = (event) => {
        setStateFilter(event.target.value);
        setCityFilter("");
    };

    // ==================== CLEAR FILTERS ====================

    const clearFilters = () => {
        setSearch("");
        setStateFilter("");
        setCityFilter("");
        setEventFilter("");
        setCapacityFilter("");
    };

    // ==================== DETAILS ====================

    const handleViewDetails = (id) => {
        navigate(`/venues/${id}`);
    };

    // ==================== BOOK VENUE ====================

    const handleBookVenue = (id) => {
        navigate(`/booking?venueId=${id}`);
    };

    return (
        <div className="venues-page">

            {/* ==================== HERO ==================== */}

            <section className="venues-hero">
                <div className="venues-hero-overlay">

                    <span className="venues-eyebrow">
                        FIND YOUR PERFECT PLACE
                    </span>

                    <h1>
                        Beautiful Venues.
                        <br />
                        Unforgettable Events.
                    </h1>

                    <p>
                        Discover premium venues across India
                        for weddings, receptions, engagements,
                        birthdays and more.
                    </p>

                </div>
            </section>

            {/* ==================== MAIN ==================== */}

            <section className="venues-container">

                {/* ==================== HEADER ==================== */}

                <div className="venues-heading">

                    <div>
                        <span className="section-label">
                            EXPLORE VENUES
                        </span>

                        <h2>
                            Find a venue that feels right.
                        </h2>

                        <p>
                            Explore venues by location,
                            event type and guest capacity.
                        </p>
                    </div>

                    <div className="venue-count">
                        <strong>
                            {filteredVenues.length}
                        </strong>

                        <span>
                            venues found
                        </span>
                    </div>

                </div>

                {/* ==================== FILTERS ==================== */}

                <div className="venue-filters">

                    {/* Search */}

                    <div className="filter-group search-group">

                        <label>
                            Search
                        </label>

                        <input
                            type="text"
                            placeholder="Search venue, city..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                    </div>

                    {/* State */}

                    <div className="filter-group">

                        <label>
                            State
                        </label>

                        <select
                            value={stateFilter}
                            onChange={handleStateChange}
                        >
                            <option value="">
                                All States
                            </option>

                            {states.map((state) => (
                                <option
                                    key={state}
                                    value={state}
                                >
                                    {state}
                                </option>
                            ))}

                        </select>

                    </div>

                    {/* City */}

                    <div className="filter-group">

                        <label>
                            City
                        </label>

                        <select
                            value={cityFilter}
                            onChange={(event) =>
                                setCityFilter(
                                    event.target.value
                                )
                            }
                        >
                            <option value="">
                                All Cities
                            </option>

                            {cities.map((city) => (
                                <option
                                    key={city}
                                    value={city}
                                >
                                    {city}
                                </option>
                            ))}

                        </select>

                    </div>

                    {/* Event */}

                    <div className="filter-group">

                        <label>
                            Event
                        </label>

                        <select
                            value={eventFilter}
                            onChange={(event) =>
                                setEventFilter(
                                    event.target.value
                                )
                            }
                        >
                            <option value="">
                                All Events
                            </option>

                            {eventTypes.map((eventType) => (
                                <option
                                    key={eventType}
                                    value={eventType}
                                >
                                    {eventType}
                                </option>
                            ))}

                        </select>

                    </div>

                    {/* Capacity */}

                    <div className="filter-group">

                        <label>
                            Guests
                        </label>

                        <select
                            value={capacityFilter}
                            onChange={(event) =>
                                setCapacityFilter(
                                    event.target.value
                                )
                            }
                        >
                            <option value="">
                                Any Capacity
                            </option>

                            <option value="small">
                                Up to 300
                            </option>

                            <option value="medium">
                                301 - 600
                            </option>

                            <option value="large">
                                600+
                            </option>

                        </select>

                    </div>

                    {/* Clear */}

                    <button
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </div>

                {/* ==================== LOADING ==================== */}

                {loading && (
                    <div className="venue-state">

                        <div className="venue-loader"></div>

                        <p>
                            Finding beautiful venues...
                        </p>

                    </div>
                )}

                {/* ==================== ERROR ==================== */}

                {!loading && error && (
                    <div className="venue-state error-state">

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* ==================== EMPTY ==================== */}

                {!loading &&
                    !error &&
                    filteredVenues.length === 0 && (

                        <div className="venue-state">

                            <div className="empty-icon">
                                🔍
                            </div>

                            <h3>
                                No venues found
                            </h3>

                            <p>
                                Try changing your filters
                                or search.
                            </p>

                            <button
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}

                {/* ==================== VENUE GRID ==================== */}

                {!loading &&
                    !error &&
                    filteredVenues.length > 0 && (

                        <div className="venues-grid">

                            {filteredVenues.map((venue) => {

                                const venueId = Number(venue.id);
                                const rating = Number(venue.rating) || 0;
                                const capacity =
                                    Number(venue.capacity) || 0;

                                return (
                                    <article
                                        className="venue-card"
                                        key={venueId}
                                    >

                                        {/* IMAGE */}

                                        <div className="venue-image">

                                            <img
                                                src={`http://localhost:5000/api/venues/${venueId}/image`}
                                                alt={venue.name}
                                                className="venue-card-img"
                                                loading="lazy"
                                            />

                                            <div className="venue-rating">
                                                ⭐ {rating}
                                            </div>

                                            <div className="venue-category">
                                                {String(venue.category || "")}
                                            </div>

                                        </div>

                                        {/* CONTENT */}

                                        <div className="venue-card-content">

                                            <div className="venue-location">
                                                📍{" "}
                                                {String(
                                                    venue.city || ""
                                                )}
                                                ,{" "}
                                                {String(
                                                    venue.state || ""
                                                )}
                                            </div>

                                            <h3>
                                                {String(
                                                    venue.name || ""
                                                )}
                                            </h3>

                                            <p className="venue-description">
                                                {String(
                                                    venue.description || ""
                                                )}
                                            </p>

                                            <div className="venue-meta">

                                                <span>
                                                    👥 Up to{" "}
                                                    {capacity} guests
                                                </span>

                                                <span>
                                                    📅 Per day
                                                </span>

                                            </div>

                                            {/* PRICE */}

                                            <div className="venue-bottom">

                                                <div className="venue-price">

                                                    <span>
                                                        Starting from
                                                    </span>

                                                    <strong>
                                                        {String(
                                                            venue.price || ""
                                                        )}
                                                    </strong>

                                                    <small>
                                                        / day
                                                    </small>

                                                </div>

                                                <button
                                                    className="venue-details-btn"
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            venueId
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </button>

                                            </div>

                                            {/* BOOK */}

                                            <button
                                                className="venue-book-btn"
                                                onClick={() =>
                                                    handleBookVenue(
                                                        venueId
                                                    )
                                                }
                                            >
                                                Book This Venue
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

export default Venues;