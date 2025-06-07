import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserShield, FaLock, FaFileAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            About Our Encryption Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A secure and user-friendly application designed to protect your sensitive data using
            industry-standard encryption algorithms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FaShieldAlt className="text-blue-500 mr-3" />
              Security Features
            </h2>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li>• AES encryption for maximum security</li>
              <li>• LZ-String compression for efficient storage</li>
              <li>• Secure key management</li>
              <li>• File encryption support</li>
              <li>• Dark mode for reduced eye strain</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FaUserShield className="text-green-500 mr-3" />
              Privacy First
            </h2>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li>• Client-side encryption</li>
              <li>• No data storage on servers</li>
              <li>• Secure password generation</li>
              <li>• Local processing only</li>
              <li>• Open source and transparent</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FaLock className="text-purple-500 mr-3" />
              Encryption Methods
            </h2>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li>• AES (Advanced Encryption Standard)</li>
              <li>• LZ-String compression</li>
              <li>• Base64 encoding</li>
              <li>• Custom key generation</li>
              <li>• Multiple encryption modes</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FaFileAlt className="text-red-500 mr-3" />
              File Support
            </h2>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li>• Support for all file types</li>
              <li>• Large file handling</li>
              <li>• Batch processing</li>
              <li>• Progress tracking</li>
              <li>• Secure file download</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About; 