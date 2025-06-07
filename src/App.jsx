import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import CryptoJS from 'crypto-js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Components
import Navigation from './components/Navigation';
import EncryptionForm from './components/encryption/EncryptionForm';
import PasswordGenerator from './components/password/PasswordGenerator';
import FileEncryptionForm from './components/file/FileEncryptionForm';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import EncryptionPage from './pages/EncryptionPage';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const storedHistory = localStorage.getItem('encryptionHistory');
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      return [];
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('encrypt');
  const [isFileMode, setIsFileMode] = useState(false);

  // Custom hooks
  const {
    processEncryption,
    calculateKeyStrength,
  } = useEncryption();

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

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('encryptionHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

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
          } catch {
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
          } catch {
            console.warn('Failed to parse result as JSON, using raw output');
          }
        }
        
        setOutputText(displayResult);
        
        // Update history
        const endTime = performance.now();
        const processTime = endTime - startTime;
        
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
      
      // Convert ArrayBuffer to base64 for encryption
      const base64Data = arrayBufferToBase64(fileBuffer);
      
      // Process the encryption/decryption
      let result;
      let fileName = file.name;
      
      if (mode === 'encrypt') {
        // Encrypt the base64 data
        const encryptedData = await processEncryption(
          base64Data, 
          mode, 
          algorithm, 
          key || 'default-key'
        );
        
        // Convert the encrypted string back to a Uint8Array
        const encryptedBytes = base64ToArrayBuffer(encryptedData);
        
        // Create a new Blob with the encrypted data
        const encryptedBlob = new Blob([encryptedBytes], { type: 'application/octet-stream' });
        encryptedBlob.name = `${fileName}.enc`;
        result = encryptedBlob;
      } else {
        // For decryption
        // Decrypt the base64 data
        const decryptedBase64 = await processEncryption(
          base64Data, 
          mode, 
          algorithm, 
          key || 'default-key'
        );
        
        // Convert the decrypted base64 back to a Uint8Array
        const decryptedBytes = base64ToArrayBuffer(decryptedBase64);
        
        // Create a new Blob with the decrypted data
        const decryptedBlob = new Blob(
          [decryptedBytes], 
          { type: 'application/octet-stream' }
        );
        
        // Set the original filename by removing the .enc extension
        if (fileName.endsWith('.enc')) {
          fileName = fileName.slice(0, -4);
        }
        
        decryptedBlob.name = fileName;
        result = decryptedBlob;
      }
      
      // Helper function to convert ArrayBuffer to base64
      function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      }
      
      // Helper function to convert base64 to ArrayBuffer
      function base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }
      
      // Update history
      const endTime = performance.now();
      const processTime = endTime - startTime;
      
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
  }, [outputText, showToastMessage]);

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
          <Navigation 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<EncryptionPage 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                    mode={mode}
                    setMode={setMode}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isFileMode={isFileMode}
                setIsFileMode={setIsFileMode}
                showPasswordGenerator={showPasswordGenerator}
                setShowPasswordGenerator={setShowPasswordGenerator}
                history={history}
                    inputText={inputText}
                    setInputText={setInputText}
                    outputText={outputText}
                    algorithm={algorithm}
                    setAlgorithm={setAlgorithm}
                encryptionKey={key}
                    setKey={setKey}
                    handleProcess={handleProcess}
                    handleCopy={handleCopy}
                    copied={copied}
                    isProcessing={isProcessing}
                calculateKeyStrength={calculateKeyStrength}
                handleFileProcess={handleFileProcess}
                showToastMessage={showToastMessage}
                showToast={showToast}
                toastMessage={toastMessage}
              />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
        </main>
          </div>
      </div>
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default App;      