import { useState, useEffect, useCallback } from 'react';
import { FaMoon, FaSun, FaKey, FaHistory } from 'react-icons/fa';

// Components
import EncryptionForm from './components/encryption/EncryptionForm';
import PasswordGenerator from './components/password/PasswordGenerator';

// Hooks
import useEncryption from './hooks/useEncryption';

function App() {
  // State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [algorithm, setAlgorithm] = useState('aes');
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [processingTime, setProcessingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);

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
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  }, [darkMode]);

  // Handle encryption/decryption process
  const handleProcess = useCallback(async () => {
    if (!inputText) return;
    
    setIsProcessing(true);
    const startTime = performance.now();
    
    try {
      const result = await processEncryption(inputText, mode, algorithm, key || 'default-key');
      setOutputText(result);
      
      // Update history
      const endTime = performance.now();
      const processTime = endTime - startTime;
      setProcessingTime(processTime);
      setHistory(prev => [
        {
          mode,
          algorithm,
          timestamp: new Date().toISOString(),
          processingTime: processTime
        },
        ...prev.slice(0, 4)
      ]);
    } catch (error) {
      console.error('Encryption error:', error);
      setOutputText(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, mode, algorithm, key, processEncryption]);

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

  // Show toast message
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Toggle password generator
  const togglePasswordGenerator = () => {
    setShowPasswordGenerator(!showPasswordGenerator);
  };

  // Handle password selection from generator
  const handlePasswordSelect = (password) => {
    setKey(password);
    showToastMessage('Password copied to key field!');
  };

  // Set up dark mode on initial load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      {/* Navigation */}
      {/* Enhanced Navigation Bar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  VersaCrypt
                </span>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800">
                  v1.0
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePasswordGenerator}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white
                  shadow-sm hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800"
              >
                <FaKey className="mr-2" />
                Generate Password
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-all duration-200
                  text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <FaSun size={20} className="text-yellow-400" />
                ) : (
                  <FaMoon size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Encryption/Decryption Card */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">
                  Secure {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
                </h2>
                <div className="inline-flex rounded-lg p-1 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setMode('encrypt')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      mode === 'encrypt'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <span className={`flex items-center ${mode === 'encrypt' ? 'font-semibold' : ''}`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={mode === 'encrypt' ? 2.5 : 2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Encrypt
                    </span>
                  </button>
                  <button
                    onClick={() => setMode('decrypt')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      mode === 'decrypt'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <span className={`flex items-center ${mode === 'decrypt' ? 'font-semibold' : ''}`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={mode === 'decrypt' ? 2.5 : 2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      Decrypt
                    </span>
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {mode === 'encrypt' 
                  ? 'Securely encrypt your sensitive information with military-grade encryption.'
                  : 'Decrypt your encrypted data using the same key that was used for encryption.'}
              </p>
            </div>
            <div className="p-6">
              <EncryptionForm
                mode={mode}
                setMode={setMode}
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                keyValue={key}
                setKey={setKey}
                keyStrength={keyStrength}
                inputText={inputText}
                setInputText={setInputText}
                outputText={outputText}
                isProcessing={isProcessing}
                onProcess={handleProcess}
                onCopy={handleCopy}
                copied={copied}
              />
            </div>
            {processingTime > 0 && (
              <div className="px-6 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                Processed in {processingTime.toFixed(2)}ms
              </div>
            )}
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/30">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaHistory className="mr-3 text-blue-500" />
                  Recent Activity
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    {history.length} {history.length === 1 ? 'entry' : 'entries'}
                  </span>
                </h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {history.map((item, index) => {
                  const isEncrypt = item.mode === 'encrypt';
                  return (
                  <div key={index} className="group p-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-lg ${
                          isEncrypt 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {isEncrypt ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {isEncrypt ? 'Text Encrypted' : 'Text Decrypted'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.algorithm.toUpperCase()} • {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:pl-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          isEncrypt 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {item.processingTime.toFixed(0)} ms
                        </span>
                        <button className="p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="inline-flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isEncrypt ? 'Encryption' : 'Decryption'} completed
                      </span>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Password Generator Modal */}
      <PasswordGenerator
        show={showPasswordGenerator}
        onClose={togglePasswordGenerator}
        onSelect={handlePasswordSelect}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between min-w-64">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
