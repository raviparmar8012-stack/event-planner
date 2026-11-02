const getFeatures = (req, res) => {
    res.json({
        success: true,
        message: "Features API Working 🚀",
        features: [
            {
                id: 1,
                icon: "🛡️",
                title: "Trusted Vendors",
                description: "Verified and experienced vendors for every event."
            },
            {
                id: 2,
                icon: "💰",
                title: "Best Prices",
                description: "Affordable packages with no hidden charges."
            },
            {
                id: 3,
                icon: "⚡",
                title: "Quick Booking",
                description: "Book your event in just a few clicks."
            },
            {
                id: 4,
                icon: "🎧",
                title: "24/7 Support",
                description: "Our support team is always available."
            }
        ]
    });
};

module.exports = {
    getFeatures
};