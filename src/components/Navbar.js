import { Bars4Icon } from "@heroicons/react/24/outline";
import { HttpStatusCode } from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import apiClient from "../apiClient";
import { SunIcon, MoonIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { root } from "postcss";

const Navbar = ({ activeLink }) => {
  const navigate = useNavigate();

  const { user } = useContext(AppContext);
  const { setUser } = useContext(AppContext);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token") != null) {
      getUser();
    }

    const root = window.document.documentElement;

    console.log(localStorage.getItem("travelogue-theme"));

    if (localStorage.getItem("travelogue-theme") == null) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        localStorage.setItem('travelogue-theme', 'dark');
        setIsDarkMode(true);
      } else {
        localStorage.setItem('travelogue-theme', 'light');
        setIsDarkMode(false);
      }
    } else {
      if (localStorage.getItem("travelogue-theme") == 'dark') {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement;
    console.log("at useEffect of isDarkMode", isDarkMode);
    if (isDarkMode) {
      if (!root.classList.contains('dark')) {
        root.classList.add('dark');
        localStorage.setItem('travelogue-theme', 'dark');
      }
    } else {
      if (root.classList.contains('dark')) {
        root.classList.remove('dark');
        localStorage.setItem('travelogue-theme', 'light');
      }
    }
  }, [isDarkMode])

  const getUser = async () => {
    const token = localStorage.getItem('access_token');

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
      const response = await apiClient.post("/users/logout", {
        "refresh_token": localStorage.getItem('refresh_token')
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

  return (
    <nav className="bg-white dark:bg-black">
      <div className="flex flex-row py-2 px-4">
        <Bars4Icon className="h-6 w-6 my-auto md:hidden dark:text-white" aria-expanded="true" aria-haspopup="true" onClick={() => toggleDropdown()} />
        <p className="flex grow my-auto md:grow-0 justify-center text-2xl text-black dark:text-white">Travelogue</p>


        <div className="flex grow justify-center text-lg hidden md:flex">
          <Link
            to={'/'}
            className={`my-auto mx-4 hover:text-black ${activeLink === "home" ? "text-black dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
          >
            Home</Link>
          <Link
            to={'/explore/all'}
            className={`my-auto mx-4 hover:text-black ${activeLink === "explore" ? "text-black dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
          >
            Explore</Link>
          <Link
            to={'/about-us'}
            className={`my-auto mx-4 hover:text-black ${activeLink === "about-us" ? "text-black dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
          >About Us</Link>
          <Link
            to={'/contact-us'}
            className={`my-auto mx-4 hover:text-black ${activeLink === "contact-us" ? "text-black dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
          >Contact Us</Link>
        </div>

        <div
          className="origin-top-left absolute z-10 left-0 mt-10 w-full rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5 focus:outline-none hidden md:hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          id="dropdown-menu"
        >
          <div className="flex flex-col py-1 text-sm " role="none">
            <Link
              to={'/'}
              className={`px-4 py-2 hover:text-black ${activeLink === "home" ? "text-black dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
            >
              Home</Link>
            <Link
              to={'/explore/all'}
              className={`px-4 py-2 hover:text-black ${activeLink === "explore" ? "text-black dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
            >Explore</Link>
            <Link
              to={'/about-us'}
              className={`px-4 py-2 hover:text-black ${activeLink === "about-us" ? "text-black dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
            >About Us</Link>
            <Link
              to={'/contact-us'}
              className={`px-4 py-2 hover:text-black ${activeLink === "contact-us" ? "text-black dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
            >Contact Us</Link>
          </div>
        </div>

        <div className="p-0.5 w-16 h-fit rounded-full bg-gradient-to-r from-accent-light to-accent-dark me-3 my-auto">
          <div className="relative min-h-7 rounded-full p-0.5 bg-canvas-light dark:bg-canvas-dark">
            <div
              className={`absolute border ${isDarkMode ? 'translate-x-8 bg-white border-black' : 'translate-x-0 bg-black border-white'} max-h-6 aspect-square rounded-full p-0.5 cursor-pointer transition-all duration-300 ease-in-out`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {!isDarkMode &&
                <SunIcon className="text-white w-full" />
              }
              {isDarkMode &&
                <MoonIcon className="text-black w-full" />
              }
            </div>
          </div>
        </div>

        <div className="md:text-lg justify-right my-auto">

          {user !== null &&
            <div
              className="relative flex flex-row align-middle cursor-pointer bg-accent-light dark:bg-accent-dark md:ps-3 rounded-full"
              id="menu-button"
              onClick={toggleProfileOptions}
              aria-expanded="true"
              aria-haspopup="true"
            >
              <p className="my-auto hidden md:block">{user.username} </p>
              {user.image &&
                <img className="w-10 md:ms-2 rounded-full" src={user.image} alt="Profile Picture" />
              }

              {!user.image &&
                <UserCircleIcon className="w-10 md:ms-2" />
              }

              <div
                id="profile-options"
                className="absolute right-0 mt-12 z-10 origin-top-right bg-white dark:bg-black text-black dark:text-white divide-y divide-gray-300 dark:divide-gray-600 w-max rounded-xl overflow-hidden border dark:border-slate-600 text-base leading-relaxed hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div>
                  <p className="py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => navigate('/profile')}>Profile</p>
                  <p className="py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => navigate('/explore/visited')}>Visited Places</p>
                  <p className="py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => navigate('/explore/wishlist')}>Wishlist</p>
                  <p className="py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => navigate('/destination/add')}>Add a Destination</p>
                </div>
                <div className="hover:bg-slate-100 dark:hover:bg-slate-800">
                  <p className="py-2 px-3 text-red-500" href="#" onClick={handleLogout}>Logout</p>
                </div>
              </div>
            </div>

          }

          {user === null &&
            <Link className="text-accent-dark dark:text-accent-light" to={'/login'}>Login</Link>
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;