const axios = require("axios");
const vendors = [

    // ==================== GUJARAT ====================

    {
        id: 1,
        name: "Royal Celebration Catering",
        category: "Catering",
        rating: 4.8,
        city: "Ahmedabad",
        state: "Gujarat",
        price: "₹25,000"
    },
    {
        id: 2,
        name: "Dream Decor Ahmedabad",
        category: "Decoration",
        rating: 4.7,
        city: "Ahmedabad",
        state: "Gujarat",
        price: "₹18,000"
    },
    {
        id: 3,
        name: "Ahmedabad Beats",
        category: "DJ & Music",
        rating: 4.9,
        city: "Ahmedabad",
        state: "Gujarat",
        price: "₹12,000"
    },

    {
        id: 4,
        name: "Surat Grand Caterers",
        category: "Wedding Planner",
        rating: 4.8,
        city: "Surat",
        state: "Gujarat",
        price: "₹28,000"
    },
    {
        id: 5,
        name: "Surat Wedding Decor",
        category: "Event Management",
        rating: 4.6,
        city: "Surat",
        state: "Gujarat",
        price: "₹20,000"
    },
    {
        id: 6,
        name: "Surat Event Photography",
        category: "Photography",
        rating: 4.8,
        city: "Surat",
        state: "Gujarat",
        price: "₹22,000"
    },

    // ==================== MAHARASHTRA ====================

    {
        id: 7,
        name: "Mumbai Grand Caterers",
        category: "Catering",
        rating: 4.9,
        city: "Mumbai",
        state: "Maharashtra",
        price: "₹45,000"
    },
    {
        id: 8,
        name: "Mumbai Royal Decor",
        category: "Decoration",
        rating: 4.8,
        city: "Mumbai",
        state: "Maharashtra",
        price: "₹35,000"
    },
    {
        id: 9,
        name: "Mumbai Moments Studio",
        category: "Photography",
        rating: 4.9,
        city: "Mumbai",
        state: "Maharashtra",
        price: "₹40,000"
    },

    {
        id: 10,
        name: "Pune Celebration Caterers",
        category: "Catering",
        rating: 4.7,
        city: "Pune",
        state: "Maharashtra",
        price: "₹32,000"
    },
    {
        id: 11,
        name: "Pune Wedding Decor",
        category: "Decoration",
        rating: 4.8,
        city: "Pune",
        state: "Maharashtra",
        price: "₹30,000"
    },
    {
        id: 12,
        name: "Pune Beats Entertainment",
        category: "DJ & Music",
        rating: 4.7,
        city: "Pune",
        state: "Maharashtra",
        price: "₹15,000"
    },

    // ==================== RAJASTHAN ====================

    {
        id: 13,
        name: "Jaipur Royal Weddings",
        category: "Wedding Planner",
        rating: 4.9,
        city: "Jaipur",
        state: "Rajasthan",
        price: "₹60,000"
    },
    {
        id: 14,
        name: "Pink City Decor",
        category: "Decoration",
        rating: 4.8,
        city: "Jaipur",
        state: "Rajasthan",
        price: "₹30,000"
    },
    {
        id: 15,
        name: "Jaipur Royal Catering",
        category: "Catering",
        rating: 4.8,
        city: "Jaipur",
        state: "Rajasthan",
        price: "₹38,000"
    },

    {
        id: 16,
        name: "Udaipur Celebration",
        category: "Event Management",
        rating: 4.9,
        city: "Udaipur",
        state: "Rajasthan",
        price: "₹70,000"
    },
    {
        id: 17,
        name: "Lake City Photography",
        category: "Photography",
        rating: 4.8,
        city: "Udaipur",
        state: "Rajasthan",
        price: "₹35,000"
    },
    {
        id: 18,
        name: "Udaipur Royal Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Udaipur",
        state: "Rajasthan",
        price: "₹32,000"
    },

    // ==================== KARNATAKA ====================

    {
        id: 19,
        name: "Bangalore Event Studio",
        category: "Photography",
        rating: 4.8,
        city: "Bengaluru",
        state: "Karnataka",
        price: "₹35,000"
    },
    {
        id: 20,
        name: "Bangalore Royal Catering",
        category: "Catering",
        rating: 4.7,
        city: "Bengaluru",
        state: "Karnataka",
        price: "₹30,000"
    },
    {
        id: 21,
        name: "Bangalore Beats",
        category: "DJ & Music",
        rating: 4.8,
        city: "Bengaluru",
        state: "Karnataka",
        price: "₹18,000"
    },

    {
        id: 22,
        name: "Mysuru Wedding Planners",
        category: "Wedding Planner",
        rating: 4.8,
        city: "Mysuru",
        state: "Karnataka",
        price: "₹45,000"
    },
    {
        id: 23,
        name: "Mysuru Celebration Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Mysuru",
        state: "Karnataka",
        price: "₹25,000"
    },
    {
        id: 24,
        name: "Mysuru Moments",
        category: "Photography",
        rating: 4.8,
        city: "Mysuru",
        state: "Karnataka",
        price: "₹24,000"
    },

    // ==================== TAMIL NADU ====================

    {
        id: 25,
        name: "Chennai Grand Catering",
        category: "Catering",
        rating: 4.8,
        city: "Chennai",
        state: "Tamil Nadu",
        price: "₹35,000"
    },
    {
        id: 26,
        name: "Chennai Event Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Chennai",
        state: "Tamil Nadu",
        price: "₹28,000"
    },
    {
        id: 27,
        name: "Chennai Wedding Studio",
        category: "Photography",
        rating: 4.9,
        city: "Chennai",
        state: "Tamil Nadu",
        price: "₹32,000"
    },

    {
        id: 28,
        name: "Coimbatore Celebrations",
        category: "Event Management",
        rating: 4.7,
        city: "Coimbatore",
        state: "Tamil Nadu",
        price: "₹45,000"
    },
    {
        id: 29,
        name: "Coimbatore Royal Decor",
        category: "Decoration",
        rating: 4.6,
        city: "Coimbatore",
        state: "Tamil Nadu",
        price: "₹22,000"
    },
    {
        id: 30,
        name: "Coimbatore Catering Hub",
        category: "Catering",
        rating: 4.8,
        city: "Coimbatore",
        state: "Tamil Nadu",
        price: "₹27,000"
    },

    // ==================== TELANGANA ====================

    {
        id: 31,
        name: "Hyderabad Royal Events",
        category: "Event Management",
        rating: 4.8,
        city: "Hyderabad",
        state: "Telangana",
        price: "₹50,000"
    },
    {
        id: 32,
        name: "Hyderabad Grand Catering",
        category: "Catering",
        rating: 4.9,
        city: "Hyderabad",
        state: "Telangana",
        price: "₹40,000"
    },
    {
        id: 33,
        name: "Hyderabad Beats",
        category: "DJ & Music",
        rating: 4.7,
        city: "Hyderabad",
        state: "Telangana",
        price: "₹17,000"
    },

    {
        id: 34,
        name: "Warangal Wedding Decor",
        category: "Decoration",
        rating: 4.6,
        city: "Warangal",
        state: "Telangana",
        price: "₹20,000"
    },
    {
        id: 35,
        name: "Warangal Moments",
        category: "Photography",
        rating: 4.7,
        city: "Warangal",
        state: "Telangana",
        price: "₹22,000"
    },
    {
        id: 36,
        name: "Warangal Catering House",
        category: "Catering",
        rating: 4.7,
        city: "Warangal",
        state: "Telangana",
        price: "₹25,000"
    },

    // ==================== WEST BENGAL ====================

    {
        id: 37,
        name: "Kolkata Moments",
        category: "Photography",
        rating: 4.8,
        city: "Kolkata",
        state: "West Bengal",
        price: "₹32,000"
    },
    {
        id: 38,
        name: "Kolkata Celebration Caterers",
        category: "Catering",
        rating: 4.8,
        city: "Kolkata",
        state: "West Bengal",
        price: "₹30,000"
    },
    {
        id: 39,
        name: "Kolkata Wedding Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Kolkata",
        state: "West Bengal",
        price: "₹26,000"
    },

    {
        id: 40,
        name: "Siliguri Event House",
        category: "Event Management",
        rating: 4.6,
        city: "Siliguri",
        state: "West Bengal",
        price: "₹38,000"
    },
    {
        id: 41,
        name: "Siliguri Beats",
        category: "DJ & Music",
        rating: 4.7,
        city: "Siliguri",
        state: "West Bengal",
        price: "₹14,000"
    },
    {
        id: 42,
        name: "Siliguri Catering Point",
        category: "Catering",
        rating: 4.7,
        city: "Siliguri",
        state: "West Bengal",
        price: "₹24,000"
    },

    // ==================== UTTAR PRADESH ====================

    {
        id: 43,
        name: "Lucknow Royal Catering",
        category: "Catering",
        rating: 4.9,
        city: "Lucknow",
        state: "Uttar Pradesh",
        price: "₹35,000"
    },
    {
        id: 44,
        name: "Lucknow Wedding Decor",
        category: "Decoration",
        rating: 4.8,
        city: "Lucknow",
        state: "Uttar Pradesh",
        price: "₹27,000"
    },
    {
        id: 45,
        name: "Lucknow Event Studio",
        category: "Photography",
        rating: 4.8,
        city: "Lucknow",
        state: "Uttar Pradesh",
        price: "₹30,000"
    },

    {
        id: 46,
        name: "Noida Event Planners",
        category: "Event Management",
        rating: 4.7,
        city: "Noida",
        state: "Uttar Pradesh",
        price: "₹48,000"
    },
    {
        id: 47,
        name: "Noida Beats",
        category: "DJ & Music",
        rating: 4.8,
        city: "Noida",
        state: "Uttar Pradesh",
        price: "₹16,000"
    },
    {
        id: 48,
        name: "Noida Celebration Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Noida",
        state: "Uttar Pradesh",
        price: "₹25,000"
    },

    // ==================== MADHYA PRADESH ====================

    {
        id: 49,
        name: "Indore Grand Caterers",
        category: "Catering",
        rating: 4.8,
        city: "Indore",
        state: "Madhya Pradesh",
        price: "₹28,000"
    },
    {
        id: 50,
        name: "Indore Celebration Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Indore",
        state: "Madhya Pradesh",
        price: "₹22,000"
    },
    {
        id: 51,
        name: "Indore Wedding Studio",
        category: "Photography",
        rating: 4.8,
        city: "Indore",
        state: "Madhya Pradesh",
        price: "₹26,000"
    },

    {
        id: 52,
        name: "Bhopal Royal Events",
        category: "Event Management",
        rating: 4.7,
        city: "Bhopal",
        state: "Madhya Pradesh",
        price: "₹42,000"
    },
    {
        id: 53,
        name: "Bhopal Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Bhopal",
        state: "Madhya Pradesh",
        price: "₹13,000"
    },
    {
        id: 54,
        name: "Bhopal Catering House",
        category: "Catering",
        rating: 4.7,
        city: "Bhopal",
        state: "Madhya Pradesh",
        price: "₹25,000"
    },

    // ==================== PUNJAB ====================

    {
        id: 55,
        name: "Amritsar Celebration Caterers",
        category: "Catering",
        rating: 4.9,
        city: "Amritsar",
        state: "Punjab",
        price: "₹32,000"
    },
    {
        id: 56,
        name: "Amritsar Wedding Decor",
        category: "Decoration",
        rating: 4.8,
        city: "Amritsar",
        state: "Punjab",
        price: "₹25,000"
    },
    {
        id: 57,
        name: "Amritsar Beats",
        category: "DJ & Music",
        rating: 4.8,
        city: "Amritsar",
        state: "Punjab",
        price: "₹15,000"
    },

    {
        id: 58,
        name: "Ludhiana Royal Events",
        category: "Event Management",
        rating: 4.7,
        city: "Ludhiana",
        state: "Punjab",
        price: "₹40,000"
    },
    {
        id: 59,
        name: "Ludhiana Photography Hub",
        category: "Photography",
        rating: 4.8,
        city: "Ludhiana",
        state: "Punjab",
        price: "₹25,000"
    },
    {
        id: 60,
        name: "Ludhiana Catering Point",
        category: "Catering",
        rating: 4.7,
        city: "Ludhiana",
        state: "Punjab",
        price: "₹27,000"
    },

    // ==================== HARYANA ====================

    {
        id: 61,
        name: "Gurugram Elite Events",
        category: "Event Management",
        rating: 4.9,
        city: "Gurugram",
        state: "Haryana",
        price: "₹65,000"
    },
    {
        id: 62,
        name: "Gurugram Wedding Decor",
        category: "Decoration",
        rating: 4.8,
        city: "Gurugram",
        state: "Haryana",
        price: "₹35,000"
    },
    {
        id: 63,
        name: "Gurugram Moments",
        category: "Photography",
        rating: 4.8,
        city: "Gurugram",
        state: "Haryana",
        price: "₹38,000"
    },

    {
        id: 64,
        name: "Faridabad Celebration",
        category: "Catering",
        rating: 4.7,
        city: "Faridabad",
        state: "Haryana",
        price: "₹28,000"
    },
    {
        id: 65,
        name: "Faridabad Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Faridabad",
        state: "Haryana",
        price: "₹14,000"
    },
    {
        id: 66,
        name: "Faridabad Decor Studio",
        category: "Decoration",
        rating: 4.7,
        city: "Faridabad",
        state: "Haryana",
        price: "₹22,000"
    },

    // ==================== KERALA ====================

    {
        id: 67,
        name: "Kochi Celebration House",
        category: "Event Management",
        rating: 4.8,
        city: "Kochi",
        state: "Kerala",
        price: "₹45,000"
    },
    {
        id: 68,
        name: "Kochi Royal Catering",
        category: "Catering",
        rating: 4.8,
        city: "Kochi",
        state: "Kerala",
        price: "₹30,000"
    },
    {
        id: 69,
        name: "Kochi Moments",
        category: "Photography",
        rating: 4.9,
        city: "Kochi",
        state: "Kerala",
        price: "₹32,000"
    },

    {
        id: 70,
        name: "Trivandrum Wedding Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Thiruvananthapuram",
        state: "Kerala",
        price: "₹24,000"
    },
    {
        id: 71,
        name: "Trivandrum Catering Hub",
        category: "Catering",
        rating: 4.8,
        city: "Thiruvananthapuram",
        state: "Kerala",
        price: "₹27,000"
    },
    {
        id: 72,
        name: "Trivandrum Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Thiruvananthapuram",
        state: "Kerala",
        price: "₹13,000"
    },

    // ==================== ANDHRA PRADESH ====================

    {
        id: 73,
        name: "Vijayawada Royal Events",
        category: "Event Management",
        rating: 4.7,
        city: "Vijayawada",
        state: "Andhra Pradesh",
        price: "₹40,000"
    },
    {
        id: 74,
        name: "Vijayawada Catering House",
        category: "Catering",
        rating: 4.8,
        city: "Vijayawada",
        state: "Andhra Pradesh",
        price: "₹26,000"
    },
    {
        id: 75,
        name: "Vijayawada Decor Studio",
        category: "Decoration",
        rating: 4.7,
        city: "Vijayawada",
        state: "Andhra Pradesh",
        price: "₹23,000"
    },

    {
        id: 76,
        name: "Vizag Beach Events",
        category: "Event Management",
        rating: 4.8,
        city: "Visakhapatnam",
        state: "Andhra Pradesh",
        price: "₹45,000"
    },
    {
        id: 77,
        name: "Vizag Moments",
        category: "Photography",
        rating: 4.7,
        city: "Visakhapatnam",
        state: "Andhra Pradesh",
        price: "₹25,000"
    },
    {
        id: 78,
        name: "Vizag Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Visakhapatnam",
        state: "Andhra Pradesh",
        price: "₹14,000"
    },

    // ==================== BIHAR ====================

    {
        id: 79,
        name: "Patna Royal Catering",
        category: "Catering",
        rating: 4.7,
        city: "Patna",
        state: "Bihar",
        price: "₹25,000"
    },
    {
        id: 80,
        name: "Patna Wedding Decor",
        category: "Decoration",
        rating: 4.6,
        city: "Patna",
        state: "Bihar",
        price: "₹20,000"
    },
    {
        id: 81,
        name: "Patna Moments Studio",
        category: "Photography",
        rating: 4.7,
        city: "Patna",
        state: "Bihar",
        price: "₹22,000"
    },

    {
        id: 82,
        name: "Gaya Celebration Events",
        category: "Event Management",
        rating: 4.6,
        city: "Gaya",
        state: "Bihar",
        price: "₹35,000"
    },
    {
        id: 83,
        name: "Gaya Catering Point",
        category: "Catering",
        rating: 4.7,
        city: "Gaya",
        state: "Bihar",
        price: "₹23,000"
    },
    {
        id: 84,
        name: "Gaya Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Gaya",
        state: "Bihar",
        price: "₹12,000"
    },

    // ==================== ODISHA ====================

    {
        id: 85,
        name: "Bhubaneswar Event Studio",
        category: "Event Management",
        rating: 4.8,
        city: "Bhubaneswar",
        state: "Odisha",
        price: "₹42,000"
    },
    {
        id: 86,
        name: "Bhubaneswar Royal Catering",
        category: "Catering",
        rating: 4.7,
        city: "Bhubaneswar",
        state: "Odisha",
        price: "₹27,000"
    },
    {
        id: 87,
        name: "Bhubaneswar Decor House",
        category: "Decoration",
        rating: 4.7,
        city: "Bhubaneswar",
        state: "Odisha",
        price: "₹23,000"
    },

    {
        id: 88,
        name: "Cuttack Celebration",
        category: "Photography",
        rating: 4.6,
        city: "Cuttack",
        state: "Odisha",
        price: "₹21,000"
    },
    {
        id: 89,
        name: "Cuttack Beats",
        category: "DJ & Music",
        rating: 4.7,
        city: "Cuttack",
        state: "Odisha",
        price: "₹12,000"
    },
    {
        id: 90,
        name: "Cuttack Catering Hub",
        category: "Catering",
        rating: 4.7,
        city: "Cuttack",
        state: "Odisha",
        price: "₹24,000"
    },

    // ==================== JHARKHAND ====================

    {
        id: 91,
        name: "Ranchi Royal Events",
        category: "Event Management",
        rating: 4.7,
        city: "Ranchi",
        state: "Jharkhand",
        price: "₹38,000"
    },
    {
        id: 92,
        name: "Ranchi Celebration Decor",
        category: "Decoration",
        rating: 4.6,
        city: "Ranchi",
        state: "Jharkhand",
        price: "₹21,000"
    },
    {
        id: 93,
        name: "Ranchi Moments",
        category: "Photography",
        rating: 4.7,
        city: "Ranchi",
        state: "Jharkhand",
        price: "₹23,000"
    },

    {
        id: 94,
        name: "Jamshedpur Caterers",
        category: "Catering",
        rating: 4.7,
        city: "Jamshedpur",
        state: "Jharkhand",
        price: "₹25,000"
    },
    {
        id: 95,
        name: "Jamshedpur Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Jamshedpur",
        state: "Jharkhand",
        price: "₹13,000"
    },
    {
        id: 96,
        name: "Jamshedpur Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Jamshedpur",
        state: "Jharkhand",
        price: "₹20,000"
    },

    // ==================== CHHATTISGARH ====================

    {
        id: 97,
        name: "Raipur Grand Events",
        category: "Event Management",
        rating: 4.8,
        city: "Raipur",
        state: "Chhattisgarh",
        price: "₹40,000"
    },
    {
        id: 98,
        name: "Raipur Royal Catering",
        category: "Catering",
        rating: 4.7,
        city: "Raipur",
        state: "Chhattisgarh",
        price: "₹26,000"
    },
    {
        id: 99,
        name: "Raipur Wedding Decor",
        category: "Decoration",
        rating: 4.6,
        city: "Raipur",
        state: "Chhattisgarh",
        price: "₹21,000"
    },

    {
        id: 100,
        name: "Bhilai Moments",
        category: "Photography",
        rating: 4.7,
        city: "Bhilai",
        state: "Chhattisgarh",
        price: "₹22,000"
    },
    {
        id: 101,
        name: "Bhilai Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Bhilai",
        state: "Chhattisgarh",
        price: "₹12,000"
    },
    {
        id: 102,
        name: "Bhilai Catering House",
        category: "Catering",
        rating: 4.7,
        city: "Bhilai",
        state: "Chhattisgarh",
        price: "₹23,000"
    },

    // ==================== UTTARAKHAND ====================

    {
        id: 103,
        name: "Dehradun Royal Events",
        category: "Event Management",
        rating: 4.8,
        city: "Dehradun",
        state: "Uttarakhand",
        price: "₹42,000"
    },
    {
        id: 104,
        name: "Dehradun Wedding Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Dehradun",
        state: "Uttarakhand",
        price: "₹24,000"
    },
    {
        id: 105,
        name: "Dehradun Moments",
        category: "Photography",
        rating: 4.8,
        city: "Dehradun",
        state: "Uttarakhand",
        price: "₹27,000"
    },

    {
        id: 106,
        name: "Haridwar Celebration",
        category: "Catering",
        rating: 4.7,
        city: "Haridwar",
        state: "Uttarakhand",
        price: "₹25,000"
    },
    {
        id: 107,
        name: "Haridwar Decor Studio",
        category: "Decoration",
        rating: 4.6,
        city: "Haridwar",
        state: "Uttarakhand",
        price: "₹19,000"
    },
    {
        id: 108,
        name: "Haridwar Event Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Haridwar",
        state: "Uttarakhand",
        price: "₹11,000"
    },

    // ==================== HIMACHAL PRADESH ====================

    {
        id: 109,
        name: "Shimla Mountain Events",
        category: "Event Management",
        rating: 4.9,
        city: "Shimla",
        state: "Himachal Pradesh",
        price: "₹55,000"
    },
    {
        id: 110,
        name: "Shimla Wedding Decor",
        category: "Decoration",
        rating: 4.8,
        city: "Shimla",
        state: "Himachal Pradesh",
        price: "₹30,000"
    },
    {
        id: 111,
        name: "Shimla Moments",
        category: "Photography",
        rating: 4.9,
        city: "Shimla",
        state: "Himachal Pradesh",
        price: "₹35,000"
    },

    {
        id: 112,
        name: "Manali Mountain Weddings",
        category: "Wedding Planner",
        rating: 4.9,
        city: "Manali",
        state: "Himachal Pradesh",
        price: "₹65,000"
    },
    {
        id: 113,
        name: "Manali Celebration Decor",
        category: "Decoration",
        rating: 4.8,
        city: "Manali",
        state: "Himachal Pradesh",
        price: "₹32,000"
    },
    {
        id: 114,
        name: "Manali Photography House",
        category: "Photography",
        rating: 4.8,
        city: "Manali",
        state: "Himachal Pradesh",
        price: "₹38,000"
    },

    // ==================== GOA ====================

    {
        id: 115,
        name: "Goa Beach Events",
        category: "Event Management",
        rating: 4.9,
        city: "Panaji",
        state: "Goa",
        price: "₹70,000"
    },
    {
        id: 116,
        name: "Goa Sunset Photography",
        category: "Photography",
        rating: 4.9,
        city: "Panaji",
        state: "Goa",
        price: "₹45,000"
    },
    {
        id: 117,
        name: "Goa Party Beats",
        category: "DJ & Music",
        rating: 4.8,
        city: "Panaji",
        state: "Goa",
        price: "₹25,000"
    },

    {
        id: 118,
        name: "Margao Royal Catering",
        category: "Catering",
        rating: 4.7,
        city: "Margao",
        state: "Goa",
        price: "₹30,000"
    },
    {
        id: 119,
        name: "Margao Wedding Decor",
        category: "Decoration",
        rating: 4.7,
        city: "Margao",
        state: "Goa",
        price: "₹25,000"
    },
    {
        id: 120,
        name: "Margao Celebration",
        category: "Event Management",
        rating: 4.7,
        city: "Margao",
        state: "Goa",
        price: "₹45,000"
    },

    // ==================== ASSAM ====================

    {
        id: 121,
        name: "Guwahati Celebration Events",
        category: "Event Management",
        rating: 4.7,
        city: "Guwahati",
        state: "Assam",
        price: "₹38,000"
    },
    {
        id: 122,
        name: "Guwahati Royal Catering",
        category: "Catering",
        rating: 4.7,
        city: "Guwahati",
        state: "Assam",
        price: "₹25,000"
    },
    {
        id: 123,
        name: "Guwahati Wedding Decor",
        category: "Decoration",
        rating: 4.6,
        city: "Guwahati",
        state: "Assam",
        price: "₹20,000"
    },

    {
        id: 124,
        name: "Dibrugarh Moments",
        category: "Photography",
        rating: 4.6,
        city: "Dibrugarh",
        state: "Assam",
        price: "₹21,000"
    },
    {
        id: 125,
        name: "Dibrugarh Beats",
        category: "DJ & Music",
        rating: 4.6,
        city: "Dibrugarh",
        state: "Assam",
        price: "₹12,000"
    },
    {
        id: 126,
        name: "Dibrugarh Caterers",
        category: "Catering",
        rating: 4.7,
        city: "Dibrugarh",
        state: "Assam",
        price: "₹22,000"
    },

    // ==================== SIKKIM ====================

    {
        id: 127,
        name: "Gangtok Mountain Events",
        category: "Event Management",
        rating: 4.8,
        city: "Gangtok",
        state: "Sikkim",
        price: "₹45,000"
    },
    {
        id: 128,
        name: "Gangtok Moments",
        category: "Photography",
        rating: 4.8,
        city: "Gangtok",
        state: "Sikkim",
        price: "₹28,000"
    },
    {
        id: 129,
        name: "Gangtok Decor Studio",
        category: "Decoration",
        rating: 4.6,
        city: "Gangtok",
        state: "Sikkim",
        price: "₹22,000"
    },

    {
        id: 130,
        name: "Namchi Celebration",
        category: "Catering",
        rating: 4.6,
        city: "Namchi",
        state: "Sikkim",
        price: "₹20,000"
    },
    {
        id: 131,
        name: "Namchi Beats",
        category: "DJ & Music",
        rating: 4.5,
        city: "Namchi",
        state: "Sikkim",
        price: "₹10,000"
    },
    {
        id: 132,
        name: "Namchi Events",
        category: "Event Management",
        rating: 4.6,
        city: "Namchi",
        state: "Sikkim",
        price: "₹30,000"
    },

    // ==================== ARUNACHAL PRADESH ====================

    {
        id: 133,
        name: "Itanagar Celebration",
        category: "Event Management",
        rating: 4.6,
        city: "Itanagar",
        state: "Arunachal Pradesh",
        price: "₹32,000"
    },
    {
        id: 134,
        name: "Itanagar Catering House",
        category: "Catering",
        rating: 4.6,
        city: "Itanagar",
        state: "Arunachal Pradesh",
        price: "₹21,000"
    },
    {
        id: 135,
        name: "Itanagar Decor",
        category: "Decoration",
        rating: 4.5,
        city: "Itanagar",
        state: "Arunachal Pradesh",
        price: "₹18,000"
    },

    {
        id: 136,
        name: "Tawang Mountain Events",
        category: "Event Management",
        rating: 4.7,
        city: "Tawang",
        state: "Arunachal Pradesh",
        price: "₹40,000"
    },
    {
        id: 137,
        name: "Tawang Moments",
        category: "Photography",
        rating: 4.7,
        city: "Tawang",
        state: "Arunachal Pradesh",
        price: "₹25,000"
    },
    {
        id: 138,
        name: "Tawang Celebration Decor",
        category: "Decoration",
        rating: 4.6,
        city: "Tawang",
        state: "Arunachal Pradesh",
        price: "₹20,000"
    },

    // ==================== NAGALAND ====================

    {
        id: 139,
        name: "Kohima Event House",
        category: "Event Management",
        rating: 4.6,
        city: "Kohima",
        state: "Nagaland",
        price: "₹35,000"
    },
    {
        id: 140,
        name: "Kohima Moments",
        category: "Photography",
        rating: 4.6,
        city: "Kohima",
        state: "Nagaland",
        price: "₹22,000"
    },
    {
        id: 141,
        name: "Kohima Catering Hub",
        category: "Catering",
        rating: 4.6,
        city: "Kohima",
        state: "Nagaland",
        price: "₹22,000"
    },

    {
        id: 142,
        name: "Dimapur Celebration",
        category: "Decoration",
        rating: 4.6,
        city: "Dimapur",
        state: "Nagaland",
        price: "₹19,000"
    },
    {
        id: 143,
        name: "Dimapur Beats",
        category: "DJ & Music",
        rating: 4.5,
        city: "Dimapur",
        state: "Nagaland",
        price: "₹11,000"
    },
    {
        id: 144,
        name: "Dimapur Royal Events",
        category: "Event Management",
        rating: 4.6,
        city: "Dimapur",
        state: "Nagaland",
        price: "₹32,000"
    },

    // ==================== MANIPUR ====================

    {
        id: 145,
        name: "Imphal Royal Events",
        category: "Event Management",
        rating: 4.6,
        city: "Imphal",
        state: "Manipur",
        price: "₹32,000"
    },
    {
        id: 146,
        name: "Imphal Wedding Decor",
        category: "Decoration",
        rating: 4.5,
        city: "Imphal",
        state: "Manipur",
        price: "₹19,000"
    },
    {
        id: 147,
        name: "Imphal Moments",
        category: "Photography",
        rating: 4.6,
        city: "Imphal",
        state: "Manipur",
        price: "₹22,000"
    },

    {
        id: 148,
        name: "Churachandpur Events",
        category: "Event Management",
        rating: 4.5,
        city: "Churachandpur",
        state: "Manipur",
        price: "₹28,000"
    },
    {
        id: 149,
        name: "Churachandpur Catering",
        category: "Catering",
        rating: 4.5,
        city: "Churachandpur",
        state: "Manipur",
        price: "₹19,000"
    },
    {
        id: 150,
        name: "Churachandpur Beats",
        category: "DJ & Music",
        rating: 4.5,
        city: "Churachandpur",
        state: "Manipur",
        price: "₹10,000"
    },

    // ==================== MIZORAM ====================

    {
        id: 151,
        name: "Aizawl Celebration",
        category: "Event Management",
        rating: 4.6,
        city: "Aizawl",
        state: "Mizoram",
        price: "₹32,000"
    },
    {
        id: 152,
        name: "Aizawl Moments",
        category: "Photography",
        rating: 4.6,
        city: "Aizawl",
        state: "Mizoram",
        price: "₹22,000"
    },
    {
        id: 153,
        name: "Aizawl Catering House",
        category: "Catering",
        rating: 4.6,
        city: "Aizawl",
        state: "Mizoram",
        price: "₹20,000"
    },

    {
        id: 154,
        name: "Lunglei Events",
        category: "Event Management",
        rating: 4.5,
        city: "Lunglei",
        state: "Mizoram",
        price: "₹27,000"
    },
    {
        id: 155,
        name: "Lunglei Decor",
        category: "Decoration",
        rating: 4.5,
        city: "Lunglei",
        state: "Mizoram",
        price: "₹17,000"
    },
    {
        id: 156,
        name: "Lunglei Beats",
        category: "DJ & Music",
        rating: 4.5,
        city: "Lunglei",
        state: "Mizoram",
        price: "₹10,000"
    },

    // ==================== TRIPURA ====================

    {
        id: 157,
        name: "Agartala Royal Events",
        category: "Event Management",
        rating: 4.6,
        city: "Agartala",
        state: "Tripura",
        price: "₹30,000"
    },
    {
        id: 158,
        name: "Agartala Catering Hub",
        category: "Catering",
        rating: 4.6,
        city: "Agartala",
        state: "Tripura",
        price: "₹20,000"
    },
    {
        id: 159,
        name: "Agartala Wedding Decor",
        category: "Decoration",
        rating: 4.5,
        city: "Agartala",
        state: "Tripura",
        price: "₹18,000"
    },

    {
        id: 160,
        name: "Udaipur Tripura Events",
        category: "Event Management",
        rating: 4.5,
        city: "Udaipur",
        state: "Tripura",
        price: "₹26,000"
    },
    {
        id: 161,
        name: "Udaipur Tripura Moments",
        category: "Photography",
        rating: 4.5,
        city: "Udaipur",
        state: "Tripura",
        price: "₹19,000"
    },
    {
        id: 162,
        name: "Udaipur Tripura Catering",
        category: "Catering",
        rating: 4.5,
        city: "Udaipur",
        state: "Tripura",
        price: "₹18,000"
    },

    // ==================== MEGHALAYA ====================

    {
        id: 163,
        name: "Shillong Mountain Events",
        category: "Event Management",
        rating: 4.8,
        city: "Shillong",
        state: "Meghalaya",
        price: "₹38,000"
    },
    {
        id: 164,
        name: "Shillong Moments",
        category: "Photography",
        rating: 4.8,
        city: "Shillong",
        state: "Meghalaya",
        price: "₹25,000"
    },
    {
        id: 165,
        name: "Shillong Celebration Decor",
        category: "Decoration",
        rating: 4.6,
        city: "Shillong",
        state: "Meghalaya",
        price: "₹22,000"
    },

    {
        id: 166,
        name: "Tura Event House",
        category: "Event Management",
        rating: 4.5,
        city: "Tura",
        state: "Meghalaya",
        price: "₹27,000"
    },
    {
        id: 167,
        name: "Tura Catering Point",
        category: "Catering",
        rating: 4.5,
        city: "Tura",
        state: "Meghalaya",
        price: "₹19,000"
    },
    {
        id: 168,
        name: "Tura Beats",
        category: "DJ & Music",
        rating: 4.5,
        city: "Tura",
        state: "Meghalaya",
        price: "₹10,000"
    },

    {
        id: 169,
        name: "Test Vendor",
        category: "Event Management",
        rating: 0,
        city: "Ahmedabad",
        state: "Gujarat",
        price: "₹15,000"
    }
];



const vendorPhotoCache = new Map();

const getVendorPhotos = async (category) => {
    if (vendorPhotoCache.has(category)) {
        return vendorPhotoCache.get(category);
    }

    const apiKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!apiKey) {
        console.error("UNSPLASH_ACCESS_KEY missing in server/.env");
        return [];
    }

    const request = axios.get(
        "https://api.unsplash.com/search/photos",
        {
            params: {
                query: `${category} event vendor`,
                per_page: 30,
                orientation: "landscape",
            },
            headers: {
                Authorization: `Client-ID ${apiKey}`,
            },
            timeout: 10000,
        }
    )
        .then((response) => response.data.results || [])
        .catch((error) => {
            console.error(
                `Unsplash vendor image error (${category}):`,
                error.response?.status || error.message
            );
            return [];
        });

    vendorPhotoCache.set(category, request);
    return request;
};

const attachVendorImage = async (vendor) => {
    const photos = await getVendorPhotos(vendor.category);

    if (!photos.length) {
        return { ...vendor, image: null };
    }

    const photo = photos[vendor.id % photos.length];

    return {
        ...vendor,
        image: photo.urls?.regular || photo.urls?.small || null,
        imageCredit: photo.user?.name || "",
        imageLink: photo.links?.html || "",
    };
};

// GET ALL VENDORS
const getVendors = async (req, res) => {
    try {
        const result = await Promise.all(
            vendors.map((vendor) => attachVendorImage(vendor))
        );

        res.json({
            success: true,
            message: "Vendor API Working",
            count: result.length,
            vendors: result,
        });
    } catch (error) {
        console.error("Get Vendors Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch vendors",
        });
    }
};

// GET VENDOR BY ID
const getVendorById = async (req, res) => {
    try {
        const vendorId = Number(req.params.id);
        const vendor = vendors.find((item) => item.id === vendorId);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        const result = await attachVendorImage(vendor);

        res.json({
            success: true,
            vendor: result,
        });
    } catch (error) {
        console.error("Get Vendor Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch vendor",
        });
    }
};

module.exports = {
    getVendors,
    getVendorById,
};


module.exports = {
    getVendors,
    getVendorById
};