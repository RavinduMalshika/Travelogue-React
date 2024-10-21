import { useEffect, useState } from "react";
import DestinationCard from "../components/DestinationCard";
import Navbar from "../components/Navbar";
import apiClient from "../apiClient";
import { StarIcon } from "@heroicons/react/24/solid";

const Explore = () => {
    const [destinations, setDestinations] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [countryFilter, setCountryFilter] = useState("");
    const [keywordFilter, setKeywordFilter] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");

    useEffect(() => {
        apiClient.get('/destinations')
            .then(response => {
                setDestinations(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });

        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryNames = data.map(country => country.name.common);
                countryNames.sort((a, b) => a.localeCompare(b));
                setCountryList(countryNames);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    useEffect(() => {
        apiClient.get('/destinations', {
            params: {
                location: countryFilter,
                keyword: keywordFilter,
                rating: ratingFilter
            }
        })
            .then(response => {
                setDestinations(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, [countryFilter, ratingFilter]);

    useEffect(() => {
        apiClient.get('/destinations', {
            params: {
                location: countryFilter,
                keyword: keywordFilter
            }
        })
            .then(response => {
                setDestinations(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, [keywordFilter]);

    return (
        <div>
            <Navbar activeLink="explore" />

            <div className="flex flex-col lg:mx-10 m-5">
                <div className="flex flex-col md:flex-row rounded-xl bg-slate-100 border border-slate-600 justify-evenly">
                    <input 
                    className="md:w-1/4 rounded-xl m-3 py-2 px-3 border border-slate-600 text-center" 
                    type="search" 
                    placeholder="Search" 
                    value={keywordFilter}
                    onChange={(e) => setKeywordFilter(e.target.value)}
                    />

                    <select className="md:w-1/4 rounded-xl m-3 py-2 px-3 border border-slate-600 text-center" onChange={(e) => setCountryFilter(e.target.value)}>
                        <option value="">All Countries</option>
                        {countryList.map((country, index) => (
                            <option key={index} value={country}>{country}</option>
                        ))}
                    </select>

                    <select className="md:w-1/4 rounded-xl m-3 py-2 px-3 border border-slate-600 text-center" onChange={(e) => setRatingFilter(e.target.value)}>
                        <option value="">All Ratings</option>
                        <option value="2">2 and up</option>
                        <option value="3">3 and up</option>
                        <option value="4">4 and up</option>
                        <option value="5">5 only</option>
                    </select>
                </div>

                <div className="flex my-3">
                    {destinations.map((destination, index) => (
                        <DestinationCard key={index} id={destination.id} title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.images.length > 0 ? destination.images[0].image : ""} cost={destination.cost} location={destination.location} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Explore;