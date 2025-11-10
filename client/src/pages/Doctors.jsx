import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Star, MapPin, Clock, Stethoscope, Filter, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    city: '',
  });

  useEffect(() => {
    loadSpecializations();
    loadDoctors();
  }, [filters]);

  const loadSpecializations = async () => {
    try {
      const response = await api.get('/doctors/specializations');
      setSpecializations(response.data.data);
    } catch (error) {
      console.error('Error loading specializations:', error);
    }
  };

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.city) params.append('city', filters.city);

      const response = await api.get(`/doctors?${params.toString()}`);
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      specialization: '',
      city: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
          <p className="text-gray-600">Browse through our verified medical professionals</p>
        </motion.div>

        {/* Search Bar */}
        <div className="card mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filter Options</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    value={filters.specialization}
                    onChange={(e) => handleFilterChange('specialization', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {!loading && (
          <div className="mb-4 text-gray-600">
            Found <span className="font-semibold text-gray-900">{doctors.length}</span> doctor{doctors.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="card text-center py-12">
            <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card hover:shadow-xl transition-all cursor-pointer group"
              >
                {/* Verified Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium">
                    <Award className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Doctor Image */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center ring-4 ring-primary-50 group-hover:ring-primary-100 transition-all">
                    {doctor.userId?.avatar ? (
                      <img
                        src={doctor.userId.avatar}
                        alt={doctor.userId.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary-600">
                        {doctor.userId?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {doctor.userId?.name || 'Dr. Unknown'}
                    </h3>
                    <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-semibold text-gray-900">
                      {doctor.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    ({doctor.totalReviews} reviews)
                  </span>
                </div>

                {/* Location */}
                {doctor.location?.city && (
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {doctor.location.city}, {doctor.location.state}
                    </span>
                  </div>
                )}

                {/* Experience & Fee */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{doctor.experience} years experience</span>
                  <span className="font-semibold text-primary-600">
                    ₹{doctor.consultationFee}
                  </span>
                </div>

                {/* Bio */}
                {doctor.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doctor.bio}</p>
                )}

                {/* Action Button */}
                <Link
                  to={`/appointments/book?doctorId=${doctor._id}`}
                  className="btn-primary w-full text-center block group-hover:shadow-lg transition-all"
                >
                  Book Appointment
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;

