import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaLockOpen, FaExchangeAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Secure Your Data
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            A powerful encryption and decryption tool that helps you protect your sensitive information
            with state-of-the-art algorithms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="text-blue-500 dark:text-blue-400 text-4xl mb-4">
              <FaLock />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Encryption
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Secure your data with advanced encryption algorithms including AES and LZ-String compression.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="text-green-500 dark:text-green-400 text-4xl mb-4">
              <FaLockOpen />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Decryption
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easily decrypt your data with the same powerful algorithms used for encryption.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="text-purple-500 dark:text-purple-400 text-4xl mb-4">
              <FaExchangeAlt />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              File Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Encrypt and decrypt files of any size with our secure file processing system.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home; 