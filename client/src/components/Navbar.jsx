
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [exploreOpen, setExploreOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setProfileOpen(false);
        navigate("/");
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <div
                className="logo"
                onClick={() => navigate("/")}
            >
                Event Hub
            </div>

            {/* Main Navigation */}
            <ul className="nav-links">
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>

                <li>
                    <NavLink to="/about">About</NavLink>
                </li>

                {/* Explore Dropdown */}
                <li className="dropdown-item">
                    <button
                        type="button"
                        className="dropdown-trigger"
                        onClick={() => setExploreOpen(!exploreOpen)}
                    >
                        Explore
                        <span className="dropdown-arrow">▾</span>
                    </button>

                    {exploreOpen && (
                        <div className="dropdown-menu">
                            <NavLink
                                to="/packages"
                                onClick={() => setExploreOpen(false)}
                            >
                                Packages
                            </NavLink>

                            <NavLink
                                to="/vendor"
                                onClick={() => setExploreOpen(false)}
                            >
                                Vendors
                            </NavLink>

                            <NavLink
                                to="/venues"
                                onClick={() => setExploreOpen(false)}
                            >
                                Venues
                            </NavLink>
                        </div>
                    )}
                </li>

                <li>
                    <NavLink to="/contact">Contact</NavLink>
                </li>
            </ul>

            {/* Profile Dropdown */}
            <div className="profile-menu">
                <button
                    type="button"
                    className="profile-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                >
                    <span className="profile-icon">👤</span>
                    Profile
                    <span className="dropdown-arrow">▾</span>
                </button>

                {profileOpen && (
                    <div className="profile-dropdown">
                        {user ? (
                            <>
                                {/* Logged In User */}
                                <div className="profile-user">
                                    <span className="profile-user-label">
                                        Signed in as
                                    </span>

                                    <strong>{user.name}</strong>
                                </div>

                                {/* Profile link removed */}

                                <NavLink
                                    to="/my-bookings"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    My Bookings
                                </NavLink>

                                <button
                                    type="button"
                                    className="dropdown-logout"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Logged Out User */}
                                <NavLink
                                    to="/login"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    Register
                                </NavLink>

                                <NavLink
                                    to="/vendor/register"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    Become a Vendor
                                </NavLink>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
