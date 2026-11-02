import "../styles/vendorCard.css";
import {Link} from "react-router-dom";

function VendorCard({
                        id,
                        name,
                        category,
                        rating,
                        location,
                        price,
                    }) {
    return (
        <div className="vendor-card">

            <img
                src="https://placehold.co/400x250"
                alt={name}
                className="vendor-image"
            />

            <div className="vendor-content">

                <h3>{name}</h3>

                <p className="category">{category}</p>

                <p>⭐ {rating}</p>

                <p>📍 {location}</p>

                <h4>{price}</h4>

                <Link to={`/vendors/${id}`}>
                    View Details
                </Link>



            </div>

        </div>
    );
}

export default VendorCard;