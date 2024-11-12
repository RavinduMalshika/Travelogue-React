import { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";
import { StarIcon, ExclamationCircleIcon, XMarkIcon, MapPinIcon, SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon, PaperAirplaneIcon, MapPinIcon as SolidMpPinIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { AppContext } from "../AppContext";
import Toast from "../components/Toast";


const Destination = () => {
    const { user } = useContext(AppContext);
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const { id } = useParams();

    const scrollRef = useRef(null);

    const [destination, setDestination] = useState(null);
    const [map, setMap] = useState("");
    const [reviews, setReviews] = useState([]);
    const [isReporting, setIsReporting] = useState(false);
    const [report, setReport] = useState("");
    const [visited, setVisited] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [reviewSort, setReviewSort] = useState("old");
    const [reviewFilter, setReviewFilter] = useState("all");
    const [isToastHidden, setIsToastHidden] = useState(true);
    const [isToastSuccess, setIsToastSuccess] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        getDestination();
    }, [])

    useEffect(() => {
        if (user != null) {
            if (user.visited_places.includes(parseInt(id))) {
                setVisited(true);
            }

            if (user.wishlist.includes(parseInt(id))) {
                console.log("wishlisted");
                setWishlisted(true);
            }
        }
    }, [user])

    useEffect(() => {
        getReviews();
        getMap();
    }, [destination])

    useEffect(() => {
        if (reviews.length > 0) {
            let displayReviews;

            switch (reviewFilter) {
                case "all":
                    displayReviews = [...reviews];
                    break;

                case "5":
                    displayReviews = [...reviews].filter(review => review.rating === 5);
                    break;

                case "4":
                    displayReviews = [...reviews].filter(review => review.rating === 4);
                    break;

                case "3":
                    displayReviews = [...reviews].filter(review => review.rating === 3);
                    break;

                case "2":
                    displayReviews = [...reviews].filter(review => review.rating === 2);
                    break;

                case "1":
                    displayReviews = [...reviews].filter(review => review.rating === 1);
                    break;

                default:
                    break;
            }

            switch (reviewSort) {
                case "old":
                    displayReviews = displayReviews.sort((a, b) => a.id - b.id);
                    setFilteredReviews(displayReviews);
                    break;

                case "new":
                    displayReviews = displayReviews.sort((a, b) => b.id - a.id);
                    setFilteredReviews(displayReviews);
                    break;

                default:
                    break;
            }
        }
    }, [reviewSort, reviewFilter])

    const getDestination = () => {
        apiClient.get('/destinations', {
            params: {
                id: id
            }
        })
            .then(response => {
                setDestination(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }

    const getReviews = () => {
        apiClient.get('reviews', {
            params: {
                destination: id
            }
        })
            .then(response => {
                setReviews(response.data.sort((a, b) => a.id - b.id));
                setFilteredReviews(response.data.sort((a, b) => a.id - b.id));
            })
            .catch(error => {
                console.error('There was an error fetching the reviews:', error);
            });
    }

    const getMap = () => {
        apiClient.get('maps', {
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
    }

    const handleReport = () => {
        apiClient.post('reports/create', {
            destination: destination.id,
            reason: report
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('There was an error submitting report:', error);
            });
    }

    const addVisitedPlace = () => {
        apiClient.post('users/add-visited-place', {
            destination: destination.id
        })
            .then(response => {
                console.log(response);
                setVisited(true);
            })
            .catch(error => {
                console.error('There was an error adding as a visited place:', error);
            });
    }

    const removeVisitedPlace = () => {
        apiClient.post('users/remove-visited-place', {
            destination: destination.id
        })
            .then(response => {
                console.log(response);
                setVisited(false);
            })
            .catch(error => {
                console.error('There was an error removing visited place:', error);
            });
    }

    const addToWishlist = () => {
        apiClient.post('users/add-to-wishlist', {
            destination: destination.id
        })
            .then(response => {
                console.log(response);
                setWishlisted(true);
            })
            .catch(error => {
                console.error('There was an error adding as to wishlist:', error);
            });
    }

    const removeFromWishlist = () => {
        apiClient.post('users/remove-from-wishlist', {
            destination: destination.id
        })
            .then(response => {
                console.log(response);
                setWishlisted(false);
            })
            .catch(error => {
                console.error('There was an error removing from wishlist:', error);
            });
    }

    const handleRatingHoverIn = (event) => {
        let selectedStar = event.target.id;
        let stars = document.getElementsByClassName("rating");
        let starsArray = Array.from(stars);
        starsArray.forEach(star => {
            if (star.id <= selectedStar) {
                if (!stars.item(star.id - 1).classList.contains("text-yellow-500")) {
                    stars.item(star.id - 1).classList.add("text-yellow-500");
                }
                if (!stars.item(star.id - 1).classList.contains("fill-yellow-100")) {
                    stars.item(star.id - 1).classList.add("fill-yellow-100");
                }
            }
        });

    }

    const handleRatingHoverOut = (event) => {
        let selectedStar = event.target.id;
        let stars = document.getElementsByClassName("rating");
        let starsArray = Array.from(stars);
        starsArray.forEach(star => {
            if (star.id <= selectedStar) {
                if (stars.item(star.id - 1).classList.contains("text-yellow-500")) {
                    stars.item(star.id - 1).classList.remove("text-yellow-500");
                }
                if (stars.item(star.id - 1).classList.contains("fill-yellow-100")) {
                    stars.item(star.id - 1).classList.remove("fill-yellow-100");
                }
            }
        });


    }

    const handleRating = (selectedStar) => {
        setRating(selectedStar);

        let stars = document.getElementsByClassName("rating");
        let starsArray = Array.from(stars);
        starsArray.forEach(star => {
            if (star.id <= selectedStar) {
                if (!stars.item(star.id - 1).classList.contains("text-yellow-600")) {
                    stars.item(star.id - 1).classList.add("text-yellow-600");
                }
                if (!stars.item(star.id - 1).classList.contains("fill-yellow-400")) {
                    stars.item(star.id - 1).classList.add("fill-yellow-400");
                }
            } else {
                if (stars.item(star.id - 1).classList.contains("text-yellow-600")) {
                    stars.item(star.id - 1).classList.remove("text-yellow-600");
                }
                if (stars.item(star.id - 1).classList.contains("fill-yellow-400")) {
                    stars.item(star.id - 1).classList.remove("fill-yellow-400");
                }
            }
        });
    }

    const handleReview = () => {
        if (rating > 0 && review !== "") {
            apiClient.post('reviews/add', {
                user_id: user.id,
                destination_id: destination.id,
                review_text: review,
                rating: rating
            })
                .then(response => {
                    if (response.status === 200) {
                        getReviews();
                        setReview("");
                        handleRating(0);
                        getDestination();
                        console.log("Review submitted successfully");
                    }
                })
                .catch(error => {
                    console.error("Error when submiting review: ", error);
                });
        } else if (rating === 0) {
            setToast(false, "Please set a rating before submitting your review.");
        } else {
            setToast(false, "Please type your thoughts on the destination before submitting your review.");
        }
    }

    const deleteReview = (reviewId) => {
        apiClient.delete("reviews/delete", {
            params: {
                id: reviewId,
                destination_id: destination.id
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("Review deleted successfully");
                    getDestination();
                    getReviews();
                }
            })
            .catch(error => {
                console.error("Error when deleting review: ", error);
            });
    }

    const handleScrollRight = () => {
        console.log("scroll right");
        let width = document.getElementById("image-container").offsetWidth;
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollLeft + width,
                behavior: 'smooth'
            });
        }
    }

    const handleScrollLeft = () => {
        console.log("scroll left");
        let width = document.getElementById("image-container").offsetWidth;
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollLeft - width,
                behavior: 'smooth'
            });
        }
    }

    const setToast = (isSuccess, message) => {
        setIsToastHidden(false);
        setIsToastSuccess(isSuccess);
        setToastMessage(message);

        setTimeout(() => {
            setIsToastHidden(true);
        }, 1500);
    }

    return (
        <div className="relative">
            <Navbar />

            {destination != null &&
                <div className="relative flex flex-col md:px-10 p-5 text-black dark:text-white">
                    <div className="flex flex-col md:flex-row">
                        <div className="basis-2/3 bg-slate-100 dark:bg-slate-950 m-3 rounded-xl border border-slate-600">
                            <div className="flex flex-row gap-3 m-3">
                                <p className="grow text-2xl font-semibold">{destination.name}</p>
                                {user != null &&
                                    <div className="flex flex-row gap-3">

                                        {visited &&
                                            <button
                                                className="flex flex-row bg-green-100 dark:bg-green-900 hover:bg-green-200 hover:text-green-600 border border-green-300 text-sm rounded-full w-fit ms-auto py-2 px-3"
                                                onClick={removeVisitedPlace}
                                            ><SolidMpPinIcon className="w-5 me-1 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />Visited</button>
                                        }

                                        {!visited &&
                                            <div className="flex flex-row gap-3">
                                                {wishlisted &&
                                                    <button
                                                        className="bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 hover:text-yellow-600 border border-yellow-300 text-sm rounded-full w-fit ms-auto py-2 px-3"
                                                        onClick={removeFromWishlist}
                                                    ><SparklesIcon className="w-5 text-yellow-600 fill-yellow-600 dark:text-yellow-400 dark:fill-yellow-400" /></button>
                                                }

                                                {!wishlisted &&
                                                    <button
                                                        className="flex flex-row bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 hover:text-amber-600 border border-amber-300 text-sm rounded-full w-fit ms-auto py-2 px-3"
                                                        onClick={addToWishlist}
                                                    ><SparklesIcon className="w-5 me-1" />Add to Wishlist</button>
                                                }

                                                <button
                                                    className="flex flex-row bg-blue-100 hover:bg-secondary-light dark:bg-secondary-dark hover:text-blue-600 border border-blue-300 text-sm rounded-full w-fit ms-auto py-2 px-3"
                                                    onClick={addVisitedPlace}
                                                ><MapPinIcon className="w-5 me-1" />Mark as Visited</button>
                                            </div>
                                        }

                                        <div
                                            className="flex flex-row text-sm hover:text-red-600 cursor-pointer bg-red-100 dark:bg-red-900 hover:bg-red-200 p-2 rounded-full border border-red-300"
                                            onClick={() => setIsReporting(true)}
                                        >
                                            <ExclamationCircleIcon className="w-5 text-yellow-600 dark:text-yellow-400 me-1" />
                                            <p className="my-auto">Report</p>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="flex flex-row">
                                <p className="m-3 text-lg font-semibold grow">{destination.location}</p>
                                <p className="m-3 text-lg font-semibold">{destination.destination_type}</p>
                            </div>
                            <div className="relative text-transparent hover:text-slate-600">
                                <div id="image-container" className="flex flex-row overflow-hidden" ref={scrollRef}>
                                    {destination.images.map(image => (
                                        <img className="w-full aspect-4/3 object-cover" src={image.image} />
                                    ))}
                                </div>
                                <ChevronLeftIcon className="absolute left-0 top-1/2 w-20 cursor-pointer" onClick={handleScrollLeft} />
                                <ChevronRightIcon className="absolute right-0 top-1/2 w-20 cursor-pointer" onClick={handleScrollRight} />
                            </div>
                            <div className="flex flex-row">
                                <p className="m-3 text-lg text-red-600 font-semibold grow">{destination.cost}</p>
                                <p className="flex bg-comp-light dark:bg-comp-dark text-black dark:text-white px-2 py-1 rounded-2xl font-semibold w-fit my-auto me-3"><StarIcon className="w-5 text-yellow-600 fill-yellow-400" /> : {destination.rating.toFixed(1)} / 5.0</p>
                            </div>
                            <p className="m-3">{destination.description}</p>
                        </div>

                        <div className="flex flex-col basis-1/3 bg-slate-100 dark:bg-slate-950 rounded-xl m-3 border border-slate-600 overflow-hidden min-h-80">
                            <p className="m-3 text-lg font-semibold">Location</p>

                            <iframe
                                className="w-full h-full grow"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${map}`}
                            />
                        </div>
                    </div>

                    {visited && user !== null &&
                        <div className="flex flex-col bg-slate-100 dark:bg-slate-950 m-3 rounded-xl border border-slate-600">
                            <p className="m-3 text-xl font-semibold">My Notes</p>
                            <textarea
                                className="rounded-xl p-3 m-3 dark:bg-gray-800"
                                rows={4}
                                placeholder="Add your notes on the detination. This is only visible for you..."
                            />
                        </div>
                    }

                    <div className="flex flex-col bg-slate-100 dark:bg-slate-950 m-3 rounded-xl border border-slate-600">
                        <div className="flex flex-row">
                            <p className="grow m-3 text-xl font-semibold">Reviews {review}</p>
                            <select className="bg-transparent m-3" onChange={(e) => setReviewSort(e.target.value)}>
                                <option value={"old"} selected>Oldest First</option>
                                <option value={"new"}>Newest First</option>
                            </select>
                            <select className="bg-transparent m-3" onChange={(e) => setReviewFilter(e.target.value)}>
                                <option value={"all"} selected>All Ratings</option>
                                <option value={"5"}>5 Star</option>
                                <option value={"4"}>4 Star</option>
                                <option value={"3"}>3 Star</option>
                                <option value={"2"}>2 Star</option>
                                <option value={"1"}>1 Star</option>
                            </select>
                        </div>

                        {visited && user !== null &&
                            <div className="flex flex-col md:flex-row bg-slate-300 dark:bg-slate-600 m-3 p-3 rounded-xl gap-3">
                                <div className="flex flex-col">
                                    {user.image !== null &&
                                        <img className="size-12 lg:size-14 object-cover rounded-full" src={user.image} />
                                    }

                                    {user.image === null &&
                                        <UserCircleIcon className="w-12" />
                                    }

                                    <div className="flex flex-col w-28">
                                        <p className="font-semibold truncate">{user.username}</p>
                                        <div className="flex flex-row">
                                            <StarIcon
                                                className="rating w-5 cursor-pointer"
                                                id="1"
                                                onMouseOver={handleRatingHoverIn}
                                                onMouseLeave={handleRatingHoverOut}
                                                onClick={() => handleRating(1)}
                                            />
                                            <StarIcon
                                                className="rating w-5 cursor-pointer"
                                                id="2"
                                                onMouseOver={handleRatingHoverIn}
                                                onMouseLeave={handleRatingHoverOut}
                                                onClick={() => handleRating(2)}
                                            />
                                            <StarIcon
                                                className="rating w-5 cursor-pointer"
                                                id="3"
                                                onMouseOver={handleRatingHoverIn}
                                                onMouseLeave={handleRatingHoverOut}
                                                onClick={() => handleRating(3)}
                                            />
                                            <StarIcon
                                                className="rating w-5 cursor-pointer"
                                                id="4"
                                                onMouseOver={handleRatingHoverIn}
                                                onMouseLeave={handleRatingHoverOut}
                                                onClick={() => handleRating(4)}
                                            />
                                            <StarIcon
                                                className="rating w-5 cursor-pointer"
                                                id="5"
                                                onMouseOver={handleRatingHoverIn}
                                                onMouseLeave={handleRatingHoverOut}
                                                onClick={() => handleRating(5)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grow flex flex-row gap-3">
                                    <textarea
                                        className="grow rounded-xl p-3 dark:bg-gray-800"
                                        rows={2}
                                        value={review}
                                        placeholder="Write a review..."
                                        onChange={(e) => setReview(e.target.value)}
                                    />

                                    <PaperAirplaneIcon className="w-8 fill-lime-500 mt-auto mb-1 cursor-pointer" onClick={handleReview} />
                                </div>
                            </div>
                        }

                        {filteredReviews.map(review => (
                            <div className="flex flex-col md:flex-row bg-slate-300 dark:bg-slate-600 m-3 p-3 rounded-xl gap-3">
                                <div className="flex flex-col">
                                    {review.user_profile.image !== null &&
                                        <img className="size-12 lg:size-14 object-cover rounded-full" src={review.user_profile.image} />
                                    }

                                    {review.user_profile.image === null &&
                                        <UserCircleIcon className="w-12" />
                                    }

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

                                <div className="grow bg-comp-light dark:bg-comp-dark rounded-xl p-3">
                                    <p>{review.review_text}</p>
                                </div>

                                {user !== null && review.user_profile.user.id == user.id && reviews.length > 1 &&
                                    <TrashIcon
                                        className="w-8 mb-1 mt-auto text-red-400 hover:fill-red-400 hover:text-red-600 cursor-pointer"
                                        onClick={() => deleteReview(review.id)}
                                    />
                                }
                            </div>
                        ))}
                    </div>



                    <div className={isReporting ?
                        "absolute left-1/2 -translate-x-1/2 z-20 flex items-center h-screen w-3/4" :
                        "absolute left-1/2 -translate-x-1/2 z-20 flex items-center h-screen w-3/4 hidden"}
                    >
                        <div className="flex flex-col gap-3 bg-red-100 dark:bg-warning-dark rounded-xl p-5 w-full">
                            <div className="flex flex-row">
                                <p className="grow text-xl font-semibold">Report Destination</p>
                                <XMarkIcon className="w-8 hover:text-red-600" onClick={() => setIsReporting(false)} />
                            </div>
                            <textarea
                                className="rounded-xl py-2 px-3 text-start border border-slate-600 w-full"
                                placeholder="Reason for reporting..."
                                rows={3}
                                value={report}
                                onChange={(e) => setReport(e.target.value)}
                            />
                            <button className="bg-red-500 rounded-xl w-fit ms-auto py-2 px-3" onClick={handleReport}>Report</button>
                        </div>
                    </div>
                </div>
            }

            <div className={isReporting ?
                "absolute left-0 z-10 top-0 bg-black opacity-50 w-screen h-screen" :
                "absolute left-0 z-10 top-0 bg-black opacity-50 w-screen h-full hidden"}
            >
            </div>

            <Toast isHidden={isToastHidden} isSuccess={isToastSuccess} message={toastMessage} />
        </div>
    );
}

export default Destination;