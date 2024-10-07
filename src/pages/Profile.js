import { useContext } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../AppContext";
import DestinationCard from "../components/DestinationCard";

const Profile = () => {
    const { user } = useContext(AppContext);

    return (
        <div>
            <Navbar />

            <p>Welcome {user.username},</p>

            {user.visited_places.size > 0 &&
                <div>
                    <p>Visited Places</p>
                    {user.visited_places.map(destination => (
                        <DestinationCard title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.image} cost={destination.cost} location={destination.location} />
                    ))}
                </div>
            }

        </div>
    );
}

export default Profile;