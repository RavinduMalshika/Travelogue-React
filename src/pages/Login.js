import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import apiClient from "../apiClient";

const Login = () => {
    const naviagte = useNavigate();

    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [country, setCountry] = useState("");
    const [countryList, setCountryList] = useState([]);
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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

    const handleLogin = async (event) => {
        event.preventDefault();
        console.log(loginUsername);
        console.log(loginPassword);

        apiClient.post('/users/login', {
            username: loginUsername,
            password: loginPassword
        })
            .then(response => {
                console.log(response.status);
                if (response.data.access && response.data.refresh) {
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
                    console.log("Login Successful");

                    naviagte("/")
                } else {
                    console.error("Login Failed");
                }
            })
            .catch(error => {
                console.error("Login Failed: ", error)
            });
    }

    const handleRegister = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', registerUsername);
        formData.append('password', registerPassword);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('location', country);
        formData.append('email', email);
        formData.append('confirm_password', confirmPassword);
        formData.append('image', selectedImage);

        try {
            const response = await fetch("http://localhost:8000/users/register", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();


            switch (data.error) {
                case "password":
                    console.log("Password invalid");
                    break;
                case "confirmPassword":
                    console.log("Password mismatch");
                    break;
                case "email":
                    console.log("Email invalid");
                    break;
                case "username":
                    console.log("Username invalid");
                    break;
                default:
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    console.log("Registration Successful");

                    naviagte("/")
                    break;
            }
        } catch (error) {
            console.error("Error registering user:", error)
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
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleClear = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    }

    const handleCountry = (event) => {
        setCountry(event.target.value);
    }

    return (
        <div className="relative min-h-screen">
            <Navbar />


            <div className="absolute left-1/2 -translate-x-1/2 top-20 flex flex-row bg-comp-light dark:bg-comp-dark shadow-xl dark:shadow-gray-800 rounded-xl border-2 dark:border-gray-900">
                <div className="flex flex-col py-5 px-5 my-auto">
                    <p className="text-black dark:text-white text-center text-xl text-bold">Login</p>

                    <form className="flex flex-col" onSubmit={handleLogin} method="post">
                        <input
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white border border-slate-600 text-center"
                            type="text"
                            value={loginUsername}
                            placeholder="Username"
                            onChange={(e) => setLoginUsername(e.target.value)}
                            required
                        />
                        <input
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white border border-slate-600 text-center"
                            type="password"
                            value={loginPassword}
                            placeholder="Password"
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-accent-light dark:bg-accent-dark text-black dark:text-white rounded-xl w-fit mx-auto my-3 py-2 px-3">Login</button>
                    </form>
                </div>

                <div className="w-px min-h-full bg-gray-400 my-5"></div>

                <div className="flex flex-col py-5 px-5">
                    <p className="text-black dark:text-white text-center text-xl text-bold">Register</p>

                    <form className="flex flex-col" onSubmit={handleRegister}>
                        <input
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white text-center border border-slate-600 invalid:border-red-400"
                            type="text"
                            value={registerUsername}
                            placeholder="Username"
                            onChange={(e) => setRegisterUsername(e.target.value)}
                            required
                        />
                        <div className="flex flex-row m-3 py-2 px-3">


                            <div className="min-w-16">
                                {previewUrl && (
                                    <img className="object-cover size-16 rounded-full" src={previewUrl} alt="Profile Picture" />
                                )}
                                {!previewUrl && (
                                    <UserCircleIcon className="min-w-16 text-black dark:text-white rounded-full" />
                                )}

                            </div>

                            <input
                                className="hidden"
                                id="profile-picture"
                                type="file"
                                onChange={handleProfilePicture}
                            />

                            <button
                                className="h-11 rounded-xl m-3 me-1 py-2 px-3 bg-gray-50 dark:bg-gray-900 border border-slate-400 hover:border-black dark:hover:border-white text-black dark:text-white"
                                onClick={handleUpload}
                            >Upload</button>

                            {previewUrl && (
                                <XMarkIcon className="h-11 w-12 rounded-xl my-3 ms-1 py-2 px-3 bg-gray-50 dark:bg-gray-900 border border-slate-400 text-red-500 hover:border-red-500 cursor-pointer" onClick={handleClear} />
                            )}
                        </div>

                        <input
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white text-center border border-slate-600 invalid:border-red-400"
                            type="text"
                            value={firstName}
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white text-center border border-slate-600 invalid:border-red-400"
                            type="text"
                            value={lastName}
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <select
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white text-center border border-slate-600 invalid:border-red-400"
                            value={country}
                            onChange={handleCountry}
                            required
                        >
                            <option value="" hidden>Country</option>
                            {countryList.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                        <input
                            id="email"
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white text-center border border-slate-600 invalid:border-red-400"
                            type="email"
                            value={email}
                            placeholder="Email"
                            onChange={(e) => {
                                setEmail(e.target.value)
                                if (document.getElementById("email").classList.contains("border-red-400")) {
                                    document.getElementById("email").classList.remove("border-red-400");
                                }
                            }}
                            required
                        />
                        <input
                            id="registerPassword"
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white text-center border border-slate-600 invalid:border-red-400"
                            type="password"
                            value={registerPassword}
                            placeholder="Password"
                            onChange={(e) => {
                                setRegisterPassword(e.target.value)
                                if (document.getElementById("registerPassword").classList.contains("border-red-400")) {
                                    document.getElementById("registerPassword").classList.remove("border-red-400");
                                }
                            }}
                            required
                        />
                        <input
                            className="rounded-xl m-3 py-2 px-3 dark:bg-gray-900 text-black dark:text-white text-center border border-slate-600invalid:border-red-400"
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-accent-light dark:bg-accent-dark text-black dark:text-white rounded-xl w-fit mx-auto my-3 py-2 px-3">Register</button>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default Login;