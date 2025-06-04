import React, { useState, useRef } from 'react';
import { FaUpload, FaDownload, FaLock, FaLockOpen, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FileEncryptionForm = ({ 
  mode, 
  setMode, 
  algorithm, 
  setAlgorithm, 
  encryptionKey, 
  setKey, 
  handleFileProcess, 
  isProcessing, 
  keyStrength 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    const result = await handleFileProcess(selectedFile, mode, algorithm, encryptionKey);
    if (result) {
      setProcessedFile(result);
    }
  };

  const downloadFile = () => {
    if (!processedFile) return;
    
    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    
    let downloadName = processedFile.name || '';
    const originalName = selectedFile?.name || '';
    const originalExt = originalName.split('.').pop();
    
    if (mode === 'encrypt') {
      // For encryption: add .enc before the original extension
      if (originalName) {
        const baseName = originalName.includes('.') 
          ? originalName.substring(0, originalName.lastIndexOf('.')) 
          : originalName;
        downloadName = `${baseName}.enc${originalName.includes('.') ? '.' + originalExt : ''}`;
      } else {
        downloadName = 'encrypted_file';
      }
    } else {
      // For decryption: remove .enc and restore original extension
      if (originalName.endsWith('.enc')) {
        downloadName = originalName.slice(0, -4);
      } else if (originalName.includes('.enc.')) {
        downloadName = originalName.replace('.enc', '');
      } else if (!downloadName) {
        downloadName = 'decrypted_file';
      }
    }
    
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getKeyStrengthColor = () => {
    if (keyStrength < 30) return 'bg-red-500';
    if (keyStrength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mode Selection Buttons */}
      <div className="flex p-1 mb-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('encrypt')}
          className={`flex-1 py-2.5 px-4 text-center font-medium transition-all rounded-lg ${
            mode === 'encrypt'
              ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <FaLockOpen className="inline mr-2" />
          Encrypt File
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('decrypt')}
          className={`flex-1 py-2.5 px-4 text-center font-medium transition-all rounded-lg ${
            mode === 'decrypt'
              ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <FaLock className="inline mr-2" />
          Decrypt File
        </motion.button>
      </div>

      <div className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select File
          </label>
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <FaUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
            </p>
            {selectedFile && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Encryption Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
          >
            <option value="aes">AES (Advanced Encryption Standard)</option>
            <option value="des">DES (Data Encryption Standard)</option>
            <option value="rc4">RC4 (Rivest Cipher 4)</option>
            <option value="rabbit">Rabbit</option>
          </select>
        </div>

        {/* Encryption Key */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Encryption Key
          </label>
          <div className="relative">
            <input
              type="password"
              value={encryptionKey}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your encryption key"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
            {encryptionKey && (
              <div className="mt-2">
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div 
                    className={`h-full ${getKeyStrengthColor()}`} 
                    style={{ width: `${keyStrength}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {keyStrength < 30 ? 'Weak' : keyStrength < 60 ? 'Medium' : 'Strong'} password
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isProcessing || !selectedFile}
          className={`flex-1 flex justify-center items-center space-x-2 px-6 py-3 bg-gradient-to-r ${
            mode === 'encrypt' 
              ? 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
              : 'from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
          } text-white rounded-xl shadow-md hover:shadow-lg transition-all ${
            (!selectedFile || isProcessing) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <>
              <FaSpinner className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {mode === 'encrypt' ? <FaLock className="w-5 h-5" /> : <FaLockOpen className="w-5 h-5" />}
              <span>{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} File</span>
            </>
          )}
        </motion.button>

        {processedFile && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={downloadFile}
            className="flex-1 flex justify-center items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <FaDownload className="w-5 h-5" />
            <span>Download File</span>
          </motion.button>
        )}
      </div>
    </form>
  );
};

export default FileEncryptionForm;