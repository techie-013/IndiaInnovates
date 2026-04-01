import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          <HiHome className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;