import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { PhotoIcon, PlusIcon } from "@heroicons/react/24/solid";
import { TrashIcon, StarIcon } from "@heroicons/react/24/outline";
import apiClient from "../apiClient";
import { AppContext } from "../AppContext";

const AddDestination = () => {
    const { user } = useContext(AppContext);

    const [name, setName] = useState("");
    const [countryList, setCountryList] = useState([]);
    const [country, setCountry] = useState("");
    const [map, setMap] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [costLower, setCostLower] = useState("");
    const [costUpper, setCostUpper] = useState("");
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState("");

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryNames = data.map(country => country.name.common);
                countryNames.sort((a, b) => a.localeCompare(b));
                setCountryList(countryNames);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, [])

    const handleUpload = () => {
        document.getElementById("insertImage").click();
    }

    const handleInsertImage = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedImages(prevFiles => [...prevFiles, file]);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prevImages => [...prevImages, reader.result]);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleRemoveImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
        setSelectedImages(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        let cost = `$${costLower} - $${costUpper}`;

        const formData = new FormData();
        formData.append('user', user.id);
        formData.append('name', name);
        formData.append('country', country);
        formData.append('map', map)
        formData.append('destination_type', type);
        formData.append('description', description);
        formData.append('cost', cost);
        selectedImages.forEach(image => {
            formData.append('images', image);
        })
        formData.append('images', selectedImages);
        formData.append('rating', rating);
        formData.append('review', review);
        // try {
        //     const response = await apiClient.post("/destinations/create", formData);
        // } catch (error) {
        //     console.error("Error occured when saving destination: " + error);
        // }
    }

    return (
        <div>
            <Navbar />

            <div className="md:w-3/4 my-5 md:mx-auto mx-3 bg-slate-100 rounded-xl border-2">
                <form className="flex flex-col gap-5 m-5" onSubmit={handleSubmit}>
                    <p className="text-center text-xl">Add a Destination</p>

                    <input
                        className="rounded-xl py-2 px-3 text-center border border-slate-600"
                        placeholder="Name"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="flex flex-col md:flex-row gap-3">
                        <select className="basis-1/2 rounded-xl py-2 px-3 text-center border border-slate-600" onChange={(e) => setType(e.target.value)}>
                            <option value="" hidden>Type</option>
                            <option value="Destination">Destination</option>
                            <option value="Hiking">Hiking</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Tour">Tour</option>
                        </select>

                        <select className="basis-1/2 grow rounded-xl py-2 px-3 text-center border border-slate-600" onChange={(e) => setCountry(e.target.value)}>
                            <option value="" hidden>Country</option>
                            {countryList.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    <input
                        className="rounded-xl py-2 px-3 text-center border border-slate-600"
                        placeholder="Google Maps Location"
                        type="text"
                        onChange={(e) => setMap(e.target.value)}
                    />



                    <textarea
                        className="rounded-xl py-2 px-3 text-center border border-slate-600"
                        rows={3}
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="flex flex-row gap-2 min-w-0">
                        <p className="my-auto">Cost:</p>
                        <input
                            className="grow w-2/6 rounded-xl py-2 px-3 text-center border border-slate-600"
                            placeholder="From ($)"
                            type="text" onChange={(e) => setCostLower(e.target.value)}
                        />
                        <p className="my-auto">-</p>
                        <input
                            className="grow w-2/6 rounded-xl py-2 px-3 text-center border border-slate-600"
                            placeholder="To ($)"
                            type="text" onChange={(e) => setCostUpper(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row overflow-auto w-full">
                        {images.map((image, index) => (
                            <div className="relative rounded-xl flex-shrink-0 m-5">
                                <img className="object-cover w-40 md:w-60 aspect-4/3 rounded-xl overflow-hidden" src={image} key={index} />
                                <TrashIcon
                                    className="absolute right-0 top-0 w-8 text-red-600 hover:scale-125 hover:text-red-500 bg-red-100 rounded-lg p-1"
                                    role="button"
                                    onClick={() => handleRemoveImage(index)}
                                />
                            </div>
                        ))}

                        {images.length < 5 &&
                            <div
                                className="relative m-5 w-40 md:w-60 aspect-4/3 bg-slate-200 place-content-center rounded-xl flex-shrink-0 text-center"
                                onClick={handleUpload}
                            >
                                <PhotoIcon className="w-20 mx-auto" />
                                <p>Can add a max of 5 images.</p>
                                <div className="absolute top-0 z-10 opacity-0 hover:opacity-50 bg-green-200 w-full h-full place-content-center rounded-xl">
                                    <PlusIcon className="w-20 mx-auto text-green-600" />
                                </div>
                            </div>
                        }
                    </div>
                    <input
                        className="hidden"
                        id="insertImage"
                        type="file"
                        onChange={handleInsertImage}
                    />

                    <div className="flex flex-row">
                        <StarIcon
                            className="rating w-10 cursor-pointer p-1"
                            id="1"
                            onMouseOver={handleRatingHoverIn}
                            onMouseLeave={handleRatingHoverOut}
                            onClick={() => handleRating(1)}
                        />
                        <StarIcon
                            className="rating w-10 cursor-pointer p-1"
                            id="2"
                            onMouseOver={handleRatingHoverIn}
                            onMouseLeave={handleRatingHoverOut}
                            onClick={() => handleRating(2)}
                        />
                        <StarIcon
                            className="rating w-10 cursor-pointer p-1"
                            id="3"
                            onMouseOver={handleRatingHoverIn}
                            onMouseLeave={handleRatingHoverOut}
                            onClick={() => handleRating(3)}
                        />
                        <StarIcon
                            className="rating w-10 cursor-pointer p-1"
                            id="4"
                            onMouseOver={handleRatingHoverIn}
                            onMouseLeave={handleRatingHoverOut}
                            onClick={() => handleRating(4)}
                        />
                        <StarIcon
                            className="rating w-10 cursor-pointer p-1"
                            id="5"
                            onMouseOver={handleRatingHoverIn}
                            onMouseLeave={handleRatingHoverOut}
                            onClick={() => handleRating(5)}
                        />
                    </div>

                    <textarea
                        className="rounded-xl py-2 px-3 text-center border border-slate-600"
                        rows={3}
                        placeholder="Review"
                        onChange={(e) => setReview(e.target.value)}
                    />

                    <button className="bg-lime-500 rounded-xl w-fit ms-auto my-3 py-2 px-3" type="submit">Save Destination</button>
                </form>
            </div>
        </div>
    );
}

export default AddDestination;