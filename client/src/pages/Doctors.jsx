import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Star, MapPin, Clock, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
          <p className="text-gray-600">Browse through our verified medical professionals</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>
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
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

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
                className="card hover:shadow-lg transition-shadow"
              >
                {/* Doctor Image */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
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
                    <h3 className="text-xl font-semibold text-gray-900">
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
                  className="btn-primary w-full text-center block"
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

