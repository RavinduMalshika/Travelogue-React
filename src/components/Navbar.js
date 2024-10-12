import { Bars4Icon } from "@heroicons/react/24/outline";
import { HttpStatusCode } from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import apiClient from "../apiClient";



const Navbar = ({ activeLink }) => {
  const navigate = useNavigate();

  const { user } = useContext(AppContext);
  const { setUser } = useContext(AppContext);

  useEffect(() => {
    if (localStorage.getItem("access_token") != null) {
      console.log(localStorage.getItem("access_token"));
      getUser();
    }
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

      if (response.status === 401) {
        throw new Error('Unauthorized: Token might be expired or invalid');
      }

      const userData = response.data;
      setUser(userData);
      console.log(userData);
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

  const toggleDropdown = () => {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.classList.toggle('hidden');
  }

  const toggleProfileOptions = () => {
    const profileOptionMenu = document.getElementById('profile-options');
    profileOptionMenu.classList.toggle('hidden');
  }

  const handleLogout = async () => {
    console.log("logout called");

    try {
      const response = await apiClient.post("http://localhost:8000/users/logout", {
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "refresh_token": localStorage.getItem('refresh_token')
        })
      });

      console.log(response.status);

      if (response.status == HttpStatusCode.ResetContent) {
        console.log("logout successful")

        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        setUser(null);
        navigate("/");
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error("Logout Failed:", error)
    }
  }

  const handleProfile = () => {
    navigate('/profile');
  }

  const handleVisitedPlaces = () => {

  }

  return (
    <nav>
      <div className="flex flex-row my-2 mx-4">
        <Bars4Icon className="h-6 w-6 mt-auto md:hidden" aria-expanded="true" aria-haspopup="true" onClick={() => toggleDropdown()} />
        <p className="flex grow my-auto md:grow-0 justify-center text-2xl">Travelogue</p>


        <div className="flex grow justify-center text-lg hidden md:flex">
          <Link
            to={'/'}
            className={`my-auto mx-4 hover:text-black ${activeLink === "home" ? "text-black" : "text-slate-500"}`}
          >
            Home</Link>
          <Link
            to={'/explore'}
            className={`my-auto mx-4 hover:text-black ${activeLink === "explore" ? "text-black" : "text-slate-500"}`}
          >
            Explore</Link>
          <Link
            to={'/about-us'}
            className={`my-auto mx-4 hover:text-black ${activeLink === "about-us" ? "text-black" : "text-slate-500"}`}
          >About Us</Link>
          <Link
            to={'/contact-us'}
            className={`my-auto mx-4 hover:text-black ${activeLink === "contact-us" ? "text-black" : "text-slate-500"}`}
          >Contact Us</Link>
        </div>

        <div
          className="origin-top-left absolute left-0 mt-10 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden md:hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          id="dropdown-menu"
        >
          <div className="flex flex-col py-1 text-sm " role="none">
            <Link
              to={'/'}
              className={`px-4 py-2 hover:text-black ${activeLink === "home" ? "text-black" : "text-slate-500"}`}
            >
              Home</Link>
            <Link
              to={'/explore'}
              className={`px-4 py-2 hover:text-black ${activeLink === "about-us" ? "text-black" : "text-slate-500"}`}
            >Explore</Link>
            <Link
              to={'/about-us'}
              className={`px-4 py-2 hover:text-black ${activeLink === "about-us" ? "text-black" : "text-slate-500"}`}
            >About Us</Link>
            <Link
              to={'/contact-us'}
              className={`px-4 py-2 hover:text-black ${activeLink === "contact-us" ? "text-black" : "text-slate-500"}`}
            >Contact Us</Link>
          </div>
        </div>
        <div className="md:text-lg justify-right my-auto">

          {user !== null &&
            <div
              className="relative flex flex-row align-middle cursor-pointer bg-lime-200 md:ps-3 rounded-full"
              id="menu-button"
              onClick={toggleProfileOptions}
              aria-expanded="true"
              aria-haspopup="true"
            >
              <p className="my-auto hidden md:block">{user.username} </p>
              <img className="w-10 md:ms-2 rounded-full" src={user.image} alt="Profile Picture" />

              <div
                id="profile-options"
                className="absolute right-0 mt-12 z-10 origin-top-right bg-white divide-y divide-gray-300 w-max rounded-xl overflow-hidden border text-base leading-relaxed hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div>
                  <p className="py-2 px-3 hover:bg-slate-100" onClick={handleProfile}>Profile</p>
                  <p className="py-2 px-3 hover:bg-slate-100" onClick={handleVisitedPlaces}>Visited Places</p>
                </div>
                <div className="hover:bg-slate-100">
                  <p className="py-2 px-3 text-red-500" href="#" onClick={handleLogout}>Logout</p>
                </div>
              </div>
            </div>

          }

          {user === null &&
            <Link to={'/login'}>Login</Link>
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;