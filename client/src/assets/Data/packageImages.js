
const imageModules = import.meta.glob(
    "../images/Packages/**/*.{jpg,jpeg,png,webp}",
    {
        eager: true,
        query: "?url",
        import: "default",
    }
);

const packageImages = {};

for (const [path, imageUrl] of Object.entries(imageModules)) {
    const parts = path.split("/");
    const category = parts[parts.length - 2];

    if (!packageImages[category]) {
        packageImages[category] = [];
    }

    packageImages[category].push(imageUrl);
}

const normalize = (value = "") =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getPackageImages = (category) => {
    const key = normalize(category);

    const folder = Object.keys(packageImages).find(
        (name) => normalize(name) === key
    );

    return folder ? packageImages[folder] : [];
};

export default packageImages;
