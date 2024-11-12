import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const DestinationCard = ({ id, title, cost, image, type, rating, description, location }) => {
    const navigate = useNavigate();

    return (
        <div className='min-w-52 sm:min-w-64 md:min-w-80 xl:min-w-96 max-w-52 sm:max-w-64 md:max-w-80 xl:max-w-96 ms-3 my-3 p-5 rounded-xl bg-white dark:bg-slate-950 shadow dark:shadow-sm dark:shadow-slate-700 hover:shadow-lg dark:hover:shadow-md dark:hover:shadow-slate-400 cursor-pointer' onClick={() => navigate(`/destination/${id}`)}>
            <img className='object-cover rounded-xl aspect-4/3' src={image} alt='destination' />
            <p className="text-lg text-black dark:text-white font-bold my-1">{title}</p>
            <div className="flex flex-col md:flex-row my-1 text-slate-600 dark:text-slate-400">
                <p className="grow font-semibold">{location}</p>
                <p>{type}</p>
            </div>
            <div className="flex flex-col md:flex-row my-1">
                <p className="grow font-semibold text-red-600 my-1">{cost}</p>
                <p className="flex bg-comp-light dark:bg-comp-dark text-black dark:text-white px-2 py-1 rounded-2xl font-semibold w-fit"><StarIcon className="w-5 text-yellow-500" /> : {rating.toFixed(1)} / 5.0</p>
            </div>
            <p className="hidden md:display-webkit-box line-clamp-3 text-black dark:text-white">{description}</p>
        </div>
    );
}

export default DestinationCard;
