import DestinationCard from "../components/DestinationCard";
import Navbar from "../components/Navbar";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Link } from "react-router-dom";
import apiClient from "../apiClient";
import BannerLight from "../assets/topography.svg";
import { MapPinIcon } from "@heroicons/react/24/solid";

const Home = () => {
    const [destinations, setDestinations] = useState([]);
    const [localDestinations, setLocalDestinations] = useState([]);
    const [wishlist, setWishlist] = useState([]);

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

    useEffect(() => {
        if (user != null) {
            apiClient.get('/destinations', {
                params: {
                    location: user.location
                }
            })
                .then(response => {
                    setLocalDestinations(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the data!', error);
                });

            apiClient.get('/destinations/wishlist', {
                params: {
                    user_id: user.id
                }
            })
                .then(response => {
                    setWishlist(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the data!', error);
                });
        }
    }, [user])

    return (
        <div className="bg-canvas-light dark:bg-canvas-dark">
            <Navbar activeLink="home" />

            <div className="bg-banner-light dark:bg-banner-dark bg-comp-light dark:bg-comp-dark relative mx-5 md:mx-10 my-7 py-10 rounded-3xl font-semibold text-accent-dark dark:text-accent-light text-center text-xl md:text-3xl overflow-hidden">
                {/* <img className="absolute left-0 object-cover w-1/2" src={BannerLight} />
                <img className="absolute right-0 object-cover w-1/2" src={BannerLight} /> */}
                <p>Discover the World,</p>
                <p>One Destination at a Time</p>
            </div>

            <hr className="mx-5" />

            <div className="my-5">
                <div className="flex flex-row mx-5">
                    <MapPinIcon className="w-5 text-accent-dark dark:text-accent-light" />
                    <p className="text-xl text-accent-dark dark:text-accent-light grow">Explore Destinations</p>
                    <div className="flex flex-row align-middle text-black dark:text-white">
                        <Link to={'/explore/all'}>More</Link>
                        <ArrowRightIcon className="w-4 ms-1" />
                    </div>
                </div>

                <div className="flex flex-nowrap overflow-x-auto">
                    {destinations.map((destination, index) => (
                        <DestinationCard key={index} id={destination.id} title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.images.length > 0 ? destination.images[0].image : ""} cost={destination.cost} location={destination.location} />
                    ))}
                </div>
            </div>

            {localDestinations.length > 0 && <hr className="mx-5" />}

            {localDestinations.length > 0 &&
                <div className="my-5">
                    <div className="flex flex-row mx-5">
                    <MapPinIcon className="w-5 text-accent-dark dark:text-accent-light" />
                        <p className="text-xl text-accent-dark dark:text-accent-light grow">Local Destinations</p>
                        <div className="flex flex-row align-middle text-black dark:text-white">
                            <Link to={'/explore/local'}>More</Link>
                            <ArrowRightIcon className="w-4 ms-1" />
                        </div>
                    </div>

                    <div className="flex flex-nowrap overflow-x-auto">
                        {localDestinations.map((destination, index) => (
                            <DestinationCard key={index} id={destination.id} title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.images.length > 0 ? destination.images[0].image : ""} cost={destination.cost} location={destination.location} />
                        ))}
                    </div>
                </div>
            }

            {wishlist.length > 0 && <hr className="mx-5" />}

            {wishlist.length > 0 &&
                <div className="my-5">
                    <div className="flex flex-row mx-5">
                    <MapPinIcon className="w-5 text-accent-dark dark:text-accent-light" />
                        <p className="text-xl text-accent-dark dark:text-accent-light grow">Wishlist</p>
                        <div className="flex flex-row align-middle text-black dark:text-white">
                            <Link to={'/explore/wishlist'}>More</Link>
                            <ArrowRightIcon className="w-4 ms-1" />
                        </div>
                    </div>

                    <div className="flex flex-nowrap overflow-x-auto">
                        {wishlist.map((destination, index) => (
                            <DestinationCard key={index} id={destination.id} title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.images.length > 0 ? destination.images[0].image : ""} cost={destination.cost} location={destination.location} />
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}

export default Home;