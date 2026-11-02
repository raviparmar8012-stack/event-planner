import "../styles/packageCard.css";

function PackageCard({
    title,
    image,
    price,
    rating,
    guests,
    duration,
    location,
    includes,
}){
    return (
        <div className="package-card">

            <img
                src={image}
                alt={title}
                className="package-image"
            />

            <div className="package-content">

                <h3>{title}</h3>

                <p>⭐ {rating}</p>

                <p>👥 {guests}</p>

                <p>📅 {duration}</p>

                <p>📍 {Location}</p>

                <div className="package-includes">
                    {includes.map((item, index) => (
                        <p key={index}>✔ {item}</p>
                    ))}
                </div>
                <h4>{price}</h4>


               <div className="package-buttons">
                   <button className="detail-btn">
                       View Detail
                   </button>

                   <button className="package-btn">
                       Book Now
                   </button>
               </div>

            </div>

        </div>
    );
}
export default PackageCard;