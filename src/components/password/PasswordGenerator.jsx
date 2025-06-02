import React, { useCallback, useState } from 'react';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';

const PasswordGenerator = ({ show, onClose, onPasswordSelect }) => {
  const {
    passwordLength,
    setPasswordLength,
    includeSymbols,
    setIncludeSymbols,
    includeNumbers,
    setIncludeNumbers,
    includeLowercase,
    setIncludeLowercase,
    includeUppercase,
    setIncludeUppercase,
    generatedPassword,
    generatePassword,
  } = usePasswordGenerator();

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!generatedPassword) return null;
    const typesUsed = [includeSymbols, includeNumbers, includeLowercase, includeUppercase].filter(Boolean).length;
    if (passwordLength >= 16 && typesUsed >= 3) return { text: 'Strong', color: 'bg-green-500' };
    if (passwordLength >= 12 && typesUsed >= 2) return { text: 'Moderate', color: 'bg-yellow-500' };
    return { text: 'Weak', color: 'bg-red-500' };
  };

  // Handle password generation
  const handleGenerate = useCallback(() => {
    if (!includeSymbols && !includeNumbers && !includeLowercase && !includeUppercase) {
      setError('Please select at least one character type.');
      return;
    }
    setError('');
    generatePassword();
  }, [generatePassword, includeSymbols, includeNumbers, includeLowercase, includeUppercase]);

  // Handle password selection
  const handleUsePassword = useCallback(() => {
    if (generatedPassword && onPasswordSelect) {
      onPasswordSelect(generatedPassword);
      onClose?.();
    }
  }, [generatedPassword, onPasswordSelect, onClose]);

  // Handle copy to clipboard
  const handleCopy = useCallback(() => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = generatedPassword;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [generatedPassword]);

  // Handle close action (button, icon, or backdrop)
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      console.warn('onClose prop is not provided or not functioning.');
    }
  }, [onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const strength = getPasswordStrength();

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 p-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-labelledby="password-generator-title"
          aria-modal="true"
        >
          <div
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 transform"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 id="password-generator-title" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Password Generator
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Create a strong, secure password
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 space-y-6">
              {/* Generated Password Display */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">GENERATED PASSWORD</span>
                    {strength && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${strength.color}/10 text-${strength.color.replace('bg-', '')} border border-${strength.color.replace('bg-', '')}/20`}>
                        {strength.text}
                      </span>
                    )}
                  </div>
                  {generatedPassword && (
                    <button
                      onClick={handleCopy}
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={generatedPassword || 'Click Generate'}
                    readOnly
                    className="w-full bg-transparent border-0 text-xl font-mono font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 p-0"
                    aria-label="Generated password"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                </div>
              </div>

              {/* Password Length Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password Length
                  </label>
                  <span className="text-sm font-mono font-bold bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded">
                    {passwordLength}
                  </span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={50}
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={`Password length: ${passwordLength}`}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>8</span>
                  <span>50</span>
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Character Types</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center p-3 rounded-lg transition-all duration-200 ${includeUppercase ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'}`}>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        aria-checked={includeUppercase}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">Uppercase</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">A B C D E F G</p>
                    </div>
                  </label>

                  <label className={`flex items-center p-3 rounded-lg transition-all duration-200 ${includeLowercase ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'}`}>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        aria-checked={includeLowercase}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">Lowercase</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">a b c d e f g</p>
                    </div>
                  </label>

                  <label className={`flex items-center p-3 rounded-lg transition-all duration-200 ${includeNumbers ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'}`}>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        aria-checked={includeNumbers}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">Numbers</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">0 1 2 3 4 5 6</p>
                    </div>
                  </label>

                  <label className={`flex items-center p-3 rounded-lg transition-all duration-200 ${includeSymbols ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'}`}>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        aria-checked={includeSymbols}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">Symbols</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">! @ # $ % ^ & *</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-800 flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleGenerate}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Generate Password</span>
                </button>
                
                {generatedPassword && (
                  <button
                    onClick={handleUsePassword}
                    className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Use This Password</span>
                  </button>
                )}
              </div>
              
              {/* Footer Note */}
              <div className="pt-2 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Passwords are generated securely in your browser and never sent to any server.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordGenerator;