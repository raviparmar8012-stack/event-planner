import "../styles/hero.css";

function Hero() {
    return (
        <section children="hero">
            <div className="hero-content">
                <h1>Plan Your Dream Event</h1>

                <p>
                    Find trusted vendors and book your perfect event
                    in just a few clicks.
                </p>

                <div className="hero-buttons">
                    <button className="book-btn">Book Now</button>
                    <button className="vendor-btn">Explore Vendors</button>
                </div>

            </div>

            <div className="hero-image">
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900"
                    alt="Event Planning"
                />
            </div>


        </section>
    );
}

export default Hero;