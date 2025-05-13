import { useState, useEffect } from 'react'
import './App.css'
import CryptoJS from 'crypto-js'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState('encrypt')
  const [algorithm, setAlgorithm] = useState('aes')
  const [key, setKey] = useState('')
  const [copied, setCopied] = useState(false)

  // Reset output when input, mode, algorithm, or key changes
  useEffect(() => {
    setOutputText('')
    setCopied(false)
  }, [inputText, mode, algorithm, key])

  // Existing state variables
  const [darkMode, setDarkMode] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [file, setFile] = useState(null);
  const [keyStrength, setKeyStrength] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);

  // New state variables for additional features
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState({});
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Add animated gradient background
  const gradientAnimation = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  // Add key strength calculator
  const calculateKeyStrength = (key) => {
    const lengthStrength = Math.min(key.length / 12, 1);
    const hasLowercase = /[a-z]/.test(key) ? 0.1 : 0;
    const hasUppercase = /[A-Z]/.test(key) ? 0.1 : 0;
    const hasNumbers = /[0-9]/.test(key) ? 0.1 : 0;
    const hasSymbols = /[^a-zA-Z0-9]/.test(key) ? 0.2 : 0;
    return Math.min((lengthStrength + hasLowercase + hasUppercase + hasNumbers + hasSymbols) * 100, 100);
  };

  // Enhanced handleProcess with loading state
  const handleProcess = async () => {
    setIsProcessing(true);
    const startTime = performance.now();

    if (!inputText && !file) {
      setIsProcessing(false);
      return;
    }

    try {
      let result = ''

      if (mode === 'encrypt') {
        switch (algorithm) {
          case 'aes':
            result = CryptoJS.AES.encrypt(inputText, key || 'default-key').toString()
            break
          case 'des':
            result = CryptoJS.DES.encrypt(inputText, key || 'default-key').toString()
            break
          case 'base64':
            result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(inputText))
            break
          case 'xor':
            // Simple XOR implementation
            const xorKey = key || 'default-key'
            result = [...inputText].map((char, i) => {
              return String.fromCharCode(char.charCodeAt(0) ^ xorKey.charCodeAt(i % xorKey.length))
            }).join('')
            // Convert to Base64 for readability
            result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(result))
            break
          case 'rc4':
            // New RC4 algorithm
            result = CryptoJS.RC4.encrypt(inputText, key || 'default-key').toString()
            break
          case 'rabbit':
            // New Rabbit algorithm
            result = CryptoJS.Rabbit.encrypt(inputText, key || 'default-key').toString()
            break
          default:
            result = 'Algorithm not implemented'
        }
      } else { // decrypt
        switch (algorithm) {
          case 'aes':
            result = CryptoJS.AES.decrypt(inputText, key || 'default-key').toString(CryptoJS.enc.Utf8)
            break
          case 'des':
            result = CryptoJS.DES.decrypt(inputText, key || 'default-key').toString(CryptoJS.enc.Utf8)
            break
          case 'base64':
            result = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(inputText))
            break
          case 'xor':
            // Decode Base64 first
            let decoded = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(inputText))
            // XOR decrypt
            const xorKey = key || 'default-key'
            result = [...decoded].map((char, i) => {
              return String.fromCharCode(char.charCodeAt(0) ^ xorKey.charCodeAt(i % xorKey.length))
            }).join('')
            break
          case 'rc4':
            // New RC4 algorithm
            result = CryptoJS.RC4.decrypt(inputText, key || 'default-key').toString(CryptoJS.enc.Utf8)
            break
          case 'rabbit':
            // New Rabbit algorithm
            result = CryptoJS.Rabbit.decrypt(inputText, key || 'default-key').toString(CryptoJS.enc.Utf8)
            break
          default:
            result = 'Algorithm not implemented'
        }
      }

      setOutputText(result)
    } catch (error) {
      setOutputText(`Error: ${error.message}`)
    } finally {
      const endTime = performance.now();
      setProcessingTime(endTime - startTime);
      setIsProcessing(false);

      // Update history
      setHistory(prev => [
        {
          mode,
          algorithm,
          timestamp: new Date().toISOString(),
          processingTime: endTime - startTime
        },
        ...prev.slice(0, 4)
      ]);
    }
  };

  // New function to compare algorithm performance
  const compareAlgorithms = async () => {
    if (!inputText) return;

    setIsProcessing(true);
    const results = {};
    const algorithms = ['aes', 'des', 'base64', 'xor', 'rc4', 'rabbit'];

    for (const algo of algorithms) {
      if (algo === 'base64' && mode === 'decrypt') continue;

      const start = performance.now();
      try {
        let result;
        if (mode === 'encrypt') {
          switch (algo) {
            case 'aes':
              result = CryptoJS.AES.encrypt(inputText, key || 'default-key').toString();
              break;
            case 'des':
              result = CryptoJS.DES.encrypt(inputText, key || 'default-key').toString();
              break;
            case 'base64':
              result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(inputText));
              break;
            case 'xor':
              const xorKey = key || 'default-key';
              result = [...inputText].map((char, i) => {
                return String.fromCharCode(char.charCodeAt(0) ^ xorKey.charCodeAt(i % xorKey.length));
              }).join('');
              result = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(result));
              break;
            case 'rc4':
              result = CryptoJS.RC4.encrypt(inputText, key || 'default-key').toString();
              break;
            case 'rabbit':
              result = CryptoJS.Rabbit.encrypt(inputText, key || 'default-key').toString();
              break;
          }
        } else {
          // Decrypt logic for comparison
          // (Similar to the decrypt logic in handleProcess)
        }
        const end = performance.now();
        results[algo] = {
          time: end - start,
          success: true,
          outputLength: result ? result.length : 0
        };
      } catch (error) {
        results[algo] = {
          time: 0,
          success: false,
          error: error.message
        };
      }
    }

    setComparisonResults(results);
    setShowComparison(true);
    setIsProcessing(false);
  };

  // New function to generate secure passwords
  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';

    let chars = '';
    if (includeLowercase) chars += lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === '') chars = lowercase + numbers; // Fallback

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setGeneratedPassword(password);
  };

  // Function to use generated password as key
  const useGeneratedPassword = () => {
    setKey(generatedPassword);
    setKeyStrength(calculateKeyStrength(generatedPassword));
    setShowPasswordGenerator(false);
  };

  // Function to export encrypted/decrypted data
  const exportData = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'encrypt' ? 'encrypted' : 'decrypted'}_data.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add file handler
  const handleFileRead = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setInputText(e.target.result);
      reader.readAsText(file);
      setFile(file);
    }
  };

  // Handle copy function
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-300 hover:shadow-blue-500/10">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.67 3.68 1.78 5.08L3 20.09l1.41 1.41 3.8-3.8A8.46 8.46 0 0012 20.25c4.55 0 8.25-3.69 8.25-8.25S16.55 3.75 12 3.75zm0 15c-3.73 0-6.75-3.02-6.75-6.75S8.27 5.25 12 5.25s6.75 3.02 6.75 6.75-3.02 6.75-6.75 6.75zM12 8.25c-.41 0-.75.34-.75.75v3c0 .41.34.75.75.75h3c.41 0 .75-.34.75-.75s-.34-.75-.75-.75h-2.25V9c0-.41-.34-.75-.75-.75z" />
              </svg>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">Secure Crypt</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-blue-100 bg-white/10 px-3 py-1 rounded-full">
                {algorithm.toUpperCase()}
              </span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Operation Mode
                  </label>
                  <div className="flex gap-3">
                    <button
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${mode === 'encrypt'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-400 ring-opacity-50'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow'} 
                    duration-200`}
                      onClick={() => setMode('encrypt')}
                    >
                      🔒 Encrypt
                    </button>
                    <button
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${mode === 'decrypt'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-400 ring-opacity-50'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow'} 
                    duration-200`}
                      onClick={() => setMode('decrypt')}
                    >
                      🔓 Decrypt
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cipher Algorithm
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white appearance-none pr-10 transition-all"
                      value={algorithm}
                      onChange={(e) => setAlgorithm(e.target.value)}
                    >
                      <option value="aes">AES (Advanced Encryption Standard)</option>
                      <option value="des">DES (Data Encryption Standard)</option>
                      <option value="rc4">RC4 (Rivest Cipher 4)</option>
                      <option value="rabbit">Rabbit Stream Cipher</option>
                      <option value="base64">Base64 Encoding</option>
                      <option value="xor">XOR Cipher</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {['aes', 'des', 'xor', 'rc4', 'rabbit'].includes(algorithm) && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Encryption Key
                    </label>
                    <button
                      onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Generate Key
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
                      placeholder="Enter secret passphrase"
                      value={key}
                      onChange={(e) => {
                        setKey(e.target.value);
                        setKeyStrength(calculateKeyStrength(e.target.value));
                      }}
                    />
                    {key && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Key Strength</span>
                          <span>{Math.round(keyStrength)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${keyStrength < 30 ? 'bg-red-500' : keyStrength < 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${keyStrength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Password Generator Modal */}
            {showPasswordGenerator && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Password Generator</h3>
                  <button
                    onClick={() => setShowPasswordGenerator(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Length: {passwordLength}</label>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeUppercase}
                        onChange={() => setIncludeUppercase(!includeUppercase)}
                        className="rounded text-blue-500 focus:ring-blue-400"
                      />
                      <span className="text-sm text-gray-600">Uppercase (A-Z)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={() => setIncludeLowercase(!includeLowercase)}
                        className="rounded text-blue-500 focus:ring-blue-400"
                      />
                      <span className="text-sm text-gray-600">Lowercase (a-z)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={() => setIncludeNumbers(!includeNumbers)}
                        className="rounded text-blue-500 focus:ring-blue-400"
                      />
                      <span className="text-sm text-gray-600">Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={() => setIncludeSymbols(!includeSymbols)}
                        className="rounded text-blue-500 focus:ring-blue-400"
                      />
                      <span className="text-sm text-gray-600">Symbols (!@#$)</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={generatePassword}
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex-1"
                    >
                      Generate
                    </button>
                    {generatedPassword && (
                      <button
                        onClick={useGeneratedPassword}
                        className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex-1"
                      >
                        Use This Password
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={generatedPassword} 
                      readOnly 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white font-mono text-sm"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPassword);
                        alert('Password copied to clipboard!');
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                      </svg>
                    </button>
                  </div>
                  
                  
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={generatePassword}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Generate Password
                    </button>
                    <button
                      onClick={useGeneratedPassword}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      disabled={!generatedPassword}
                    >
                      Use as Key
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {mode === 'encrypt' ? 'Text to Encrypt' : 'Text to Decrypt'}
              </label>
              <div className="relative">
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-[120px] transition-all"
                  placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1.5 1.5 0 01-3 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <input type="file" className="hidden" onChange={handleFileRead} accept=".txt" />
                  </label>
                  <button
                    onClick={() => setInputText('')}
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                    title="Clear input"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={handleProcess}
                disabled={!inputText || isProcessing}
                className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${!inputText || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'}`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {mode === 'encrypt' ? '🔒 Encrypt Data' : '🔓 Decrypt Data'}
                  </>
                )}
              </button>
              <button
                onClick={compareAlgorithms}
                disabled={!inputText || isProcessing}
                className="px-6 py-3 rounded-xl font-semibold text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Compare Algorithms
              </button>
            </div>

            {outputText && (
              <div className="mt-8 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    {mode === 'encrypt' ? 'Encrypted Result' : 'Decrypted Result'}
                  </label>
                  <div className="text-xs text-gray-500">
                    Processed in {processingTime.toFixed(2)}ms
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-[120px] bg-gray-50 font-mono text-sm transition-all"
                    value={outputText}
                    readOnly
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={handleCopy}
                      className={`${copied ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'} p-2 rounded-lg transition-colors flex items-center gap-1`}
                    >
                      {copied ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={exportData}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors text-gray-500 flex items-center gap-1"
                      title="Export as file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Export
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Algorithm Comparison Results */}
            {showComparison && (
              <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Algorithm Performance Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithm</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (ms)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output Size</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(comparisonResults).map(([algo, result]) => (
                        <tr key={algo}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{algo.toUpperCase()}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{result.time.toFixed(2)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {result.success ? `${result.outputLength} chars` : 'N/A'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {result.success ? (
                              <span className="text-green-600">Success</span>
                            ) : (
                              <span className="text-red-600" title={result.error}>Failed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setShowComparison(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* History Section */}
            {history.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Recent Operations
                </h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithm</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {history.map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                              {entry.mode === 'encrypt' ? '🔒 Encrypt' : '🔓 Decrypt'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                              {entry.algorithm.toUpperCase()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                              {entry.processingTime.toFixed(2)}ms
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        ${gradientAnimation}
        .bg-gradient-to-br {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </>
  )
}

export default App