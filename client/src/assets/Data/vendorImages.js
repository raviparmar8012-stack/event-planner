const imageFiles = import.meta.glob(
    "../images/Vendors/**/*.jpg",
    {
        eager: true,
        query: "?url",
        import: "default"
    }
);

const getCategoryImages = (category) => {

    const categoryPaths = Object.entries(imageFiles)
        .filter(([path]) =>
            path.includes(`/Vendors/${category}/`)
        )
        .map(([, image]) => image);

    return categoryPaths;
};

const vendorImages = {

    Catering: getCategoryImages("Catering"),

    Decoration: getCategoryImages("Decoration"),

    "DJ & Music": getCategoryImages("DJ-Music"),

    Photography: getCategoryImages("Photography"),

    "Wedding Planner": getCategoryImages("Wedding-Planner"),

    "Event Management": getCategoryImages("Event-Management")

};

export default vendorImages;