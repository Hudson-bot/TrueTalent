import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FiSearch, FiStar, FiFilter, FiGrid, FiList, FiSliders,
    FiClock, FiMapPin, FiDollarSign, FiCheckCircle, FiMessageSquare,
    FiHeart, FiBookmark, FiX, FiChevronDown, FiChevronUp, FiUsers
} from 'react-icons/fi';
import HireSidebar from './HireSidebar';

// Talent card component
const TalentCard = ({ talent, view, onToggleFavorite, onToggleSaved, onSendMessage }) => {
    const [showDetails, setShowDetails] = useState(false);

    // Calculate match percentage based on skills match
    const matchPercentage = talent.matchPercentage || Math.floor(Math.random() * 30) + 70;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white rounded-xl shadow-md border border-gray-100 hover:border-blue-200 transition-all ${view === 'grid' ? 'p-4' : 'p-6'
                }`}
        >
            <div className={`flex ${view === 'grid' ? 'flex-col' : 'flex-row gap-6'}`}>
                {/* Profile image and match score */}
                <div className={`${view === 'grid' ? 'mb-4 text-center' : 'w-1/5'}`}>
                    <div className="relative inline-block">
                        <img
                            src={talent.profilePic || "/api/placeholder/160/160"}
                            alt={talent.name}
                            className={`rounded-full object-cover border-2 border-gray-100 ${view === 'grid' ? 'w-20 h-20 mx-auto' : 'w-24 h-24'
                                }`}
                        />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                            {matchPercentage}%
                        </div>
                    </div>

                    {view === 'grid' && (
                        <h3 className="font-semibold text-gray-800 mt-2 text-center">{talent.name}</h3>
                    )}

                    {view === 'grid' && (
                        <p className="text-sm text-gray-500 text-center">{talent.title}</p>
                    )}
                </div>

                {/* Main talent info */}
                <div className={view === 'grid' ? '' : 'flex-1'}>
                    {view === 'list' && (
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-800 text-lg">{talent.name}</h3>
                                <p className="text-gray-600">{talent.title}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(talent._id);
                                    }}
                                    className={`p-2 rounded-full ${talent.isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <FiHeart />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleSaved(talent._id);
                                    }}
                                    className={`p-2 rounded-full ${talent.isSaved ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <FiBookmark />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                        {talent.skills.slice(0, view === 'grid' ? 3 : 5).map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                                {skill}
                            </span>
                        ))}
                        {talent.skills.length > (view === 'grid' ? 3 : 5) && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                +{talent.skills.length - (view === 'grid' ? 3 : 5)}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                            <FiMapPin className="mr-1" />
                            <span>{talent.location}</span>
                        </div>
                        <div className="flex items-center">
                            <FiDollarSign className="mr-1" />
                            <span>{talent.hourlyRate}/hr</span>
                        </div>
                        <div className="flex items-center">
                            <FiClock className="mr-1" />
                            <span>{talent.availability}</span>
                        </div>
                        <div className="flex items-center">
                            <FiStar className="mr-1 text-yellow-500" />
                            <span>{talent.rating} ({talent.totalReviews} reviews)</span>
                        </div>
                    </div>

                    {view === 'list' && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{talent.bio}</p>
                    )}

                    {/* Action buttons */}
                    <div className={`flex ${view === 'grid' ? 'flex-col space-y-2' : 'space-x-3'} mt-2`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSendMessage(talent._id);
                            }}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm w-full"
                        >
                            <FiMessageSquare size={16} />
                            <span>Message</span>
                        </button>

                        {view === 'grid' && (
                            <div className="flex justify-between">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(talent._id);
                                    }}
                                    className={`p-2 rounded-full ${talent.isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <FiHeart />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleSaved(talent._id);
                                    }}
                                    className={`p-2 rounded-full ${talent.isSaved ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <FiBookmark />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDetails(!showDetails);
                                    }}
                                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100"
                                >
                                    {showDetails ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Collapsible details for grid view */}
                    {view === 'grid' && showDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 pt-3 border-t border-gray-100"
                        >
                            <p className="text-gray-600 text-sm mb-2">{talent.bio}</p>
                            <div className="text-xs text-gray-500">
                                <div className="flex items-start mb-1">
                                    <span className="font-medium mr-2">Experience:</span>
                                    <span>{talent.experience} years</span>
                                </div>
                                <div className="flex items-start mb-1">
                                    <span className="font-medium mr-2">Languages:</span>
                                    <span>{talent.languages.join(', ')}</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="font-medium mr-2">Education:</span>
                                    <span>{talent.education}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Filter sidebar component
const FilterSidebar = ({ filters, onFilterChange, onClose, isVisible }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (category, value) => {
        const updatedFilters = { ...localFilters, [category]: value };
        setLocalFilters(updatedFilters);
    };

    const handleRangeChange = (category, key, value) => {
        const updatedRange = { ...localFilters[category], [key]: value };
        const updatedFilters = { ...localFilters, [category]: updatedRange };
        setLocalFilters(updatedFilters);
    };

    const applyFilters = () => {
        onFilterChange(localFilters);
        if (window.innerWidth < 768) onClose();
    };

    return (
        <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: isVisible ? 0 : -300, opacity: isVisible ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`bg-white shadow-lg p-4 fixed md:static top-0 left-0 h-full md:h-auto z-40 w-72 overflow-y-auto ${isVisible ? 'block' : 'hidden md:block'
                }`}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 md:hidden">
                    <FiX size={20} />
                </button>
            </div>

            {/* Skills filter */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                <div className="space-y-2">
                    {['UI/UX Design', 'React', 'Node.js', 'JavaScript', 'Python', 'Content Writing', 'SEO'].map((skill) => (
                        <label key={skill} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={localFilters.skills.includes(skill)}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    handleChange(
                                        'skills',
                                        isChecked
                                            ? [...localFilters.skills, skill]
                                            : localFilters.skills.filter((s) => s !== skill)
                                    );
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="ml-2 text-sm text-gray-600">{skill}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Hourly rate filter */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate: ${localFilters.hourlyRate.min} - ${localFilters.hourlyRate.max}
                </h3>
                <div className="space-y-4 px-1">
                    <input
                        type="range"
                        min="5"
                        max="200"
                        value={localFilters.hourlyRate.min}
                        onChange={(e) => handleRangeChange('hourlyRate', 'min', parseInt(e.target.value))}
                        className="w-full"
                    />
                    <input
                        type="range"
                        min="5"
                        max="200"
                        value={localFilters.hourlyRate.max}
                        onChange={(e) => handleRangeChange('hourlyRate', 'max', parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Availability filter */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
                <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Hourly', 'Weekends only'].map((option) => (
                        <label key={option} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={localFilters.availability.includes(option)}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    handleChange(
                                        'availability',
                                        isChecked
                                            ? [...localFilters.availability, option]
                                            : localFilters.availability.filter((a) => a !== option)
                                    );
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="ml-2 text-sm text-gray-600">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Experience filter */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Experience</h3>
                <div className="space-y-2">
                    {['Entry level', 'Intermediate', 'Expert'].map((level) => (
                        <label key={level} className="flex items-center">
                            <input
                                type="radio"
                                name="experience"
                                checked={localFilters.experience === level}
                                onChange={() => handleChange('experience', level)}
                                className="border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="ml-2 text-sm text-gray-600">{level}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Location filter */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                <div className="space-y-2">
                    {['Remote', 'United States', 'Europe', 'Asia', 'Worldwide'].map((location) => (
                        <label key={location} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={localFilters.location.includes(location)}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    handleChange(
                                        'location',
                                        isChecked
                                            ? [...localFilters.location, location]
                                            : localFilters.location.filter((l) => l !== location)
                                    );
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="ml-2 text-sm text-gray-600">{location}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating filter */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleChange('minRating', star)}
                            className={`p-1 ${localFilters.minRating >= star ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                        >
                            <FiStar fill={localFilters.minRating >= star ? 'currentColor' : 'none'} />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{localFilters.minRating}+</span>
                </div>
            </div>

            <div className="flex space-x-3">
                <button
                    onClick={applyFilters}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Apply Filters
                </button>
                <button
                    onClick={() => {
                        const defaultFilters = {
                            skills: [],
                            hourlyRate: { min: 5, max: 150 },
                            availability: [],
                            experience: '',
                            location: [],
                            minRating: 0
                        };
                        setLocalFilters(defaultFilters);
                        onFilterChange(defaultFilters);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Reset
                </button>
            </div>
        </motion.div>
    );
};

// Main TalentDashboard component
const TalentDashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [talents, setTalents] = useState([]);
    const [view, setView] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortOption, setSortOption] = useState('match');
    const [filters, setFilters] = useState({
        skills: [],
        hourlyRate: { min: 5, max: 150 },
        availability: [],
        experience: '',
        location: [],
        minRating: 0
    });

    // Mock data for talents
    const mockTalents = [
        {
            _id: '1',
            name: 'Jessica Wilson',
            title: 'UI/UX Designer & Frontend Developer',
            skills: ['UI/UX Design', 'React', 'Figma', 'User Research', 'Wireframing'],
            hourlyRate: '$45',
            location: 'Remote',
            availability: 'Full-time',
            bio: 'Creative designer with 6+ years of experience creating user-centered designs for digital products.',
            rating: 4.9,
            totalReviews: 43,
            experience: 6,
            languages: ['English', 'Spanish'],
            education: 'BFA in Graphic Design',
            profilePic: '/api/placeholder/160/160',
            isFavorite: false,
            isSaved: true,
            matchPercentage: 95
        },
        {
            _id: '2',
            name: 'Michael Chen',
            title: 'Full Stack Developer',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
            hourlyRate: '$60',
            location: 'United States',
            availability: 'Part-time',
            bio: 'Full stack developer specializing in MERN stack with a focus on building scalable web applications.',
            rating: 4.8,
            totalReviews: 37,
            experience: 5,
            languages: ['English', 'Mandarin'],
            education: 'MS in Computer Science',
            profilePic: '/api/placeholder/160/160',
            isFavorite: true,
            isSaved: false,
            matchPercentage: 87
        },
        {
            _id: '3',
            name: 'Sarah Johnson',
            title: 'Content Writer & SEO Specialist',
            skills: ['Content Writing', 'SEO', 'Blog Writing', 'Copywriting', 'Research'],
            hourlyRate: '$35',
            location: 'Remote',
            availability: 'Hourly',
            bio: 'SEO-focused content writer creating engaging, conversion-oriented content for websites and blogs.',
            rating: 4.7,
            totalReviews: 29,
            experience: 4,
            languages: ['English', 'French'],
            education: 'BA in Communications',
            profilePic: '/api/placeholder/160/160',
            isFavorite: false,
            isSaved: false,
            matchPercentage: 82
        },
        {
            _id: '4',
            name: 'Raj Patel',
            title: 'Data Scientist & ML Engineer',
            skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'SQL'],
            hourlyRate: '$75',
            location: 'Asia',
            availability: 'Full-time',
            bio: 'Passionate data scientist with expertise in building predictive models and deriving actionable insights.',
            rating: 4.9,
            totalReviews: 25,
            experience: 7,
            languages: ['English', 'Hindi'],
            education: 'PhD in Computer Science',
            profilePic: '/api/placeholder/160/160',
            isFavorite: false,
            isSaved: true,
            matchPercentage: 79
        },
        {
            _id: '5',
            name: 'Emma Williams',
            title: 'Frontend Developer',
            skills: ['JavaScript', 'React', 'Vue.js', 'CSS', 'HTML'],
            hourlyRate: '$50',
            location: 'Europe',
            availability: 'Part-time',
            bio: 'Frontend specialist creating responsive and accessible web applications with a focus on user experience.',
            rating: 4.6,
            totalReviews: 31,
            experience: 4,
            languages: ['English', 'German'],
            education: 'BS in Web Development',
            profilePic: '/api/placeholder/160/160',
            isFavorite: true,
            isSaved: false,
            matchPercentage: 88
        },
        {
            _id: '6',
            name: 'David Rodriguez',
            title: 'App Developer & UI Designer',
            skills: ['React Native', 'Swift', 'Kotlin', 'UI Design', 'Firebase'],
            hourlyRate: '$65',
            location: 'United States',
            availability: 'Full-time',
            bio: 'Mobile app developer with a strong design background, creating intuitive and visually appealing applications.',
            rating: 4.8,
            totalReviews: 42,
            experience: 6,
            languages: ['English', 'Spanish'],
            education: 'MS in Mobile Computing',
            profilePic: '/api/placeholder/160/160',
            isFavorite: false,
            isSaved: true,
            matchPercentage: 91
        }
    ];

    // Fetch talents data
    useEffect(() => {
        const fetchTalents = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:5000/api/talents', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTalents(response.data);
            } catch (error) {
                console.error("Error fetching talents:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTalents();
    }, []);

    // Handle toggling favorite status
    const handleToggleFavorite = (talentId) => {
        setTalents(
            talents.map(talent =>
                talent._id === talentId
                    ? { ...talent, isFavorite: !talent.isFavorite }
                    : talent
            )
        );
    };

    // Handle toggling saved status
    const handleToggleSaved = (talentId) => {
        setTalents(
            talents.map(talent =>
                talent._id === talentId
                    ? { ...talent, isSaved: !talent.isSaved }
                    : talent
            )
        );
    };

    // Handle sending message to talent
    const handleSendMessage = (talentId) => {
        // Navigate to messages page with talent ID
        navigate(`/hire/messages?talent=${talentId}`);
    };

    // Filter and sort talents based on current filters and sort option
    const filteredTalents = talents.filter(talent => {
        const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            talent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSkills = filters.skills.length === 0 ||
            filters.skills.some(skill => talent.skills.includes(skill));

        const hourlyRateNum = parseInt(talent.hourlyRate.replace(/\D/g, ''));
        const matchesHourlyRate = hourlyRateNum >= filters.hourlyRate.min &&
            hourlyRateNum <= filters.hourlyRate.max;

        const matchesAvailability = filters.availability.length === 0 ||
            filters.availability.includes(talent.availability);

        const matchesExperience = !filters.experience ||
            (filters.experience === 'Entry level' && talent.experience < 3) ||
            (filters.experience === 'Intermediate' && talent.experience >= 3 && talent.experience < 6) ||
            (filters.experience === 'Expert' && talent.experience >= 6);

        const matchesLocation = filters.location.length === 0 ||
            filters.location.includes(talent.location);

        const matchesRating = talent.rating >= filters.minRating;

        return matchesSearch && matchesSkills && matchesHourlyRate &&
            matchesAvailability && matchesExperience && matchesLocation && matchesRating;
    }).sort((a, b) => {
        if (sortOption === 'match') {
            return (b.matchPercentage || 0) - (a.matchPercentage || 0);
        } else if (sortOption === 'rating') {
            return b.rating - a.rating;
        } else if (sortOption === 'hourlyRate') {
            return parseInt(a.hourlyRate.replace(/\D/g, '')) - parseInt(b.hourlyRate.replace(/\D/g, ''));
        }
        return 0;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans">
            <HireSidebar activeTab="talents" />

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Filter sidebar - hidden on mobile unless toggled */}
                <FilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onClose={() => setShowFilters(false)}
                    isVisible={showFilters}
                />

                {/* Main content area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Find Talent</h1>

                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            {/* Search input */}
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for skills, titles..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Mobile filter toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden px-3 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 flex items-center"
                            >
                                <FiFilter className="mr-1" />
                                Filters
                            </button>

                            {/* Sort dropdown */}
                            <div className="relative">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="match">Best Match</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="hourlyRate">Lowest Rate</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* View toggle */}
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`px-3 py-2 ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'}`}
                                >
                                    <FiGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`px-3 py-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'}`}
                                >
                                    <FiList size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results summary */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                            Showing {filteredTalents.length} of {talents.length} talents
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="text-gray-600 mr-1">Active filters:</span>
                            {filters.skills.length > 0 && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1">
                                    {filters.skills.length} skills
                                </span>
                            )}
                            {filters.availability.length > 0 && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1">
                                    {filters.availability.length} availability
                                </span>
                            )}
                            {filters.location.length > 0 && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1">
                                    {filters.location.length} locations
                                </span>
                            )}
                            {filters.minRating > 0 && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1">
                                    {filters.minRating}+ rating
                                </span>
                            )}
                            {filters.experience && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1">
                                    {filters.experience}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Talent grid/list */}
                    {filteredTalents.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-xl font-medium text-gray-800 mb-2">No matching talents found</h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your filters or search terms to find more talents.
                            </p>
                            <button
                                onClick={() => {
                                    setFilters({
                                        skills: [],
                                        hourlyRate: { min: 5, max: 150 },
                                        availability: [],
                                        experience: '',
                                        location: [],
                                        minRating: 0
                                    });
                                    setSearchTerm('');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                            <AnimatePresence>
                                {filteredTalents.map((talent) => (
                                    <motion.div
                                        key={talent._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <TalentCard
                                            talent={talent}
                                            view={view}
                                            onToggleFavorite={handleToggleFavorite}
                                            onToggleSaved={handleToggleSaved}
                                            onSendMessage={handleSendMessage}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TalentDashboard;