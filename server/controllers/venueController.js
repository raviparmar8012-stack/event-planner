const axios = require("axios");

const getUnsplashImage = async (query) => {
    try {
        const response = await axios.get(
            "https://api.unsplash.com/search/photos",
            {
                params: {
                    query,
                    per_page: 1,
                    orientation: "landscape"
                },
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        const photo = response.data.results[0];

        if (!photo) {
            return null;
        }

        return {
            url: photo.urls.regular,
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html,
            unsplashUrl: photo.links.html
        };

    } catch (error) {
        console.log(
            "Unsplash Image Error:",
            error.response?.data || error.message
        );

        return null;
    }
};

const venues = [

    // ==================== GUJARAT ====================

    {
        id: 1,
        name: "Royal Heritage Banquet",
        category: "Banquet Hall",
        city: "Ahmedabad",
        state: "Gujarat",
        price: "₹50,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Catering", "Decoration"],
        description: "A premium banquet venue for elegant celebrations in Ahmedabad.",
        imageQuery: "luxury wedding banquet hall Ahmedabad"
    },
    {
        id: 2,
        name: "Ahmedabad Garden Pavilion",
        category: "Wedding Lawn",
        city: "Ahmedabad",
        state: "Gujarat",
        price: "₹40,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Open Lawn", "Parking", "Lighting", "Catering"],
        description: "A spacious outdoor venue designed for large celebrations.",
        imageQuery: "wedding garden lawn Ahmedabad"
    },

    {
        id: 3,
        name: "Surat Grand Celebration Hall",
        category: "Banquet Hall",
        city: "Surat",
        state: "Gujarat",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 450,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Catering", "Stage"],
        description: "A modern celebration venue for weddings and social events.",
        imageQuery: "modern wedding banquet hall Surat"
    },
    {
        id: 4,
        name: "Surat Riverside Garden",
        category: "Garden Venue",
        city: "Surat",
        state: "Gujarat",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A beautiful open-air venue suitable for memorable celebrations.",
        imageQuery: "wedding garden venue Surat"
    },

    // ==================== MAHARASHTRA ====================

    {
        id: 5,
        name: "Mumbai Grand Convention",
        category: "Convention Hall",
        city: "Mumbai",
        state: "Maharashtra",
        price: "₹90,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 1000,
        eventTypes: ["Wedding", "Corporate", "Reception"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A premium large-capacity event venue in Mumbai.",
        imageQuery: "luxury convention wedding hall Mumbai"
    },
    {
        id: 6,
        name: "Mumbai Sunset Terrace",
        category: "Rooftop Venue",
        city: "Mumbai",
        state: "Maharashtra",
        price: "₹70,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 350,
        eventTypes: ["Reception", "Engagement", "Birthday"],
        amenities: ["Rooftop", "City View", "Lighting", "Catering"],
        description: "A stylish rooftop venue with a beautiful city atmosphere.",
        imageQuery: "rooftop wedding venue Mumbai"
    },

    {
        id: 7,
        name: "Pune Celebration Palace",
        category: "Banquet Hall",
        city: "Pune",
        state: "Maharashtra",
        price: "₹55,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Catering", "Stage"],
        description: "A spacious premium banquet hall for celebrations.",
        imageQuery: "premium wedding banquet Pune"
    },
    {
        id: 8,
        name: "Pune Green Garden",
        category: "Wedding Lawn",
        city: "Pune",
        state: "Maharashtra",
        price: "₹42,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 750,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Decoration"],
        description: "An elegant green lawn venue for outdoor celebrations.",
        imageQuery: "wedding garden Pune"
    },

    // ==================== RAJASTHAN ====================

    {
        id: 9,
        name: "Jaipur Royal Courtyard",
        category: "Heritage Venue",
        city: "Jaipur",
        state: "Rajasthan",
        price: "₹1,20,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Heritage Hall", "Garden", "Parking", "Catering"],
        description: "A royal-inspired venue designed for grand celebrations.",
        imageQuery: "royal heritage wedding venue Jaipur"
    },
    {
        id: 10,
        name: "Pink City Celebration Lawn",
        category: "Wedding Lawn",
        city: "Jaipur",
        state: "Rajasthan",
        price: "₹75,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 1000,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Large Lawn", "Parking", "Lighting", "Stage"],
        description: "A large outdoor celebration venue with a royal atmosphere.",
        imageQuery: "royal wedding lawn Jaipur"
    },

    {
        id: 11,
        name: "Udaipur Lakeview Palace",
        category: "Heritage Venue",
        city: "Udaipur",
        state: "Rajasthan",
        price: "₹1,50,000",
        priceUnit: "per day",
        rating: 5.0,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Lake View", "Garden", "Parking", "Catering"],
        description: "A luxurious lake-inspired venue for premium celebrations.",
        imageQuery: "lakeview wedding venue Udaipur"
    },
    {
        id: 12,
        name: "Udaipur Garden Courtyard",
        category: "Garden Venue",
        city: "Udaipur",
        state: "Rajasthan",
        price: "₹85,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 800,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Open Space", "Lighting", "Catering"],
        description: "A beautiful courtyard venue surrounded by a royal ambience.",
        imageQuery: "royal garden wedding Udaipur"
    },

    // ==================== KARNATAKA ====================

    {
        id: 13,
        name: "Bengaluru Grand Convention",
        category: "Convention Hall",
        city: "Bengaluru",
        state: "Karnataka",
        price: "₹80,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 1000,
        eventTypes: ["Wedding", "Corporate", "Reception"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern high-capacity event venue in Bengaluru.",
        imageQuery: "modern convention wedding hall Bengaluru"
    },
    {
        id: 14,
        name: "Bengaluru Garden Pavilion",
        category: "Wedding Lawn",
        city: "Bengaluru",
        state: "Karnataka",
        price: "₹55,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A peaceful outdoor venue for weddings and celebrations.",
        imageQuery: "garden wedding venue Bengaluru"
    },

    {
        id: 15,
        name: "Mysuru Palace View Hall",
        category: "Heritage Venue",
        city: "Mysuru",
        state: "Karnataka",
        price: "₹65,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Heritage Decor", "Parking", "Stage", "Catering"],
        description: "A heritage-style celebration venue inspired by Mysuru architecture.",
        imageQuery: "heritage wedding venue Mysuru"
    },
    {
        id: 16,
        name: "Mysuru Green Celebration Lawn",
        category: "Wedding Lawn",
        city: "Mysuru",
        state: "Karnataka",
        price: "₹40,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 750,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious garden venue for large family celebrations.",
        imageQuery: "wedding garden Mysuru"
    },

    // ==================== TAMIL NADU ====================

    {
        id: 17,
        name: "Chennai Grand Convention",
        category: "Convention Hall",
        city: "Chennai",
        state: "Tamil Nadu",
        price: "₹75,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 1000,
        eventTypes: ["Wedding", "Corporate", "Reception"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A premium convention space for large-scale events.",
        imageQuery: "luxury wedding convention hall Chennai"
    },
    {
        id: 18,
        name: "Chennai Coastal Garden",
        category: "Garden Venue",
        city: "Chennai",
        state: "Tamil Nadu",
        price: "₹50,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Garden", "Open Space", "Parking", "Catering"],
        description: "An elegant outdoor venue for memorable celebrations.",
        imageQuery: "outdoor wedding garden Chennai"
    },

    {
        id: 19,
        name: "Coimbatore Grand Banquet",
        category: "Banquet Hall",
        city: "Coimbatore",
        state: "Tamil Nadu",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern banquet hall for weddings and family events.",
        imageQuery: "wedding banquet hall Coimbatore"
    },
    {
        id: 20,
        name: "Coimbatore Green Meadows",
        category: "Wedding Lawn",
        city: "Coimbatore",
        state: "Tamil Nadu",
        price: "₹38,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 800,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Decoration"],
        description: "A spacious green venue for outdoor celebrations.",
        imageQuery: "wedding lawn Coimbatore"
    },

    // ==================== TELANGANA ====================

    {
        id: 21,
        name: "Hyderabad Royal Convention",
        category: "Convention Hall",
        city: "Hyderabad",
        state: "Telangana",
        price: "₹85,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 1200,
        eventTypes: ["Wedding", "Corporate", "Reception"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A grand convention venue for premium events.",
        imageQuery: "luxury wedding convention Hyderabad"
    },
    {
        id: 22,
        name: "Hyderabad Garden Palace",
        category: "Wedding Lawn",
        city: "Hyderabad",
        state: "Telangana",
        price: "₹60,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 900,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A premium outdoor wedding destination.",
        imageQuery: "luxury wedding garden Hyderabad"
    },

    {
        id: 23,
        name: "Warangal Heritage Hall",
        category: "Heritage Venue",
        city: "Warangal",
        state: "Telangana",
        price: "₹40,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Heritage Decor", "Parking", "Stage", "Catering"],
        description: "A heritage-inspired venue for elegant celebrations.",
        imageQuery: "heritage wedding hall Warangal"
    },
    {
        id: 24,
        name: "Warangal Celebration Lawn",
        category: "Wedding Lawn",
        city: "Warangal",
        state: "Telangana",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "An affordable outdoor venue for family events.",
        imageQuery: "wedding lawn Warangal"
    },

    // ==================== WEST BENGAL ====================

    {
        id: 25,
        name: "Kolkata Grand Palace Hall",
        category: "Banquet Hall",
        city: "Kolkata",
        state: "West Bengal",
        price: "₹65,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 800,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A sophisticated banquet venue for grand celebrations.",
        imageQuery: "grand wedding banquet Kolkata"
    },
    {
        id: 26,
        name: "Kolkata Riverside Lawn",
        category: "Garden Venue",
        city: "Kolkata",
        state: "West Bengal",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Open Space", "Lighting", "Parking"],
        description: "A spacious outdoor venue with a relaxed atmosphere.",
        imageQuery: "riverside wedding garden Kolkata"
    },

    {
        id: 27,
        name: "Siliguri Mountain View Hall",
        category: "Banquet Hall",
        city: "Siliguri",
        state: "West Bengal",
        price: "₹38,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern venue surrounded by a beautiful mountain atmosphere.",
        imageQuery: "mountain view wedding venue Siliguri"
    },
    {
        id: 28,
        name: "Siliguri Green Garden",
        category: "Wedding Lawn",
        city: "Siliguri",
        state: "West Bengal",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A comfortable outdoor venue for family celebrations.",
        imageQuery: "wedding garden Siliguri"
    },

    // ==================== UTTAR PRADESH ====================

    {
        id: 29,
        name: "Lucknow Nawabi Celebration Hall",
        category: "Heritage Venue",
        city: "Lucknow",
        state: "Uttar Pradesh",
        price: "₹60,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 800,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Heritage Decor", "AC Hall", "Parking", "Catering"],
        description: "A luxurious venue inspired by Lucknow's royal heritage.",
        imageQuery: "nawabi heritage wedding venue Lucknow"
    },
    {
        id: 30,
        name: "Lucknow Royal Garden",
        category: "Wedding Lawn",
        city: "Lucknow",
        state: "Uttar Pradesh",
        price: "₹42,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 900,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A large outdoor venue for beautiful celebrations.",
        imageQuery: "royal wedding lawn Lucknow"
    },

    {
        id: 31,
        name: "Noida Elite Convention",
        category: "Convention Hall",
        city: "Noida",
        state: "Uttar Pradesh",
        price: "₹70,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 1000,
        eventTypes: ["Wedding", "Corporate", "Reception"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern convention venue for large-scale events.",
        imageQuery: "modern convention wedding hall Noida"
    },
    {
        id: 32,
        name: "Noida Celebration Garden",
        category: "Wedding Lawn",
        city: "Noida",
        state: "Uttar Pradesh",
        price: "₹50,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 850,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A premium lawn venue for weddings and celebrations.",
        imageQuery: "wedding garden Noida"
    },

    // ==================== MADHYA PRADESH ====================

    {
        id: 33,
        name: "Indore Grand Celebration Hall",
        category: "Banquet Hall",
        city: "Indore",
        state: "Madhya Pradesh",
        price: "₹48,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern banquet venue for elegant celebrations.",
        imageQuery: "wedding banquet hall Indore"
    },
    {
        id: 34,
        name: "Indore Green Meadows",
        category: "Wedding Lawn",
        city: "Indore",
        state: "Madhya Pradesh",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 750,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious garden venue for outdoor events.",
        imageQuery: "wedding lawn Indore"
    },

    {
        id: 35,
        name: "Bhopal Lakeview Celebration",
        category: "Lakeview Venue",
        city: "Bhopal",
        state: "Madhya Pradesh",
        price: "₹55,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Lake View", "Garden", "Parking", "Catering"],
        description: "A scenic venue with a beautiful lakeside atmosphere.",
        imageQuery: "lakeview wedding venue Bhopal"
    },
    {
        id: 36,
        name: "Bhopal Royal Garden",
        category: "Wedding Lawn",
        city: "Bhopal",
        state: "Madhya Pradesh",
        price: "₹38,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Stage"],
        description: "A spacious outdoor venue for family celebrations.",
        imageQuery: "royal wedding garden Bhopal"
    },

    // ==================== PUNJAB ====================

    {
        id: 37,
        name: "Amritsar Golden Celebration Hall",
        category: "Banquet Hall",
        city: "Amritsar",
        state: "Punjab",
        price: "₹50,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A premium celebration hall designed for grand weddings.",
        imageQuery: "luxury wedding banquet Amritsar"
    },
    {
        id: 38,
        name: "Amritsar Royal Lawn",
        category: "Wedding Lawn",
        city: "Amritsar",
        state: "Punjab",
        price: "₹40,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 850,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A large lawn venue for vibrant Punjabi celebrations.",
        imageQuery: "Punjabi wedding lawn Amritsar"
    },

    {
        id: 39,
        name: "Ludhiana Elite Banquet",
        category: "Banquet Hall",
        city: "Ludhiana",
        state: "Punjab",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern banquet venue for celebrations and receptions.",
        imageQuery: "wedding banquet Ludhiana"
    },
    {
        id: 40,
        name: "Ludhiana Celebration Garden",
        category: "Wedding Lawn",
        city: "Ludhiana",
        state: "Punjab",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 800,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Decoration"],
        description: "A spacious venue for outdoor celebrations.",
        imageQuery: "wedding garden Ludhiana"
    },

    // ==================== HARYANA ====================

    {
        id: 41,
        name: "Gurugram Luxury Convention",
        category: "Convention Hall",
        city: "Gurugram",
        state: "Haryana",
        price: "₹95,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 1200,
        eventTypes: ["Wedding", "Corporate", "Reception"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A premium modern venue for large-scale events.",
        imageQuery: "luxury convention wedding Gurugram"
    },
    {
        id: 42,
        name: "Gurugram Grand Lawn",
        category: "Wedding Lawn",
        city: "Gurugram",
        state: "Haryana",
        price: "₹75,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 1000,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Large Lawn", "Parking", "Lighting", "Catering"],
        description: "A premium outdoor wedding venue in Gurugram.",
        imageQuery: "luxury wedding lawn Gurugram"
    },

    {
        id: 43,
        name: "Faridabad Celebration Hall",
        category: "Banquet Hall",
        city: "Faridabad",
        state: "Haryana",
        price: "₹40,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern venue for weddings and family functions.",
        imageQuery: "wedding banquet Faridabad"
    },
    {
        id: 44,
        name: "Faridabad Green Garden",
        category: "Wedding Lawn",
        city: "Faridabad",
        state: "Haryana",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A comfortable outdoor venue for celebrations.",
        imageQuery: "wedding garden Faridabad"
    },

    // ==================== KERALA ====================

    {
        id: 45,
        name: "Kochi Grand Waterfront",
        category: "Waterfront Venue",
        city: "Kochi",
        state: "Kerala",
        price: "₹65,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Waterfront", "Garden", "Parking", "Catering"],
        description: "A scenic waterfront venue for elegant celebrations.",
        imageQuery: "waterfront wedding venue Kochi"
    },
    {
        id: 46,
        name: "Kochi Palm Garden",
        category: "Resort Venue",
        city: "Kochi",
        state: "Kerala",
        price: "₹55,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Resort", "Parking", "Catering"],
        description: "A tropical-style venue for memorable celebrations.",
        imageQuery: "tropical wedding resort Kochi"
    },

    {
        id: 47,
        name: "Trivandrum Heritage Hall",
        category: "Heritage Venue",
        city: "Thiruvananthapuram",
        state: "Kerala",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 550,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Heritage Decor", "AC Hall", "Parking", "Catering"],
        description: "A traditional venue with elegant heritage-inspired interiors.",
        imageQuery: "heritage wedding hall Thiruvananthapuram"
    },
    {
        id: 48,
        name: "Trivandrum Green Resort",
        category: "Resort Venue",
        city: "Thiruvananthapuram",
        state: "Kerala",
        price: "₹50,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Resort", "Parking", "Catering"],
        description: "A peaceful resort-style venue surrounded by greenery.",
        imageQuery: "green resort wedding Thiruvananthapuram"
    },

    // ==================== ANDHRA PRADESH ====================

    {
        id: 49,
        name: "Vijayawada Grand Banquet",
        category: "Banquet Hall",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        price: "₹42,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern banquet venue for celebrations.",
        imageQuery: "wedding banquet Vijayawada"
    },
    {
        id: 50,
        name: "Vijayawada Celebration Lawn",
        category: "Wedding Lawn",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 750,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious lawn venue for outdoor celebrations.",
        imageQuery: "wedding lawn Vijayawada"
    },

    {
        id: 51,
        name: "Vizag Ocean View Venue",
        category: "Waterfront Venue",
        city: "Visakhapatnam",
        state: "Andhra Pradesh",
        price: "₹60,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Ocean View", "Garden", "Parking", "Catering"],
        description: "A scenic ocean-view venue for premium celebrations.",
        imageQuery: "ocean view wedding venue Visakhapatnam"
    },
    {
        id: 52,
        name: "Vizag Garden Celebration",
        category: "Wedding Lawn",
        city: "Visakhapatnam",
        state: "Andhra Pradesh",
        price: "₹38,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 800,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Stage"],
        description: "A spacious garden venue for outdoor events.",
        imageQuery: "wedding garden Visakhapatnam"
    },

    // ==================== BIHAR ====================

    {
        id: 53,
        name: "Patna Royal Banquet",
        category: "Banquet Hall",
        city: "Patna",
        state: "Bihar",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A comfortable banquet venue for weddings and receptions.",
        imageQuery: "wedding banquet Patna"
    },
    {
        id: 54,
        name: "Patna Celebration Garden",
        category: "Wedding Lawn",
        city: "Patna",
        state: "Bihar",
        price: "₹28,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious outdoor venue for family celebrations.",
        imageQuery: "wedding garden Patna"
    },

    {
        id: 55,
        name: "Gaya Heritage Celebration",
        category: "Heritage Venue",
        city: "Gaya",
        state: "Bihar",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Heritage Decor", "Parking", "Stage", "Catering"],
        description: "A heritage-inspired venue for traditional celebrations.",
        imageQuery: "heritage wedding venue Gaya"
    },
    {
        id: 56,
        name: "Gaya Green Lawn",
        category: "Wedding Lawn",
        city: "Gaya",
        state: "Bihar",
        price: "₹25,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A simple and elegant outdoor celebration venue.",
        imageQuery: "wedding lawn Gaya Bihar"
    },

    // ==================== ODISHA ====================

    {
        id: 57,
        name: "Bhubaneswar Grand Convention",
        category: "Convention Hall",
        city: "Bhubaneswar",
        state: "Odisha",
        price: "₹50,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 800,
        eventTypes: ["Wedding", "Corporate", "Reception"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A premium venue for large celebrations and events.",
        imageQuery: "wedding convention hall Bhubaneswar"
    },
    {
        id: 58,
        name: "Bhubaneswar Garden Palace",
        category: "Wedding Lawn",
        city: "Bhubaneswar",
        state: "Odisha",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 750,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious garden venue for elegant celebrations.",
        imageQuery: "wedding garden Bhubaneswar"
    },

    {
        id: 59,
        name: "Cuttack Celebration Hall",
        category: "Banquet Hall",
        city: "Cuttack",
        state: "Odisha",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 550,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern banquet venue for social celebrations.",
        imageQuery: "wedding banquet Cuttack"
    },
    {
        id: 60,
        name: "Cuttack Green Meadows",
        category: "Wedding Lawn",
        city: "Cuttack",
        state: "Odisha",
        price: "₹26,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "An affordable outdoor celebration venue.",
        imageQuery: "wedding lawn Cuttack"
    },

    // ==================== JHARKHAND ====================

    {
        id: 61,
        name: "Ranchi Grand Celebration",
        category: "Banquet Hall",
        city: "Ranchi",
        state: "Jharkhand",
        price: "₹38,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern venue for weddings and social events.",
        imageQuery: "wedding banquet Ranchi"
    },
    {
        id: 62,
        name: "Ranchi Green Garden",
        category: "Wedding Lawn",
        city: "Ranchi",
        state: "Jharkhand",
        price: "₹28,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious outdoor venue for celebrations.",
        imageQuery: "wedding garden Ranchi"
    },

    {
        id: 63,
        name: "Jamshedpur Elite Hall",
        category: "Banquet Hall",
        city: "Jamshedpur",
        state: "Jharkhand",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 550,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A comfortable venue for elegant family functions.",
        imageQuery: "wedding banquet Jamshedpur"
    },
    {
        id: 64,
        name: "Jamshedpur Celebration Lawn",
        category: "Wedding Lawn",
        city: "Jamshedpur",
        state: "Jharkhand",
        price: "₹25,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A green outdoor venue for family celebrations.",
        imageQuery: "wedding lawn Jamshedpur"
    },

    // ==================== CHHATTISGARH ====================

    {
        id: 65,
        name: "Raipur Grand Convention",
        category: "Convention Hall",
        city: "Raipur",
        state: "Chhattisgarh",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 800,
        eventTypes: ["Wedding", "Corporate", "Reception"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A premium convention venue for large celebrations.",
        imageQuery: "wedding convention hall Raipur"
    },
    {
        id: 66,
        name: "Raipur Royal Garden",
        category: "Wedding Lawn",
        city: "Raipur",
        state: "Chhattisgarh",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 750,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious garden venue for weddings and receptions.",
        imageQuery: "wedding garden Raipur"
    },

    {
        id: 67,
        name: "Bhilai Celebration Hall",
        category: "Banquet Hall",
        city: "Bhilai",
        state: "Chhattisgarh",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 550,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern venue for family celebrations.",
        imageQuery: "wedding banquet Bhilai"
    },
    {
        id: 68,
        name: "Bhilai Green Meadows",
        category: "Wedding Lawn",
        city: "Bhilai",
        state: "Chhattisgarh",
        price: "₹24,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "An affordable outdoor event venue.",
        imageQuery: "wedding lawn Bhilai"
    },

    // ==================== UTTARAKHAND ====================

    {
        id: 69,
        name: "Dehradun Mountain Celebration",
        category: "Resort Venue",
        city: "Dehradun",
        state: "Uttarakhand",
        price: "₹55,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 650,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Garden", "Parking", "Catering"],
        description: "A scenic resort-style venue surrounded by nature.",
        imageQuery: "mountain wedding venue Dehradun"
    },
    {
        id: 70,
        name: "Dehradun Green Lawn",
        category: "Wedding Lawn",
        city: "Dehradun",
        state: "Uttarakhand",
        price: "₹38,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 750,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A beautiful green venue for outdoor celebrations.",
        imageQuery: "wedding lawn Dehradun"
    },

    {
        id: 71,
        name: "Haridwar Riverside Venue",
        category: "Riverside Venue",
        city: "Haridwar",
        state: "Uttarakhand",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["River View", "Garden", "Parking", "Catering"],
        description: "A peaceful riverside venue for traditional celebrations.",
        imageQuery: "riverside wedding venue Haridwar"
    },
    {
        id: 72,
        name: "Haridwar Celebration Garden",
        category: "Wedding Lawn",
        city: "Haridwar",
        state: "Uttarakhand",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "An outdoor venue suitable for family events.",
        imageQuery: "wedding garden Haridwar"
    },

    // ==================== HIMACHAL PRADESH ====================

    {
        id: 73,
        name: "Shimla Mountain Resort",
        category: "Resort Venue",
        city: "Shimla",
        state: "Himachal Pradesh",
        price: "₹65,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Resort", "Parking", "Catering"],
        description: "A scenic mountain venue for destination celebrations.",
        imageQuery: "mountain resort wedding Shimla"
    },
    {
        id: 74,
        name: "Shimla Pine Garden",
        category: "Garden Venue",
        city: "Shimla",
        state: "Himachal Pradesh",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 450,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Mountain View", "Garden", "Parking", "Lighting"],
        description: "A peaceful outdoor venue surrounded by nature.",
        imageQuery: "mountain garden wedding Shimla"
    },

    {
        id: 75,
        name: "Manali Snowview Resort",
        category: "Resort Venue",
        city: "Manali",
        state: "Himachal Pradesh",
        price: "₹75,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Resort", "Parking", "Catering"],
        description: "A premium destination venue for mountain weddings.",
        imageQuery: "snow mountain wedding resort Manali"
    },
    {
        id: 76,
        name: "Manali Valley Garden",
        category: "Garden Venue",
        city: "Manali",
        state: "Himachal Pradesh",
        price: "₹50,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 400,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Valley View", "Garden", "Parking", "Lighting"],
        description: "A scenic garden venue surrounded by mountain views.",
        imageQuery: "valley garden wedding Manali"
    },

    // ==================== GOA ====================

    {
        id: 77,
        name: "Panaji Beach Celebration",
        category: "Beach Venue",
        city: "Panaji",
        state: "Goa",
        price: "₹90,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Beach View", "Outdoor Space", "Lighting", "Catering"],
        description: "A premium beach-style venue for destination celebrations.",
        imageQuery: "beach wedding venue Panaji Goa"
    },
    {
        id: 78,
        name: "Panaji Palm Resort",
        category: "Resort Venue",
        city: "Panaji",
        state: "Goa",
        price: "₹75,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Resort", "Pool", "Garden", "Catering"],
        description: "A tropical resort venue for stylish celebrations.",
        imageQuery: "tropical wedding resort Panaji Goa"
    },

    {
        id: 79,
        name: "Margao Beachside Garden",
        category: "Beach Venue",
        city: "Margao",
        state: "Goa",
        price: "₹70,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Outdoor Space", "Beach View", "Lighting", "Catering"],
        description: "A beautiful tropical venue for destination weddings.",
        imageQuery: "beach wedding venue Margao Goa"
    },
    {
        id: 80,
        name: "Margao Palm Grove",
        category: "Garden Venue",
        city: "Margao",
        state: "Goa",
        price: "₹55,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 450,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Palm Garden", "Parking", "Lighting", "Catering"],
        description: "A tropical garden venue with a relaxed celebration atmosphere.",
        imageQuery: "palm garden wedding Margao Goa"
    },

    // ==================== ASSAM ====================

    {
        id: 81,
        name: "Guwahati Riverside Hall",
        category: "Riverside Venue",
        city: "Guwahati",
        state: "Assam",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["River View", "AC Hall", "Parking", "Catering"],
        description: "A scenic riverside venue for elegant celebrations.",
        imageQuery: "riverside wedding venue Guwahati"
    },
    {
        id: 82,
        name: "Guwahati Green Garden",
        category: "Wedding Lawn",
        city: "Guwahati",
        state: "Assam",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 700,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious green venue for outdoor celebrations.",
        imageQuery: "wedding garden Guwahati"
    },

    {
        id: 83,
        name: "Dibrugarh Tea Garden Venue",
        category: "Garden Venue",
        city: "Dibrugarh",
        state: "Assam",
        price: "₹40,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Tea Garden", "Outdoor Space", "Parking", "Catering"],
        description: "A unique tea-garden inspired venue for celebrations.",
        imageQuery: "tea garden wedding venue Dibrugarh"
    },
    {
        id: 84,
        name: "Dibrugarh Celebration Hall",
        category: "Banquet Hall",
        city: "Dibrugarh",
        state: "Assam",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 450,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A comfortable banquet venue for family events.",
        imageQuery: "wedding banquet Dibrugarh"
    },

    // ==================== SIKKIM ====================

    {
        id: 85,
        name: "Gangtok Mountain View Resort",
        category: "Resort Venue",
        city: "Gangtok",
        state: "Sikkim",
        price: "₹60,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 400,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Resort", "Parking", "Catering"],
        description: "A scenic mountain resort for destination celebrations.",
        imageQuery: "mountain wedding resort Gangtok"
    },
    {
        id: 86,
        name: "Gangtok Valley Garden",
        category: "Garden Venue",
        city: "Gangtok",
        state: "Sikkim",
        price: "₹42,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 350,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Valley View", "Garden", "Lighting", "Catering"],
        description: "A peaceful garden venue surrounded by mountain scenery.",
        imageQuery: "mountain garden wedding Gangtok"
    },

    {
        id: 87,
        name: "Namchi Mountain Celebration",
        category: "Resort Venue",
        city: "Namchi",
        state: "Sikkim",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 350,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Garden", "Parking", "Catering"],
        description: "A scenic destination venue for intimate celebrations.",
        imageQuery: "mountain wedding venue Namchi Sikkim"
    },
    {
        id: 88,
        name: "Namchi Green Garden",
        category: "Garden Venue",
        city: "Namchi",
        state: "Sikkim",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 300,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Mountain View", "Lighting", "Parking"],
        description: "A peaceful outdoor venue for small celebrations.",
        imageQuery: "garden wedding Namchi Sikkim"
    },

    // ==================== ARUNACHAL PRADESH ====================

    {
        id: 89,
        name: "Itanagar Valley Resort",
        category: "Resort Venue",
        city: "Itanagar",
        state: "Arunachal Pradesh",
        price: "₹42,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 400,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Resort", "Parking", "Catering"],
        description: "A scenic resort-style venue for celebrations.",
        imageQuery: "mountain wedding resort Itanagar"
    },
    {
        id: 90,
        name: "Itanagar Green Celebration",
        category: "Garden Venue",
        city: "Itanagar",
        state: "Arunachal Pradesh",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 350,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Outdoor Space", "Parking", "Lighting"],
        description: "A peaceful green venue for family celebrations.",
        imageQuery: "garden wedding Itanagar"
    },

    {
        id: 91,
        name: "Tawang Mountain Retreat",
        category: "Resort Venue",
        city: "Tawang",
        state: "Arunachal Pradesh",
        price: "₹55,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 300,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Resort", "Parking", "Catering"],
        description: "A destination-style mountain venue for intimate events.",
        imageQuery: "mountain resort wedding Tawang"
    },
    {
        id: 92,
        name: "Tawang Valley Garden",
        category: "Garden Venue",
        city: "Tawang",
        state: "Arunachal Pradesh",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 250,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Valley View", "Garden", "Parking", "Lighting"],
        description: "A scenic outdoor venue surrounded by mountains.",
        imageQuery: "mountain garden wedding Tawang"
    },

    // ==================== NAGALAND ====================

    {
        id: 93,
        name: "Kohima Highland Resort",
        category: "Resort Venue",
        city: "Kohima",
        state: "Nagaland",
        price: "₹45,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 350,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Resort", "Parking", "Catering"],
        description: "A scenic highland venue for destination celebrations.",
        imageQuery: "mountain wedding resort Kohima"
    },
    {
        id: 94,
        name: "Kohima Green Garden",
        category: "Garden Venue",
        city: "Kohima",
        state: "Nagaland",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 300,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Mountain View", "Parking", "Lighting"],
        description: "A peaceful outdoor venue for intimate celebrations.",
        imageQuery: "garden wedding Kohima"
    },

    {
        id: 95,
        name: "Dimapur Celebration Hall",
        category: "Banquet Hall",
        city: "Dimapur",
        state: "Nagaland",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 450,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A comfortable banquet venue for celebrations.",
        imageQuery: "wedding banquet Dimapur"
    },
    {
        id: 96,
        name: "Dimapur Garden Venue",
        category: "Wedding Lawn",
        city: "Dimapur",
        state: "Nagaland",
        price: "₹25,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious outdoor venue for family events.",
        imageQuery: "wedding garden Dimapur"
    },

    // ==================== MANIPUR ====================

    {
        id: 97,
        name: "Imphal Valley Celebration",
        category: "Garden Venue",
        city: "Imphal",
        state: "Manipur",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 450,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Garden", "Open Space", "Parking", "Catering"],
        description: "A spacious green venue for traditional celebrations.",
        imageQuery: "garden wedding Imphal Manipur"
    },
    {
        id: 98,
        name: "Imphal Grand Hall",
        category: "Banquet Hall",
        city: "Imphal",
        state: "Manipur",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 400,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern venue for family celebrations.",
        imageQuery: "wedding banquet Imphal"
    },

    {
        id: 99,
        name: "Churachandpur Green Resort",
        category: "Resort Venue",
        city: "Churachandpur",
        state: "Manipur",
        price: "₹32,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 300,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Garden", "Resort", "Parking", "Catering"],
        description: "A peaceful resort venue for intimate events.",
        imageQuery: "green resort wedding Churachandpur"
    },
    {
        id: 100,
        name: "Churachandpur Garden Hall",
        category: "Garden Venue",
        city: "Churachandpur",
        state: "Manipur",
        price: "₹25,000",
        priceUnit: "per day",
        rating: 4.5,
        capacity: 350,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A simple outdoor venue for family celebrations.",
        imageQuery: "wedding garden Churachandpur"
    },

    // ==================== MIZORAM ====================

    {
        id: 101,
        name: "Aizawl Mountain Hall",
        category: "Mountain Venue",
        city: "Aizawl",
        state: "Mizoram",
        price: "₹40,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 450,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "AC Hall", "Parking", "Catering"],
        description: "A scenic venue overlooking the hills of Aizawl.",
        imageQuery: "mountain wedding venue Aizawl"
    },
    {
        id: 102,
        name: "Aizawl Green Garden",
        category: "Garden Venue",
        city: "Aizawl",
        state: "Mizoram",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 400,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Mountain View", "Parking", "Lighting"],
        description: "A peaceful green venue for outdoor celebrations.",
        imageQuery: "garden wedding Aizawl"
    },

    {
        id: 103,
        name: "Lunglei Valley Resort",
        category: "Resort Venue",
        city: "Lunglei",
        state: "Mizoram",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 300,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Valley View", "Resort", "Parking", "Catering"],
        description: "A scenic valley venue for intimate celebrations.",
        imageQuery: "valley wedding resort Lunglei"
    },
    {
        id: 104,
        name: "Lunglei Garden Celebration",
        category: "Garden Venue",
        city: "Lunglei",
        state: "Mizoram",
        price: "₹25,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 300,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Outdoor Space", "Parking", "Lighting"],
        description: "A peaceful outdoor celebration venue.",
        imageQuery: "garden wedding Lunglei"
    },

    // ==================== TRIPURA ====================

    {
        id: 105,
        name: "Agartala Royal Banquet",
        category: "Banquet Hall",
        city: "Agartala",
        state: "Tripura",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["AC Hall", "Parking", "Stage", "Catering"],
        description: "A modern banquet venue for elegant celebrations.",
        imageQuery: "wedding banquet Agartala"
    },
    {
        id: 106,
        name: "Agartala Green Garden",
        category: "Wedding Lawn",
        city: "Agartala",
        state: "Tripura",
        price: "₹28,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 600,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A spacious garden venue for family celebrations.",
        imageQuery: "wedding garden Agartala"
    },

    {
        id: 107,
        name: "Udaipur Tripura Heritage Hall",
        category: "Heritage Venue",
        city: "Udaipur",
        state: "Tripura",
        price: "₹30,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 400,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Heritage Decor", "AC Hall", "Parking", "Catering"],
        description: "A heritage-inspired venue for traditional celebrations.",
        imageQuery: "heritage wedding venue Udaipur Tripura"
    },
    {
        id: 108,
        name: "Udaipur Tripura Garden",
        category: "Garden Venue",
        city: "Udaipur",
        state: "Tripura",
        price: "₹24,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Parking", "Lighting", "Catering"],
        description: "A comfortable outdoor venue for celebrations.",
        imageQuery: "wedding garden Udaipur Tripura"
    },

    // ==================== MEGHALAYA ====================

    {
        id: 109,
        name: "Shillong Cloudview Resort",
        category: "Resort Venue",
        city: "Shillong",
        state: "Meghalaya",
        price: "₹50,000",
        priceUnit: "per day",
        rating: 4.9,
        capacity: 450,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Mountain View", "Resort", "Parking", "Catering"],
        description: "A scenic hilltop venue for destination celebrations.",
        imageQuery: "cloud mountain wedding resort Shillong"
    },
    {
        id: 110,
        name: "Shillong Green Garden",
        category: "Garden Venue",
        city: "Shillong",
        state: "Meghalaya",
        price: "₹35,000",
        priceUnit: "per day",
        rating: 4.8,
        capacity: 500,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Mountain View", "Parking", "Lighting"],
        description: "A peaceful green venue surrounded by hill scenery.",
        imageQuery: "garden wedding Shillong Meghalaya"
    },

    {
        id: 111,
        name: "Tura Hillside Resort",
        category: "Resort Venue",
        city: "Tura",
        state: "Meghalaya",
        price: "₹38,000",
        priceUnit: "per day",
        rating: 4.7,
        capacity: 350,
        eventTypes: ["Wedding", "Reception", "Engagement"],
        amenities: ["Hill View", "Resort", "Parking", "Catering"],
        description: "A scenic hillside venue for intimate celebrations.",
        imageQuery: "hillside wedding resort Tura Meghalaya"
    },
    {
        id: 112,
        name: "Tura Green Celebration",
        category: "Garden Venue",
        city: "Tura",
        state: "Meghalaya",
        price: "₹28,000",
        priceUnit: "per day",
        rating: 4.6,
        capacity: 400,
        eventTypes: ["Wedding", "Reception", "Birthday"],
        amenities: ["Garden", "Hill View", "Parking", "Lighting"],
        description: "A peaceful outdoor venue for family celebrations.",
        imageQuery: "garden wedding Tura Meghalaya"
    }
];


// ==================== GET ALL VENUES ====================

const getAllVenues = async (req, res) => {
    try {
        res.json({
            success: true,
            count: venues.length,
            venues
        });
    } catch (error) {
        console.log("Get Venues Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch venues"
        });
    }
};


// ==================== GET VENUE BY ID ====================

const getVenueById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const venue = venues.find((item) => item.id === id);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found"
            });
        }

        // Get image from Unsplash using venue's imageQuery
        const unsplashImage = await getUnsplashImage(venue.imageQuery);

        res.json({
            success: true,
            venue: {
                ...venue,
                image: unsplashImage?.url || null,
                imageCredit: unsplashImage
                    ? {
                        photographer: unsplashImage.photographer,
                        photographerUrl: unsplashImage.photographerUrl,
                        unsplashUrl: unsplashImage.unsplashUrl
                    }
                    : null
            }
        });

    } catch (error) {
        console.log("Get Venue Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch venue"
        });
    }
};

// ==================== GET VENUE IMAGE ====================

const getVenueImage = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const venue = venues.find((item) => item.id === id);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found"
            });
        }

        const unsplashImage = await getUnsplashImage(venue.imageQuery);

        if (!unsplashImage?.url) {
            return res.status(404).json({
                success: false,
                message: "Venue image not found"
            });
        }

        // Redirect browser directly to Unsplash image
        res.redirect(unsplashImage.url);

    } catch (error) {
        console.log("Get Venue Image Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch venue image"
        });
    }
};


module.exports = {
    getAllVenues,
    getVenueById,
    getVenueImage
};