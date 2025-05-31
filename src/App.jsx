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
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import EncryptionForm from './components/encryption/EncryptionForm';
import PasswordGenerator from './components/password/PasswordGenerator';

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
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              SecureCrypt
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
            <button
              onClick={() => setShowPasswordGenerator(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaKey />
              <span>Password Generator</span>
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
            >
              <div className="p-4 space-y-4">
                <button
                  onClick={() => {
                    setShowPasswordGenerator(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaKey />
                  <span>Password Generator</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setMode('encrypt');
                      setActiveTab('encrypt');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'encrypt' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    <FaLockOpen className="inline mr-2" />
                    Encrypt
                  </button>
                  <button
                    onClick={() => {
                      setMode('decrypt');
                      setActiveTab('decrypt');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'decrypt' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                  >
                    <FaLock className="inline mr-2" />
                    Decrypt
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Encryption Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setMode('encrypt');
                    setActiveTab('encrypt');
                  }}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'encrypt' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  <FaLockOpen className="inline mr-2" />
                  Encrypt
                </button>
                <button
                  onClick={() => {
                    setMode('decrypt');
                    setActiveTab('decrypt');
                  }}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'decrypt' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  <FaLock className="inline mr-2" />
                  Decrypt
                </button>
              </div>
              
              <div className="p-6">
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
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <FaHistory className="text-blue-500" />
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[500px]">
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all cursor-pointer"
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
                              {item.algorithm}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                            {item.processingTime.toFixed(2)}ms
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
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} SecureCrypt. All rights reserved.</p>
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
