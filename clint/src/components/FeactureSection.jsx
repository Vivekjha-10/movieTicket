import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/AppContext';

const FeatureSection = () => {
    const navigate = useNavigate();
    const { shows } = useAppContext();

    const handleViewAll = () => {
        navigate('/movies');
        window.scrollTo(0, 0);
    };

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
            {/* Header Section */}
            <div className="relative flex items-center justify-between pt-20 pb-10">
                <p className="text-gray-300 font-medium text-lg">Now Showing</p>

                <button
                    onClick={handleViewAll}
                    className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
                >
                    View All
                    <BlurCircle top="0" right="-80" />
                    <ArrowRight
                        className="group-hover:translate-x-0.5 transition w-4.5 h-4.5"
                    />
                </button>
            </div>

            {/* Movie Cards */}
            <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
                {shows?.length > 0 ? (
                    shows.slice(0, 4).map((show) => (
                        <MovieCard key={show._id} movie={show.movie} />
                    ))
                ) : (
                    <p className="text-gray-400">No shows available.</p>
                )}

            </div>

            {/* Show More Button */}
            <div className="flex justify-center mt-20">
                <button
                    onClick={handleViewAll}
                    className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition
          rounded-md font-medium cursor-pointer"
                >
                    Show more
                </button>
            </div>
        </div>
    );
};

export default FeatureSection;
