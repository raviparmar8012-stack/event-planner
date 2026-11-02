const getServices = (req, res) => {
    res.json({
        success: true,
        message: "Services API Working 🚀",
        services: [
            {
                id: 1,
                icon: "🎉",
                title: "Event Planning",
                description: "Complete planning from idea to execution."
            },
            {
                id: 2,
                icon: "🍽️",
                title: "Catering",
                description: "Delicious food for every occasion."
            },
            {
                id: 3,
                icon: "📸",
                title: "Drone Photography",
                description: "Capture every beautiful moment."
            },
            {
                id: 4,
                icon: "🎵",
                title: "DJ & Music",
                description: "Professional DJ and sound setup."
            }
        ]
    });
};

module.exports = {
    getServices
};