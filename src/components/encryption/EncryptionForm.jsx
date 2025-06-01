import React, { useState, useEffect } from 'react';
import { FaCopy, FaLock, FaKey, FaShieldAlt, FaArrowRight, FaLockOpen, FaInfoCircle, FaRandom } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { generate } from 'generate-password-browser';
import { toast } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const EncryptionForm = ({
  inputText,
  setInputText,
  outputText,
  mode,
  setMode,
  algorithm,
  setAlgorithm,
  encryptionKey,
  setKey,
  handleProcess,
  handleCopy,
  copied,
  isProcessing,
  keyStrength
}) => {
  const [lzMethod, setLzMethod] = useState('compress');
  const [useJson, setUseJson] = useState(false);
  const algorithms = [
  { 
    value: 'aes', 
    label: 'AES-256', 
    icon: <FaShieldAlt className="text-indigo-500" />,
    description: 'Industry standard symmetric encryption',
    strength: 'Strong',
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    value: 'des', 
    label: 'DES', 
    icon: <FaShieldAlt className="text-blue-500" />,
    description: 'Legacy symmetric encryption',
    strength: 'Weak',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    value: 'base64', 
    label: 'Base64', 
    icon: <FaShieldAlt className="text-green-500" />,
    description: 'Encoding, not encryption',
    strength: 'None',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    value: 'xor', 
    label: 'XOR', 
    icon: <FaShieldAlt className="text-yellow-500" />,
    description: 'Basic bitwise operation',
    strength: 'Very Weak',
    color: 'from-yellow-500 to-amber-500'
  },
  { 
    value: 'rc4', 
    label: 'RC4', 
    icon: <FaShieldAlt className="text-red-500" />,
    description: 'Stream cipher with known vulnerabilities',
    strength: 'Weak',
    color: 'from-red-500 to-pink-500'
  },
  { 
    value: 'rabbit', 
    label: 'Rabbit', 
    icon: <FaShieldAlt className="text-purple-500" />,
    description: 'High-speed stream cipher',
    strength: 'Strong',
    color: 'from-purple-500 to-fuchsia-500'
  },
  { 
    value: 'lzstring', 
    label: 'LZ-String', 
    icon: <FaShieldAlt className="text-pink-500" />,
    description: 'Compression, not encryption',
    strength: 'None',
    color: 'from-pink-500 to-rose-500'
  },
];

  const lzStringMethods = [
    { 
      value: 'compress', 
      label: mode === 'encrypt' ? 'Compress' : 'Decompress',
      description: 'Standard compression/decompression',
      icon: '🔒'
    },
    { 
      value: 'compressToUTF16', 
      label: mode === 'encrypt' ? 'UTF-16' : 'From UTF-16',
      description: 'UTF-16 string encoding',
      icon: '🔡'
    },
    { 
      value: 'compressToBase64', 
      label: mode === 'encrypt' ? 'To Base64' : 'From Base64',
      description: 'Base64 encoded output/input',
      icon: '🔣'
    },
    { 
      value: 'compressToEncodedURIComponent', 
      label: mode === 'encrypt' ? 'To URI' : 'From URI',
      description: 'URL-safe encoding',
      icon: '🔗'
    },
    { 
      value: 'compressToUint8Array', 
      label: mode === 'encrypt' ? 'To Binary' : 'From Binary',
      description: 'Binary data format',
      icon: '💾'
    },
  ];
  
  // Generate a secure random key
  const generateRandomKey = () => {
    const randomKey = generate({
      length: 32,
      numbers: true,
      symbols: true,
      uppercase: true,
      strict: true,
    });
    setKey(randomKey);
    toast.success('Generated secure random key');
  };
  
  // Get key strength color and text
  const getKeyStrengthInfo = (strength) => {
    if (strength < 30) return { color: 'bg-red-500', text: 'Weak' };
    if (strength < 70) return { color: 'bg-yellow-500', text: 'Moderate' };
    return { color: 'bg-green-500', text: 'Strong' };
  };
  
  const keyStrengthInfo = getKeyStrengthInfo(keyStrength);

  // Auto-focus input on mount
  useEffect(() => {
    const inputElement = document.getElementById('input-text');
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  // Toggle between encrypt and decrypt mode
  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'encrypt' ? 'decrypt' : 'encrypt';
      // Reset LZ method when switching modes to avoid confusion
      setLzMethod('compress');
      return newMode;
    });
  };

  const [isAlgoOpen, setIsAlgoOpen] = useState(false);
  const [isLzOpen, setIsLzOpen] = useState(false);
  const selectedAlgo = algorithms.find(a => a.value === algorithm);
  const selectedLz = lzStringMethods.find(m => m.value === lzMethod) || lzStringMethods[0];

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Encryption Algorithm
          </label>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${selectedAlgo?.color?.replace('from-', 'bg-').split(' ')[0]}/10 text-${selectedAlgo?.color?.split('-')[1]}-600 dark:text-${selectedAlgo?.color?.split('-')[1]}-300`}>
            {selectedAlgo?.strength}
          </span>
        </div>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsAlgoOpen(!isAlgoOpen)}
            disabled={isProcessing}
            className={`relative w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-gray-600'}`}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${selectedAlgo?.color?.replace('from-', 'bg-gradient-to-r ')}`}>
                {selectedAlgo?.icon}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">{selectedAlgo?.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{selectedAlgo?.description}</div>
              </div>
            </div>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className={`h-5 w-5 text-gray-400 transition-transform ${isAlgoOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>

          <AnimatePresence>
            {isAlgoOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="max-h-60 overflow-y-auto py-1">
                  {algorithms.map((algo) => (
                    <div
                      key={algo.value}
                      className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${algorithm === algo.value ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                      onClick={() => {
                        setAlgorithm(algo.value);
                        setIsAlgoOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center mr-3 ${algo.color.replace('from-', 'bg-gradient-to-r ')}`}>
                          {algo.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{algo.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{algo.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* LZ-String Method Selection */}
      {algorithm === 'lzstring' && (
        <div className="space-y-2">
          <label htmlFor="lzMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            LZ-String Method
          </label>
          <div className="relative">
            <select
              id="lzMethod"
              value={lzMethod || 'compress'}
              onChange={(e) => setLzMethod(e.target.value)}
              disabled={isProcessing}
              className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              {lzStringMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* JSON Toggle */}
          <div className="flex items-center mt-2">
            <button
              type="button"
              onClick={() => setUseJson(!useJson)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${useJson ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
              role="switch"
              aria-checked={useJson}
            >
              <span className="sr-only">Use JSON {useJson ? 'parse' : 'stringify'}</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  useJson ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="ml-3 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {useJson ? 'JSON Mode' : 'Text Mode'}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {' '}({useJson ? 'Auto ' + (mode === 'encrypt' ? 'stringify' : 'parse') : 'Raw text'})
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Encryption Key */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === 'encrypt' ? 'Encryption Key' : 'Decryption Key'}
          </label>
          <div className="flex items-center space-x-3">
            {mode === 'encrypt' && keyStrength > 0 && (
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
                  {keyStrength < 30 ? 'Weak' : keyStrength < 70 ? 'Good' : 'Strong'}
                </span>
                <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getKeyStrengthInfo(keyStrength).color} transition-all duration-300`}
                    style={{ width: `${keyStrength}%` }}
                  />
                </div>
              </div>
            )}
            {mode === 'encrypt' && (
              <button
                type="button"
                onClick={generateRandomKey}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center"
                title="Generate secure key"
              >
                <FaRandom className="mr-1" /> Generate
              </button>
            )}
          </div>
        </div>
        
        <div className="relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaKey className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="key"
            type={mode === 'encrypt' ? 'text' : 'password'}
            value={encryptionKey}
            onChange={(e) => setKey(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Enter or generate an encryption key' : 'Enter the decryption key'}
            disabled={isProcessing}
            autoComplete="off"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          />
        </div>
      </div>

      {/* Input Text */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === 'encrypt' ? 'Plain Text' : 'Encrypted Text'}
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {inputText.length} characters
            </span>
            <button
              type="button"
              onClick={() => setInputText('')}
              disabled={!inputText || isProcessing}
              className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear input"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <textarea
            id="input-text"
            rows={6}
            className="relative block w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            placeholder={mode === 'encrypt' ? 'Enter your secret message here...' : 'Paste the encrypted text here...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            style={{ minHeight: '150px' }}
          />
          {!inputText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-4 max-w-xs">
                <div className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {mode === 'encrypt' 
                    ? 'Type your message to encrypt' 
                    : 'Paste the text you want to decrypt'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Process Button */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <motion.button
            type="button"
            onClick={() => {
              if (algorithm === 'lzstring') {
                handleProcess({
                  method: lzMethod,
                  useJson: useJson
                });
              } else {
                handleProcess();
              }
            }}
            disabled={!inputText || !encryptionKey || isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`inline-flex items-center px-8 py-3.5 border-0 text-base font-semibold rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
              (!inputText || !encryptionKey || isProcessing) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Processing...
                </span>
              </>
            ) : (
              <>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  {mode === 'encrypt' ? 'Encrypt Message' : 'Decrypt Message'}
                </span>
                <FaArrowRight className="ml-3 -mr-1 h-4 w-4 text-white" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Output Text */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === 'encrypt' ? 'Encrypted Text' : 'Decrypted Text'}
          </label>
          <div className="flex items-center space-x-2">
            {outputText && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {outputText.length} characters
              </span>
            )}
            <button
              type="button"
              onClick={() => handleCopy(outputText)}
              disabled={!outputText}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                !outputText ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {copied ? (
                <>
                  <svg className="h-3.5 w-3.5 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <FaCopy className="h-3 w-3 mr-1.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <textarea
            id="output-text"
            rows={6}
            readOnly
            className="relative block w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            placeholder={mode === 'encrypt' ? 'Your encrypted message will appear here...' : 'Your decrypted message will appear here...'}
            value={outputText}
            style={{ minHeight: '150px' }}
          />
          {!outputText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-4 max-w-xs">
                <div className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {mode === 'encrypt' 
                    ? 'Click the encrypt button to see the result' 
                    : 'Enter the encrypted text and key above to decrypt'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncryptionForm;
