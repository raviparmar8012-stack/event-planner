import "../styles/about.css";
import { Link } from "react-router-dom";

function About() {
    const stats = [
        { number: "500+", label: "Events Organized", icon: "🎉" },
        { number: "1000+", label: "Happy Clients", icon: "❤️" },
        { number: "150+", label: "Verified Vendors", icon: "🤝" },
        { number: "4.9★", label: "Customer Rating", icon: "⭐" },
    ];

    const values = [
        {
            icon: "🎯",
            title: "Our Mission",
            description:
                "To provide high-quality event planning services with trusted vendors, creative ideas and affordable pricing.",
        },
        {
            icon: "👁️",
            title: "Our Vision",
            description:
                "To become India's most trusted online event planning platform, known for reliability and customer satisfaction.",
        },
        {
            icon: "💎",
            title: "Our Values",
            description:
                "We value trust, quality, creativity and customer happiness in everything we do.",
        },
    ];

    const features = [
        {
            icon: "🤝",
            title: "Verified Vendors",
            description: "Connect with trusted and experienced professionals.",
        },
        {
            icon: "💰",
            title: "Best Prices",
            description: "Find quality services that fit your budget.",
        },
        {
            icon: "🎧",
            title: "Dedicated Support",
            description: "Get assistance throughout your planning journey.",
        },
        {
            icon: "✨",
            title: "Memorable Experiences",
            description: "We help make every special occasion unforgettable.",
        },
    ];

    return (
        <main className="about">

            <section className="about-hero">
                <div className="about-hero-content">
                    <span className="about-eyebrow">ABOUT EVENTHUB</span>

                    <h1>
                        Making Every
                        <br />
                        Moment <span>Special.</span>
                    </h1>

                    <p>
                        We turn your special moments into unforgettable memories.
                        From weddings to corporate events, we connect you with
                        trusted vendors and seamless event planning services.
                    </p>

                    <div className="about-hero-actions">
                        <Link to="/booking" className="about-btn about-btn-primary">
                            Book Now <span>→</span>
                        </Link>

                        <Link to="/services" className="about-btn about-btn-secondary">
                            Explore Services
                        </Link>
                    </div>
                </div>

                <div className="about-hero-note">
                    <span>♡</span>
                    Events made memorable
                </div>
            </section>

            <section className="about-stats">
                {stats.map((stat) => (
                    <div className="about-stat" key={stat.label}>
                        <span className="about-stat-icon">{stat.icon}</span>
                        <div>
                            <h2>{stat.number}</h2>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="about-story">
                <div className="about-story-visual">
                    <div className="about-story-image">
                        <span>Creating memories, one event at a time.</span>
                    </div>
                </div>

                <div className="about-story-content">
                    <span className="about-eyebrow">OUR STORY</span>
                    <h2>A Journey of Trust and Celebration</h2>

                    <p>
                        EventHub was created with one simple mission — to make
                        event planning simple, affordable and stress-free for everyone.
                    </p>

                    <p>
                        We understand how important your special moments are.
                        That is why we connect customers with trusted vendors,
                        helping them organize memorable events without wasting
                        time searching for reliable services.
                    </p>

                    <div className="about-story-points">
                        <div>
                            <span>✓</span>
                            Trusted event professionals
                        </div>
                        <div>
                            <span>✓</span>
                            Convenient planning experience
                        </div>
                        <div>
                            <span>✓</span>
                            Events tailored to your needs
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-values">
                <div className="about-section-heading">
                    <span className="about-eyebrow">WHAT DRIVES US</span>
                    <h2>Our Mission, Vision & Values</h2>
                    <p>Everything we do begins with making your celebrations special.</p>
                </div>

                <div className="about-values-grid">
                    {values.map((value) => (
                        <article className="about-value-card" key={value.title}>
                            <div className="about-value-icon">{value.icon}</div>
                            <h3>{value.title}</h3>
                            <p>{value.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-why">
                <div className="about-section-heading">
                    <span className="about-eyebrow">WHY EVENTHUB</span>
                    <h2>Your Events, Our Expertise</h2>
                    <p>A smoother way to plan the moments that matter.</p>
                </div>

                <div className="about-features-grid">
                    {features.map((feature) => (
                        <article className="about-feature-card" key={feature.title}>
                            <div className="about-feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-gallery" aria-label="Event celebrations">
                <div className="about-gallery-item gallery-wedding">
                    <span>Beautiful Weddings</span>
                </div>
                <div className="about-gallery-item gallery-reception">
                    <span>Grand Receptions</span>
                </div>
                <div className="about-gallery-item gallery-celebration">
                    <span>Special Celebrations</span>
                </div>
            </section>

            <section className="about-cta">
                <span>LET'S MAKE IT HAPPEN</span>
                <h2>Ready to Plan Your Dream Event?</h2>
                <p>
                    Let us help you create unforgettable memories with trusted
                    vendors and seamless planning.
                </p>

                <Link to="/booking" className="about-btn about-btn-light">
                    Book Your Event <span>→</span>
                </Link>
            </section>

        </main>
    );
}

export default About;