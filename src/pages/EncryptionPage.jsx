import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMoon, 
  FaSun, 
  FaKey, 
  FaHistory, 
  FaLock, 
  FaLockOpen, 
  FaExchangeAlt,
  FaTimes,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaBars 
} from 'react-icons/fa';

// Components
import EncryptionForm from '../components/encryption/EncryptionForm';
import PasswordGenerator from '../components/password/PasswordGenerator';
import FileEncryptionForm from '../components/file/FileEncryptionForm';

const EncryptionPage = ({
  darkMode,
  toggleDarkMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  mode,
  setMode,
  activeTab,
  setActiveTab,
  isFileMode,
  setIsFileMode,
  showPasswordGenerator,
  setShowPasswordGenerator,
  history,
  inputText,
  setInputText,
  outputText,
  algorithm,
  setAlgorithm,
  encryptionKey,
  setKey,
  handleProcess,
  handleCopy,
  copied,
  isProcessing,
  calculateKeyStrength,
  handleFileProcess,
  showToastMessage,
  showToast,
  toastMessage
}) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 sm:mb-12">
          <div className="flex items-center space-x-3">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              VersaCrypt
            </motion.h1>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 shadow-sm hover:shadow-md transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <FaMoon className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPasswordGenerator(true)}
              className="hidden md:flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaKey className="w-4 h-4" />
              <span className="font-medium">Password Generator</span>
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Encryption Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transition-all hover:shadow-2xl hover:-translate-y-0.5"
            >
              {/* Tab Navigation */}
              <div className="flex p-1.5 m-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMode('encrypt');
                    setActiveTab('encrypt');
                    setIsFileMode(false);
                  }}
                  className={`flex-1 py-3 px-6 text-center font-medium transition-all rounded-xl ${
                    activeTab === 'encrypt'
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <FaLockOpen className="inline mr-2" />
                  <span className="font-medium">Encrypt</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMode('decrypt');
                    setActiveTab('decrypt');
                    setIsFileMode(false);
                  }}
                  className={`flex-1 py-3 px-6 text-center font-medium transition-all rounded-xl ${
                    activeTab === 'decrypt'
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <FaLock className="inline mr-2" />
                  <span className="font-medium">Decrypt</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab('file');
                    setIsFileMode(true);
                  }}
                  className={`flex-1 py-3 px-6 text-center font-medium transition-all rounded-xl ${
                    activeTab === 'file'
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <FaExchangeAlt className="inline mr-2" />
                  <span className="font-medium">File</span>
                </motion.button>
              </div>
              
              <div className="p-6">
                {isFileMode ? (
                  <FileEncryptionForm
                    mode={mode}
                    setMode={setMode}
                    algorithm={algorithm}
                    setAlgorithm={setAlgorithm}
                    encryptionKey={encryptionKey}
                    setKey={setKey}
                    handleFileProcess={handleFileProcess}
                    isProcessing={isProcessing}
                    keyStrength={calculateKeyStrength(encryptionKey)}
                  />
                ) : (
                  <EncryptionForm
                    inputText={inputText}
                    setInputText={setInputText}
                    outputText={outputText}
                    mode={mode}
                    setMode={setMode}
                    algorithm={algorithm}
                    setAlgorithm={setAlgorithm}
                    encryptionKey={encryptionKey}
                    setKey={setKey}
                    handleProcess={handleProcess}
                    handleCopy={handleCopy}
                    copied={copied}
                    isProcessing={isProcessing}
                    keyStrength={calculateKeyStrength(encryptionKey)}
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden h-full border border-gray-200/50 dark:border-gray-700/50 transition-all hover:shadow-2xl hover:-translate-y-0.5"
            >
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Recent Activity
                  </h2>
                  <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">
                    <FaHistory className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group p-4 bg-white/50 dark:bg-gray-700/30 rounded-xl hover:bg-white dark:hover:bg-gray-700/50 transition-all cursor-pointer border border-gray-100 dark:border-gray-700/50 hover:border-indigo-100 dark:hover:border-indigo-900/50"
                        onClick={() => {
                          if (item.mode === 'encrypt') {
                            setInputText(outputText);
                            setMode('decrypt');
                            setActiveTab('decrypt');
                          } else {
                            setInputText(outputText);
                            setMode('encrypt');
                            setActiveTab('encrypt');
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium flex items-center">
                              {item.mode === 'encrypt' ? (
                                <FaLockOpen className="inline mr-2 text-green-500" />
                              ) : (
                                <FaLock className="inline mr-2 text-blue-500" />
                              )}
                              <span className="text-gray-900 dark:text-white">{item.algorithm}</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                            {parseFloat(item.processingTime).toFixed(2)}ms
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FaLock className="mx-auto text-4xl mb-4 opacity-30" />
                    <p>Your {mode}ion history will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-4 mb-2">
              <a href="https://github.com/prathameshp107" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/prathameshp107" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/prathameshp107" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} VersaCrypt. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Password Generator Modal */}
      <AnimatePresence>
        {showPasswordGenerator && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPasswordGenerator(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Password Generator</h3>
                  <button
                    onClick={() => setShowPasswordGenerator(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <PasswordGenerator 
                  show={showPasswordGenerator}
                  onPasswordSelect={(password) => {
                    setKey(password);
                    setShowPasswordGenerator(false);
                    showToastMessage('Password copied to key field!');
                  }} 
                  onClose={() => setShowPasswordGenerator(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EncryptionPage; 