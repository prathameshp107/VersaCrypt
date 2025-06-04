import { useState, useEffect, useCallback } from 'react';
import { 
  FaMoon, 
  FaSun, 
  FaKey, 
  FaHistory, 
  FaLock, 
  FaLockOpen, 
  FaExchangeAlt,
  FaBars,
  FaTimes,
  FaGithub,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';

// Components
import EncryptionForm from './components/encryption/EncryptionForm';
import PasswordGenerator from './components/password/PasswordGenerator';
import FileEncryptionForm from './components/file/FileEncryptionForm';

// Hooks
import useEncryption from './hooks/useEncryption';

// Assets
// import logo from './assets/logo.svg'; // You'll need to add a logo file

function App() {
  // State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [algorithm, setAlgorithm] = useState('aes');
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for dark mode preference
    return localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && 
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [processingTime, setProcessingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('encrypt');
  const [isFileMode, setIsFileMode] = useState(false);

  // Custom hooks
  const {
    processEncryption,
    calculateKeyStrength,
  } = useEncryption();

  // Calculate key strength
  const keyStrength = calculateKeyStrength(key);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Update localStorage
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [darkMode]);

  // Set initial theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Show toast message
  const showToastMessage = useCallback((message) => {
    setToastMessage(message);
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Handle encryption/decryption process
  const handleProcess = useCallback(async (options = {}) => {
    if (!inputText) {
      showToastMessage('Please enter some text to process');
      return;
    }
    
    if (mode === 'encrypt' && !key && algorithm !== 'lzstring') {
      showToastMessage('Please enter an encryption key');
      return;
    }
    
    setIsProcessing(true);
    const startTime = performance.now();
    
    try {
      let processedText = inputText;
      let lzMethod = 'compress';
      
      // Handle LZ-String specific options
      if (algorithm === 'lzstring') {
        lzMethod = options.method || 'compress';
        
        // If in decrypt mode and JSON parsing is enabled, try to parse the input
        if (mode === 'decrypt' && options.useJson) {
          try {
            const parsed = JSON.parse(processedText);
            processedText = parsed;
          } catch (e) {
            console.warn('Failed to parse JSON input, using raw text');
          }
        }
      }
      
      // Process the encryption/decryption
      const result = await processEncryption(
        processedText, 
        mode, 
        algorithm, 
        key || 'default-key',
        algorithm === 'lzstring' ? { lzMethod } : {}
      );
      
      if (result) {
        // If in encrypt mode and JSON mode is enabled, try to parse and format the output
        let displayResult = result;
        if (mode === 'encrypt' && algorithm === 'lzstring' && options.useJson) {
          try {
            displayResult = JSON.parse(result);
          } catch (e) {
            // If parsing fails, use the raw result
            console.warn('Failed to parse result as JSON, using raw output');
          }
        }
        
        setOutputText(displayResult);
        
        // Update history
        const endTime = performance.now();
        const processTime = endTime - startTime;
        setProcessingTime(processTime);
        
        // Add to history
        setHistory(prev => [
          {
            mode,
            algorithm: algorithm === 'lzstring' ? `LZ-String (${lzMethod})` : algorithm,
            timestamp: new Date().toISOString(),
            processingTime: processTime
          },
          ...prev.slice(0, 4)
        ]);
        
        showToastMessage(`${mode === 'encrypt' ? 'Encryption' : 'Decryption'} successful!`);
      } else {
        throw new Error('No result returned from encryption/decryption');
      }
    } catch (error) {
      console.error('Encryption error:', error);
      const errorMessage = error.message || 'An error occurred during processing';
      setOutputText(`Error: ${errorMessage}`);
      showToastMessage(`Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, mode, algorithm, key, processEncryption, showToastMessage]);

  // Handle file processing
  const handleFileProcess = useCallback(async (file, mode, algorithm, key) => {
    if (!file) {
      showToastMessage('Please select a file to process');
      return null;
    }
    
    if (mode === 'encrypt' && !key) {
      showToastMessage('Please enter an encryption key');
      return null;
    }
    
    setIsProcessing(true);
    const startTime = performance.now();
    
    try {
      // Read the file as an ArrayBuffer
      const fileBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
      
      // Convert ArrayBuffer to WordArray for CryptoJS
      const wordArray = CryptoJS.lib.WordArray.create(fileBuffer);
      
      // Process the encryption/decryption
      let result;
      let fileExtension = '';
      let fileName = '';
      
      if (mode === 'encrypt') {
        // Store the original file extension for later recovery
        const fileNameParts = file.name.split('.');
        fileExtension = fileNameParts.length > 1 ? `.${fileNameParts.pop()}` : '';
        fileName = fileNameParts.join('.');
        
        // Encrypt the file
        result = await processEncryption(
          wordArray, 
          mode, 
          algorithm, 
          key || 'default-key'
        );
        
        // Create a new Blob with the encrypted data
        const encryptedBlob = new Blob([result], { type: 'application/octet-stream' });
        encryptedBlob.name = `${fileName}.encrypted`;
        encryptedBlob.extension = '.encrypted';
        
        result = encryptedBlob;
      } else {
        // For decryption, we assume the file is an encrypted file
        // Decrypt the file
        result = await processEncryption(
          wordArray, 
          mode, 
          algorithm, 
          key || 'default-key'
        );
        
        // Try to extract the original file extension from the filename
        if (file.name.endsWith('.encrypted')) {
          fileName = file.name.replace('.encrypted', '');
        } else {
          fileName = `decrypted_${file.name}`;
        }
        
        // Create a new Blob with the decrypted data
        const decryptedBlob = new Blob([result], { type: 'application/octet-stream' });
        decryptedBlob.name = fileName;
        
        result = decryptedBlob;
      }
      
      // Update history
      const endTime = performance.now();
      const processTime = endTime - startTime;
      setProcessingTime(processTime);
      
      // Add to history
      setHistory(prev => [
        {
          mode,
          algorithm,
          timestamp: new Date().toISOString(),
          processingTime: processTime,
          fileName: file.name
        },
        ...prev.slice(0, 4)
      ]);
      
      showToastMessage(`File ${mode === 'encrypt' ? 'encryption' : 'decryption'} successful!`);
      return result;
    } catch (error) {
      console.error('File processing error:', error);
      const errorMessage = error.message || 'An error occurred during file processing';
      showToastMessage(`Error: ${errorMessage}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [processEncryption, showToastMessage]);

  // Handle copy to clipboard
  const handleCopy = useCallback(() => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    showToastMessage('Copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [outputText]);

  // Toggle password generator
  const togglePasswordGenerator = () => {
    setShowPasswordGenerator(!showPasswordGenerator);
  };

  // Handle password selection from generator
  const handlePasswordSelect = (password) => {
    setKey(password);
    showToastMessage('Password copied to key field!');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 sm:mb-12">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-opacity-20 hover:bg-gray-700 dark:hover:bg-white dark:hover:bg-opacity-10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              SecureCrypt
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setMode('encrypt');
                      setActiveTab('encrypt');
                      setIsFileMode(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all ${
                      activeTab === 'encrypt'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <FaLockOpen className="mr-2" />
                    <span className="font-medium">Encrypt</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setMode('decrypt');
                      setActiveTab('decrypt');
                      setIsFileMode(false);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all ${
                      activeTab === 'decrypt'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <FaLock className="mr-2" />
                    <span className="font-medium">Decrypt</span>
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab('file');
                    setIsFileMode(true);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center py-3 px-4 rounded-xl transition-all ${
                    activeTab === 'file'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <FaExchangeAlt className="mr-2" />
                  <span className="font-medium">File Encryption</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setShowPasswordGenerator(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <FaKey className="w-4 h-4" />
                  <span className="font-medium">Password Generator</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    encryptionKey={key}
                    setKey={setKey}
                    handleFileProcess={handleFileProcess}
                    isProcessing={isProcessing}
                    keyStrength={calculateKeyStrength(key)}
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
                    encryptionKey={key}
                    setKey={setKey}
                    handleProcess={handleProcess}
                    handleCopy={handleCopy}
                    copied={copied}
                    isProcessing={isProcessing}
                    keyStrength={calculateKeyStrength(key)}
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
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} SecureCrypt. All rights reserved.
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
}

export default App;      