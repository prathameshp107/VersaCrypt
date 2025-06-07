import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

const Contact = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Connect With Us
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find us on social media and connect with our community!
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Social Media
            </h2>
            
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/prathameshp107"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors transform hover:scale-110"
              >
                <FaGithub className="w-8 h-8" />
              </a>
              <a
                href="https://twitter.com/prathameshp107"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors transform hover:scale-110"
              >
                <FaTwitter className="w-8 h-8" />
              </a>
              <a
                href="https://linkedin.com/in/prathameshp107"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors transform hover:scale-110"
              >
                <FaLinkedin className="w-8 h-8" />
              </a>
              <a
                href="https://instagram.com/prathameshp107"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors transform hover:scale-110"
              >
                <FaInstagram className="w-8 h-8" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 