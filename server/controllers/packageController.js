
const axios = require("axios");

const packages = [];

const cities = [
    { city: "Ahmedabad", state: "Gujarat" },
    { city: "Surat", state: "Gujarat" },
    { city: "Mumbai", state: "Maharashtra" },
    { city: "Pune", state: "Maharashtra" },
    { city: "Jaipur", state: "Rajasthan" },
    { city: "Udaipur", state: "Rajasthan" },
    { city: "Bengaluru", state: "Karnataka" },
    { city: "Mysuru", state: "Karnataka" },
    { city: "Chennai", state: "Tamil Nadu" },
    { city: "Coimbatore", state: "Tamil Nadu" },
    { city: "Hyderabad", state: "Telangana" },
    { city: "Warangal", state: "Telangana" },
    { city: "Kolkata", state: "West Bengal" },
    { city: "Siliguri", state: "West Bengal" },
    { city: "Lucknow", state: "Uttar Pradesh" },
    { city: "Noida", state: "Uttar Pradesh" },
    { city: "Indore", state: "Madhya Pradesh" },
    { city: "Bhopal", state: "Madhya Pradesh" },
    { city: "Amritsar", state: "Punjab" },
    { city: "Ludhiana", state: "Punjab" },
    { city: "Gurugram", state: "Haryana" },
    { city: "Faridabad", state: "Haryana" },
    { city: "Kochi", state: "Kerala" },
    { city: "Thiruvananthapuram", state: "Kerala" },
    { city: "Vijayawada", state: "Andhra Pradesh" },
    { city: "Visakhapatnam", state: "Andhra Pradesh" },
    { city: "Patna", state: "Bihar" },
    { city: "Gaya", state: "Bihar" },
    { city: "Bhubaneswar", state: "Odisha" },
    { city: "Cuttack", state: "Odisha" },
    { city: "Ranchi", state: "Jharkhand" },
    { city: "Jamshedpur", state: "Jharkhand" },
    { city: "Raipur", state: "Chhattisgarh" },
    { city: "Bhilai", state: "Chhattisgarh" },
    { city: "Dehradun", state: "Uttarakhand" },
    { city: "Haridwar", state: "Uttarakhand" },
    { city: "Shimla", state: "Himachal Pradesh" },
    { city: "Manali", state: "Himachal Pradesh" },
    { city: "Panaji", state: "Goa" },
    { city: "Margao", state: "Goa" },
    { city: "Guwahati", state: "Assam" },
    { city: "Dibrugarh", state: "Assam" },
    { city: "Gangtok", state: "Sikkim" },
    { city: "Namchi", state: "Sikkim" },
    { city: "Itanagar", state: "Arunachal Pradesh" },
    { city: "Tawang", state: "Arunachal Pradesh" },
    { city: "Kohima", state: "Nagaland" },
    { city: "Dimapur", state: "Nagaland" },
    { city: "Imphal", state: "Manipur" },
    { city: "Churachandpur", state: "Manipur" },
    { city: "Aizawl", state: "Mizoram" },
    { city: "Lunglei", state: "Mizoram" },
    { city: "Agartala", state: "Tripura" },
    { city: "Udaipur", state: "Tripura" },
    { city: "Shillong", state: "Meghalaya" },
    { city: "Tura", state: "Meghalaya" },
];

const categories = [
    "Wedding",
    "Reception",
    "Engagement",
    "Birthday",
    "Corporate Event",
    "Anniversary",
    "Baby Shower",
    "Pre-Wedding",
    "Festival",
    "Conference",
    "Party",
    "College Event",
];

const packageTiers = [
    {
        tier: "Essential",
        price: 50000,
        guests: "100 Guests",
        duration: "1 Day",
        rating: 4.6,
    },
    {
        tier: "Premium",
        price: 120000,
        guests: "300 Guests",
        duration: "2 Days",
        rating: 4.8,
    },
    {
        tier: "Luxury",
        price: 250000,
        guests: "500 Guests",
        duration: "3 Days",
        rating: 5.0,
    },
];

// Generate packages
let packageId = 1;

cities.forEach((location, cityIndex) => {
    packageTiers.forEach((tier, tierIndex) => {
        const category =
            categories[(cityIndex + tierIndex) % categories.length];

        packages.push({
            id: packageId++,
            title: `${tier.tier} ${category} Package`,
            category,
            city: location.city,
            state: location.state,
            price: `₹${tier.price.toLocaleString("en-IN")}`,
            rating: tier.rating,
            guests: tier.guests,
            duration: tier.duration,
            includes: [
                "Event Planning",
                "Professional Coordination",
                "Decor Setup",
                "Vendor Coordination",
                "Event Day Support",
            ],
            description: `A professionally planned ${category.toLowerCase()} package in ${location.city}, ${location.state}, designed for a smooth and memorable event experience.`,
            imageQuery: `${category} event decoration`,
        });
    });
});

// Cache Unsplash photos by category to avoid repeated API requests.
const photoCache = new Map();

const getCategoryPhotos = async (category) => {
    if (photoCache.has(category)) {
        return photoCache.get(category);
    }

    const apiKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!apiKey) {
        console.error("UNSPLASH_ACCESS_KEY is missing in server/.env");
        return [];
    }

    const request = axios
        .get("https://api.unsplash.com/search/photos", {
            params: {
                query: `${category} event decoration`,
                per_page: 30,
                orientation: "landscape",
            },
            headers: {
                Authorization: `Client-ID ${apiKey}`,
            },
            timeout: 10000,
        })
        .then((response) => response.data.results || [])
        .catch((error) => {
            console.error(
                `Unsplash error for ${category}:`,
                error.response?.status || error.message
            );
            return [];
        });

    photoCache.set(category, request);
    return request;
};

const addPackageImage = async (packageItem) => {
    const photos = await getCategoryPhotos(packageItem.category);

    if (!photos.length) {
        return { ...packageItem, image: null };
    }

    const photoIndex = (packageItem.id - 1) % photos.length;
    const photo = photos[photoIndex];

    return {
        ...packageItem,
        image: photo.urls?.regular || photo.urls?.small || null,
        imageCredit: photo.user?.name || "",
        imageLink: photo.links?.html
            ? `${photo.links.html}?utm_source=event_planner&utm_medium=referral`
            : "",
    };
};

// GET all packages
const getPackages = async (req, res) => {
    try {
        const result = await Promise.all(
            packages.map((packageItem) => addPackageImage(packageItem))
        );

        res.json({
            success: true,
            count: result.length,
            packages: result,
        });
    } catch (error) {
        console.error("Get Packages Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch packages",
        });
    }
};

// GET package by ID
const getPackage = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const packageItem = packages.find((item) => item.id === id);

        if (!packageItem) {
            return res.status(404).json({
                success: false,
                message: "Package not found",
            });
        }

        const result = await addPackageImage(packageItem);

        res.json({
            success: true,
            package: result,
        });
    } catch (error) {
        console.error("Get Package Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch package",
        });
    }
};

module.exports = {
    getPackages,
    getPackage,
};
