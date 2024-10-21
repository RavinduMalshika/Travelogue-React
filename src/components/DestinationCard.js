import { StarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const DestinationCard = ({ id, title, cost, image, type, rating, description, location }) => {
    const navigate = useNavigate();

    return (
        <div className='w-52 sm:w-64 md:w-80 xl:w-96 ms-3 my-3 p-5 rounded-xl bg-grgay-200 shadow hover:shadow-lg cursor-pointer' onClick={() => navigate(`/destination/${id}`)}>
            <img className='object-cover rounded-xl aspect-4/3' src={image} alt='destination' />
            <p className="text-lg font-bold my-1">{title}</p>
            <div className="flex flex-col md:flex-row my-1">
                <p className="grow font-semibold text-slate-600">{location}</p>
                <p className="text-slate-600">{type}</p>
            </div>
            <div className="flex flex-col md:flex-row my-1">
                <p className="grow font-semibold text-red-600 my-1">{cost}</p>
                <p className="flex bg-blue-100 px-2 py-1 rounded-2xl font-semibold w-fit"><StarIcon className="w-5 text-yellow-500" /> : {rating} / 5.0</p>
            </div>
            <p className="hidden md:display-webkit-box line-clamp-3">{description}</p>
        </div>
    );
}

export default DestinationCard;
