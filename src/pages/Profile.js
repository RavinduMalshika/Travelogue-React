import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../AppContext";
import DestinationCard from "../components/DestinationCard";
import { PencilSquareIcon, CheckIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import Toast from "../components/Toast";

const Profile = () => {
    const { user } = useContext(AppContext);
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [selectedImage, setSelectedImage] = useState("keep");
    const [profilePicture, setProfilePicture] = useState("");
    const [username, setUsername] = useState(user != null ? user.username : "");
    const [country, setCountry] = useState(user != null ? user.location : "");
    const [firstName, setFirstName] = useState(user != null ? user.firstName : "");
    const [lastName, setLastName] = useState(user != null ? user.lastName : "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [visitedPlaces, setVisitedPlaces] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [isToastHidden, setIsToastHidden] = useState(true);
    const [isToastSuccess, setIsToastSuccess] = useState(true);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        if (user === null) {
            navigate("/");
        }

        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryNames = data.map(country => country.name.common);
                countryNames.sort((a, b) => a.localeCompare(b));
                setCountryList(countryNames);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, [])

    useEffect(() => {
        setProfilePicture(user != null ? user.image : "");
        setUsername(user != null ? user.username : "");
        setCountry(user != null ? user.location : "");
        setFirstName(user != null ? user.firstName : "");
        setLastName(user != null ? user.lastName : "");
        setSelectedImage(user != null ? user.image : "keep");

        console.log(user);

        if (user != null) {
            apiClient.get('/destinations/visited-places', {
                params: {
                    user_id: user.id
                }
            })
                .then(response => {
                    console.log(response.data);
                    setVisitedPlaces(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the visited places!', error);
                });

            apiClient.get('/destinations/wishlist', {
                params: {
                    user_id: user.id
                }
            })
                .then(response => {
                    console.log(response.data);
                    setWishlist(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the visited places!', error);
                });
        }
    }, [user])

    const toggleEditing = () => {
        setIsEditing(!isEditing);
        setProfilePicture(user.image);
        setUsername(user.username);
        setCountry(user.location);
        setFirstName(user.firstName);
        setLastName(user.lastName);
    }

    const handleEdit = async () => {
        const toast = document.getElementById('toast');

        try {
            const formData = new FormData();
            formData.append('id', user.id);
            formData.append('username', username);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('location', country);
            formData.append('image', selectedImage);

            const response = await apiClient.post('/users/edit', formData);

            setIsEditing(false);
            getUser();

            setToast(true, "Details updated successfully")
        } catch (error) {
            console.error('Error during edit:', error);
            if (error.response.data.error === "username") {

                setToast(false, "Username already exists.");
            }
            else {
                setToast("Error. Could not edit Profile Details.");
            }
        }
    }

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

            if (response.status === 401) {
                throw new Error('Unauthorized: Token might be expired or invalid');
            }

            const userData = response.data;
            setUser(userData);
        } catch (error) {
            if (error.response) {
                console.error('Error fetching user data:', error.response.data);
                if (error.response.status === 401) {
                    console.error('Unauthorized: Token might be expired or invalid');
                }
            } else {
                console.error('Error fetching user data:', error.message);
            }
            setUser(null);
        }
    }

    const handleUpload = () => {
        document.getElementById("profile-picture").click();
    }

    const handleProfilePicture = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const removeProfilePicture = () => {
        setProfilePicture("");
        setSelectedImage("");
    }

    const handleChangePassword = async (event) => {
        event.preventDefault();
        const toast = document.getElementById('toast');

        try {
            const response = await apiClient.post('/users/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setToast(true, "Password Updated Successfully.")
        } catch (error) {
            switch (error.response.data.error) {
                case "current_password":
                    setToast(false, "Incorrect Password Entered.");
                    break;

                case "new_password":
                    setToast(false, "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.");
                    break;

                case "confirm_password":
                    setToast(false, "New password and the Confirmation password does not match.");
                    break;

                default:
                    setToast(false, "Error occured when changing password.");
                    break;
            }
            console.error("Password Change Failed: " + error);
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();
        const toast = document.getElementById('toast');

        try {
            const response = await apiClient.post('/users/delete', {
                password: password
            });

            setToast(true, "Account Deleted Successfully. You will be redirected to Home.");
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (error) {
            console.error("Account Deletion Failed: " + error);
            if (error.response.data.error == "password") {
                setToast(false, "Incorrect password.");
            } else {
                setToast(false, "Error occured when deleting account.")
            }
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
        <div>
            <Navbar />
            {user != null &&
                <div className="mx-5 text-black dark:text-white">
                    {visitedPlaces.length > 0 &&
                        <div className="my-3">
                            <p className="text-xl">Visited Places</p>
                            <div className="flex flex-row">
                                {visitedPlaces.map((destination, index) => (
                                    <DestinationCard key={index} id={destination.id} title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.images.length > 0 ? destination.images[0].image : ""} cost={destination.cost} location={destination.location} />
                                ))}
                            </div>
                        </div>
                    }

                    {wishlist.length > 0 &&
                        <div className="my-3">
                            <p className="text-xl">Wishlist</p>
                            <div className="flex flex-row">
                                {wishlist.map((destination, index) => (
                                    <DestinationCard key={index} id={destination.id} title={destination.name} rating={destination.rating} description={destination.description} type={destination.destination_type} image={destination.images.length > 0 ? destination.images[0].image : ""} cost={destination.cost} location={destination.location} />
                                ))}
                            </div>
                        </div>
                    }

                    <div className="my-3">
                        <p className="text-xl">Settings</p>

                        <div className="flex flex-col bg-slate-100 dark:bg-slate-950 m-3 pb-5 rounded-xl border-2 dark:border-slate-900">
                            <div className="relative flex justify-end m-5">
                                <p className="absolute left-1/2 -translate-x-1/2 text-xl text-center font-semibold">Your Details</p>
                                {isEditing &&
                                    <div className="flex">
                                        <CheckIcon className="w-6 me-3 text-green-600 hover:text-green-500" onClick={handleEdit} role="button" />
                                        <XMarkIcon className="w-6 text-red-600 hover:text-red-500" onClick={toggleEditing} role="button" />
                                    </div>
                                }
                                {!isEditing &&
                                    <PencilSquareIcon className="w-6 text-blue-600 hover:text-blue-500" onClick={toggleEditing} role="button" />
                                }
                            </div>
                            <div className="mx-auto my-3">
                                <div className="min-w-16">
                                    {profilePicture && (
                                        <div className="relative">
                                            <img
                                                className="object-cover size-40 rounded-full"
                                                src={profilePicture}
                                                alt="Profile Picture"
                                                onClick={isEditing ? handleUpload : null}
                                                role={isEditing ? "button" : null}
                                            />
                                            {isEditing &&
                                                <TrashIcon className="absolute right-0 top-0 w-8 text-red-600 hover:scale-125 hover:text-red-500" role="button" onClick={removeProfilePicture} />
                                            }
                                        </div>
                                    )}
                                    {!profilePicture && (
                                        <UserCircleIcon
                                            className="min-w-40"
                                            onClick={isEditing ? handleUpload : null}
                                            role={isEditing ? "button" : null}
                                        />
                                    )}

                                </div>

                                <input
                                    className="hidden"
                                    id="profile-picture"
                                    type="file"
                                    onChange={handleProfilePicture}
                                />
                            </div>
                            <div className="flex lg:flex-row flex-col md:w-3/4 md:mx-auto mx-5 my-3 justify-around gap-5">
                                <div className="md:block flex flex-col lg:w-1/2">
                                    <label className="inline-block md:w-1/4">Username:</label>
                                    <input
                                        className="rounded-xl md:w-3/4 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        readOnly={!isEditing}
                                    />
                                </div>

                                {isEditing &&
                                    <div className="md:block flex flex-col lg:w-1/2">
                                        <label className="inline-block md:w-1/4">Country:</label>
                                        <select className="rounded-xl md:w-3/4 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600" onChange={(e) => setCountry(e.target.value)}>
                                            <option value="">{country}</option>
                                            {countryList.map((country, index) => (
                                                <option key={index} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                }
                                {!isEditing &&
                                    <div className="md:block flex flex-col lg:w-1/2">
                                        <label className="inline-block md:w-1/4">Country:</label>
                                        <input
                                            className="rounded-xl md:w-3/4 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600"
                                            value={country}
                                            readOnly
                                        />
                                    </div>
                                }
                            </div>
                            <div className="flex lg:flex-row flex-col md:w-3/4 md:mx-auto mx-5 my-3 justify-around gap-3">
                                <div className="md:block flex flex-col lg:w-1/2">
                                    <label className="inline-block md:w-1/4">First Name:</label>
                                    <input
                                        className="rounded-xl md:w-3/4 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div className="md:block flex flex-col lg:w-1/2">
                                    <label className="inline-block md:w-1/4">Last Name:</label>
                                    <input
                                        className="rounded-xl md:w-3/4 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        readOnly={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex md:flex-row flex-col">
                            <div className="md:w-1/2 bg-slate-100 dark:bg-slate-950 m-3 rounded-xl border-2 dark:border-slate-900">
                                <p className="text-xl m-5 font-semibold text-center">Change Password</p>
                                <form className="flex flex-col" onSubmit={handleChangePassword}>
                                    <input
                                        className="rounded-xl lg:mx-20 mx-10 my-3 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600"
                                        placeholder="Current Password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                    <input
                                        className="rounded-xl lg:mx-20 mx-10 my-3 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600"
                                        placeholder="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <input
                                        className="rounded-xl lg:mx-20 mx-10 my-3 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600"
                                        placeholder="Confirm Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button className="bg-accent-light dark:bg-accent-dark rounded-xl w-fit mx-auto my-3 py-2 px-3" type="submit">Change Password</button>
                                </form>
                            </div>

                            <div className="flex flex-col md:w-1/2 bg-slate-100 dark:bg-slate-950 m-3 rounded-xl border-2 dark:border-slate-900 gap-3 p-3">
                                <p className="text-xl m-5 font-semibold text-center">Delete Account</p>
                                <p className="font-semibold text-center">Are you sure you want to delete the account?</p>
                                <p className="text-center">Once deleted the account <span className="text-red-600 font-semibold">cannot be recovered.</span></p>
                                {isDeleting &&
                                    <form className="flex flex-col" onSubmit={handleDelete}>
                                        <input
                                            className="rounded-xl md:w-3/4 mx-auto my-3 py-2 px-3 text-center dark:bg-gray-900 border border-slate-600"
                                            placeholder="Password"
                                            type="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <div className="flex flex-row justify-center">
                                            <button
                                                className="border border-red-400 hover:border-2 rounded-xl w-fit mx-5 my-3 py-2 px-3 text-red-600 font-semibold"
                                                type="submit"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="border border-blue-400 hover:border-2 rounded-xl w-fit mx-5 my-3 py-2 px-3 font-semibold"
                                                onClick={() => setIsDeleting(false)}

                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                }
                                {!isDeleting &&
                                    <button
                                        className="border border-red-400 hover:border-2 rounded-xl w-fit mx-auto my-3 py-2 px-3 text-red-600 font-semibold"
                                        onClick={() => setIsDeleting(true)}
                                    >
                                        Delete Account
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

            <Toast isHidden={isToastHidden} isSuccess={isToastSuccess} message={toastMessage} />
        </div >
    );
}

export default Profile;