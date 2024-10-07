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
        if (localStorage.getItem("access_token") != null) {
            getUser();
        }

        apiClient.get('/destinations')
            .then(response => {
                setDestinations(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, [])

    const getUser = async () => {
        const token = localStorage.getItem('access_token');
        console.log("access:" + token)
        console.log("refresh:" + localStorage.getItem('refresh_token'))

        try {
            const response = await apiClient.get('/users/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Check if the request was unauthorized
            if (response.status === 401) {
                throw new Error('Unauthorized: Token might be expired or invalid');
            }

            // Axios automatically parses JSON
            const userData = response.data;
            setUser(userData);  // Update state with user data
        } catch (error) {
            // Handle specific error cases
            if (error.response) {
                // Server responded with a status code that falls out of the range of 2xx
                console.error('Error fetching user data:', error.response.data);
                if (error.response.status === 401) {
                    console.error('Unauthorized: Token might be expired or invalid');
                    // Handle unauthorized access, maybe redirect to login or show a message
                }
            } else {
                // Network error or other issues
                console.error('Error fetching user data:', error.message);
            }
            setUser(null);
        }
    }

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
                    {/* <DestinationCard title="Harry Potter Warner Bros Studio Tour" cost="$70 - $350" rating="4.0" description="Experience the magic of Harry Potter™ at Warner Bros. Studio with round-trip transfers from London – a perfect day trip for Potterheads of all ages!" type="Tour" image={img1} />
                    <DestinationCard image={img2} />
                    <DestinationCard image={img3} />
                    <DestinationCard image={img4} />
                    <DestinationCard image={img5} />
                    <DestinationCard image={img6} />
                    <DestinationCard image={img7} />
                    <DestinationCard image={img8} /> */}
                    {destinations.map(destination => (
                        <DestinationCard title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.image} cost={destination.cost} location={destination.location} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;