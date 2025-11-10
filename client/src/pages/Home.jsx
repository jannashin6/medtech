import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Users, Calendar, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: MessageSquare,
      title: 'AI-Powered Chat',
      description: 'Get instant medical advice and symptom analysis from our intelligent AI assistant.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Users,
      title: 'Find Doctors',
      description: 'Browse through verified doctors, read reviews, and find the right specialist for you.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Calendar,
      title: 'Book Appointments',
      description: 'Schedule appointments with your preferred doctors at your convenience.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and stored securely with complete privacy.',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Smart Medical
            <span className="text-primary-600"> Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get AI-powered health insights, find the best doctors, and manage your appointments
            all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/chat" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                  Start Chatting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/doctors" className="btn-secondary text-lg px-8 py-3">
                  Find Doctors
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose MedTech?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience modern healthcare management with AI-powered assistance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:scale-105 transition-transform"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

