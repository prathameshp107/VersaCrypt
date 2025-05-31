import React from 'react';
import { FaCopy, FaLock, FaKey, FaShieldAlt, FaArrowRight, FaLockOpen } from 'react-icons/fa';

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
  const algorithms = [
    { value: 'aes', label: 'AES-256', icon: <FaShieldAlt className="mr-2" /> },
    { value: 'des', label: 'DES', icon: <FaShieldAlt className="mr-2" /> },
    { value: 'base64', label: 'Base64', icon: <FaShieldAlt className="mr-2" /> },
    { value: 'xor', label: 'XOR', icon: <FaShieldAlt className="mr-2" /> },
    { value: 'rc4', label: 'RC4', icon: <FaShieldAlt className="mr-2" /> },
    { value: 'rabbit', label: 'Rabbit', icon: <FaShieldAlt className="mr-2" /> },
    { value: 'lzstring', label: 'LZ-String', icon: <FaShieldAlt className="mr-2" /> },
  ];

  const getKeyStrengthColor = (strength) => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="space-y-2">
        <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Encryption Algorithm
        </label>
        <div className="relative">
          <select
            id="algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isProcessing}
            className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          >
            {algorithms.map((algo) => (
              <option key={algo.value} value={algo.value} className="flex items-center">
                {algo.icon}
                {algo.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Encryption Key */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Encryption Key
          </label>
          {mode === 'encrypt' && keyStrength > 0 && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Strength: {Math.round(keyStrength)}%
            </span>
          )}
        </div>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaKey className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="key"
            type={mode === 'encrypt' ? 'text' : 'password'}
            value={encryptionKey}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your encryption key"
            disabled={isProcessing}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
        </div>
        {mode === 'encrypt' && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${getKeyStrengthColor(keyStrength)} transition-all duration-300`}
              style={{ width: `${keyStrength}%` }}
            />
          </div>
        )}
      </div>

      {/* Input Text */}
      <div className="space-y-2">
        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {mode === 'encrypt' ? 'Text to Encrypt' : 'Text to Decrypt'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
            {mode === 'encrypt' ? (
              <FaLockOpen className="h-4 w-4 text-gray-400" />
            ) : (
              <FaLock className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <textarea
            id="input-text"
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter the text you want to ${mode}...`}
            disabled={isProcessing}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
          />
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={isProcessing || !inputText}
        className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed ${isProcessing ? 'cursor-wait' : ''}`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <FaArrowRight className="mr-2" />
            {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
          </>
        )}
      </button>

      {/* Output Text */}
      {outputText && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === 'encrypt' ? 'Encrypted Text' : 'Decrypted Text'}
            </label>
            <button
              onClick={handleCopy}
              disabled={!outputText || copied}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm transition-colors duration-200 ${
                copied 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                  : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
              }`}
            >
              <FaCopy className="mr-1.5 h-3.5 w-3.5" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="relative">
            <textarea
              readOnly
              rows={6}
              value={outputText}
              className="block w-full px-3 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none font-mono text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {mode === 'encrypt' ? (
                <FaLock className="h-4 w-4 text-gray-400" />
              ) : (
                <FaLockOpen className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptionForm;
