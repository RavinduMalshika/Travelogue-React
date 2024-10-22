import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";
import { StarIcon, ExclamationCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Destination = () => {
    const apiKey = 'kkjkjk';
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [map, setMap] = useState("");
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        apiClient.get('/destinations', {
            params: {
                id: id
            }
        })
            .then(response => {
                setDestination(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, [])

    useEffect(() => {
        apiClient.get('/reviews', {
            params: {
                destination: id
            }
        })
            .then(response => {
                setReviews(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the reviews:', error);
            });

        apiClient.get('/maps', {
            params: {
                destination: id
            }
        })
            .then(response => {
                setMap(response.data.name);
            })
            .catch(error => {
                console.error('There was an error fetching the reviews:', error);
            });
    }, [destination])

    return (
        <div className="relative">
            <Navbar />

            {destination != null &&
                <div className="relative flex flex-col md:mx-10 m-5">
                    <div className="flex flex-col md:flex-row">
                        <div className="basis-2/3 bg-slate m-3 rounded-xl border border-slate-600">
                            <div className="flex flex-row m-3">
                                <p className="grow text-xl font-semibold">{destination.name}</p>

                                <div className="flex flex-row text-sm hover:text-red-600 cursor-pointer">
                                    <ExclamationCircleIcon className="w-5 text-yellow-600" />
                                    <p className="my-auto">Report</p>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <p className="m-3 text-lg font-semibold grow">{destination.location}</p>
                                <p className="m-3 text-lg font-semibold">{destination.destination_type}</p>
                            </div>
                            <img className="w-full aspect-4/3 object-cover" src={destination.images[0].image} />
                            <div className="flex flex-row">
                                <p className="m-3 text-lg font-semibold grow">{destination.cost}</p>
                                <p className="m-3 text-lg font-semibold">{destination.rating}</p>
                            </div>
                            <p className="m-3">{destination.description}</p>
                        </div>

                        <div className="flex flex-col basis-1/3 bg-slate rounded-xl m-3 border border-slate-600 overflow-hidden  min-h-80">
                            <p className="m-3 text-lg font-semibold">Location</p>

                            <iframe
                                className="w-full h-full grow"
                                loading="lazy"
                                allowfullscreen
                                referrerpolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${map}`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col bg-slate m-3 rounded-xl border border-slate-600">
                        <p className="m-3 text-xl font-semibold">Reviews</p>
                        {reviews.map(review => (
                            <div className="flex flex-col md:flex-row bg-slate-200 m-3 p-3 rounded-xl gap-3">
                                <div className="flex flex-col">
                                    <img className="size-12 lg:size-14 object-cover rounded-full" src={review.user_profile.image} />

                                    <div className="flex flex-col w-28">
                                        <p className="font-semibold truncate">{review.user_profile.user.username}</p>
                                        <div className="flex flex-row">
                                            <StarIcon className={review.rating >= 1 ? "w-5 fill-yellow-400 text-yellow-600" : "w-5 text-yellow-500"} />
                                            <StarIcon className={review.rating >= 2 ? "w-5 fill-yellow-400 text-yellow-600" : "w-5 text-yellow-500"} />
                                            <StarIcon className={review.rating >= 3 ? "w-5 fill-yellow-400 text-yellow-600" : "w-5 text-yellow-500"} />
                                            <StarIcon className={review.rating >= 4 ? "w-5 fill-yellow-400 text-yellow-600" : "w-5 text-yellow-500"} />
                                            <StarIcon className={review.rating >= 5 ? "w-5 fill-yellow-400 text-yellow-600" : "w-5 text-yellow-500"} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grow bg-white rounded-xl p-3">
                                    <p>{review.review_text} fdgfdgfdgdf gfdgfdg dfg dfg dfdfg fdgf dfg dfg dfg dfgdfgfdgfd dfgdfg fdg fdgfdg fdgfdgfdgdf gfdgfdg dfg dfg dfdfg fdgf dfg dfg dfg dfgdfgfdgfd dfgdfg fdg fdgfdg fdgfdgfdgdf gfdgfdg dfg dfg dfdfg fdgf dfg dfg dfg dfgdfgfdgfd dfgdfg fdg fdgfdg fdgfdgfdgdf gfdgfdg dfg dfg dfdfg fdgf dfg dfg dfg dfgdfgfdgfd dfgdfg fdg fdgfdg </p>
                                </div>
                            </div>
                        ))}
                    </div>



                    <div className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center h-screen w-3/4">
                        <div className="flex flex-col gap-3 bg-red-100 rounded-xl p-5 w-full">
                            <div className="flex flex-row">
                            <p className="grow text-xl font-semibold">Report Destination</p>
                            <XMarkIcon className="w-8 hover:text-red-600" />
                            </div>
                            <textarea className="rounded-xl py-2 px-3 text-start border border-slate-600 w-full" placeholder="Reason for reporting..." rows={3}/>
                            <button className="bg-red-500 rounded-xl w-fit ms-auto py-2 px-3">Report</button>
                        </div>
                    </div>
                </div>
            }

            <div className="absolute left-0 z-10 top-0 bg-black opacity-50 w-screen h-full">
            </div>
        </div>
    );
}

export default Destination;