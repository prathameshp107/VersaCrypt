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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={handleBackdropClick}
          role="dialog"
          aria-labelledby="password-generator-title"
          aria-modal="true"
        >
          <div
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 id="password-generator-title" className="text-2xl font-bold text-gray-900">
                Generate Secure Password
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="space-y-6">
              {/* Password Length Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Password Length: <span className="font-semibold">{passwordLength}</span>
                </label>
                <input
                  type="range"
                  min={8}
                  max={50}
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={`Password length: ${passwordLength}`}
                />
              </div>

              {/* Checkbox Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    aria-checked={includeSymbols}
                  />
                  <span className="text-gray-800">Include Symbols (!@#$%^&*)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    aria-checked={includeNumbers}
                  />
                  <span className="text-gray-800">Include Numbers (0-9)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    aria-checked={includeLowercase}
                  />
                  <span className="text-gray-800">Include Lowercase (a-z)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    aria-checked={includeUppercase}
                  />
                  <span className="text-gray-800">Include Uppercase (A-Z)</span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm bg-red-100 p-2 rounded-lg">
                  {error}
                </div>
              )}

              {/* Generated Password Display */}
              {generatedPassword && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-800">
                      Generated Password
                    </label>
                    {strength && (
                      <span className={`text-sm font-semibold text-white px-2 py-1 rounded ${strength.color}`}>
                        {strength.text}
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedPassword}
                      readOnly
                      className="flex-1 p-2 bg-gray-100/80 border border-gray-300 rounded-lg text-gray-900 focus:outline-none"
                      aria-label="Generated password"
                    />
                    <div className="relative">
                      <button
                        onClick={handleCopy}
                        disabled={!generatedPassword}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Copy password to clipboard"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      {copied && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
                          Copied to clipboard
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:scale-95 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={handleGenerate}
                disabled={!includeSymbols && !includeNumbers && !includeLowercase && !includeUppercase}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
              >
                {generatedPassword ? 'Regenerate' : 'Generate'}
              </button>
              <button
                onClick={handleUsePassword}
                disabled={!generatedPassword}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
              >
                Use This Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordGenerator;