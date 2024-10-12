import DestinationCard from "../components/DestinationCard";
import Navbar from "../components/Navbar";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Link } from "react-router-dom";
import apiClient from "../apiClient";

const Home = () => {
    const [destinations, setDestinations] = useState([]);

    const { user } = useContext(AppContext);
    const { setUser } = useContext(AppContext);

    useEffect(() => {
        apiClient.get('/destinations')
            .then(response => {
                setDestinations(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div>
            <Navbar activeLink="home" />

            <div className="mx-5 md:mx-10 my-7 py-10 bg-lime-200 rounded-3xl text-center text-xl md:text-3xl">
                <p>Discover the World,</p>
                <p>One Destination at a Time</p>
            </div>

            <div>
                <div className="flex flex-row mx-5">
                    <p className="text-xl grow">Explore Destinations</p>
                    <div className="flex flex-row align-middle">
                        <Link to={'/explore'}>More</Link>
                        <ArrowRightIcon className="w-4 ms-1" />
                    </div>
                </div>
                <div className="flex flex-nowrap overflow-x-auto">
                    {destinations.map(destination => (
                        <DestinationCard title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.image} cost={destination.cost} location={destination.location} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;