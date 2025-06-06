import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import LZString from 'lz-string';

export const useEncryption = () => {
  const [processingTime, setProcessingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);

  const calculateKeyStrength = (key) => {
    if (!key) return 0;
    const lengthStrength = Math.min(key.length / 12, 1);
    const hasLowercase = /[a-z]/.test(key) ? 0.1 : 0;
    const hasUppercase = /[A-Z]/.test(key) ? 0.1 : 0;
    const hasNumbers = /[0-9]/.test(key) ? 0.1 : 0;
    const hasSymbols = /[^a-zA-Z0-9]/.test(key) ? 0.2 : 0;
    return Math.min((lengthStrength + hasLowercase + hasUppercase + hasNumbers + hasSymbols) * 100, 100);
  };

  const processEncryption = async (inputText, mode, algorithm, key, options = {}) => {
    setIsProcessing(true);
    const startTime = performance.now();

    if (!inputText) {
      setIsProcessing(false);
      return '';
    }

    try {
      let result = '';

      if (mode === 'encrypt') {
        result = await encryptText(inputText, algorithm, key, options);
      } else {
        result = await decryptText(inputText, algorithm, key, options);
      }

      const endTime = performance.now();
      setProcessingTime(endTime - startTime);

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

      return result;
    } catch (error) {
      console.error('Encryption error:', error);
      return `Error: ${error.message}`;
    } finally {
      setIsProcessing(false);
    }
  };

  const encryptText = async (text, algorithm, key, options) => {
    const defaultKey = 'default-key';
    const actualKey = key || defaultKey;

    switch (algorithm) {
      case 'aes':
        return CryptoJS.AES.encrypt(text, actualKey).toString();
      case 'des':
        return CryptoJS.DES.encrypt(text, actualKey).toString();
      case 'base64':
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
      case 'xor':
        const xorResult = [...text].map((char, i) => {
          return String.fromCharCode(char.charCodeAt(0) ^ actualKey.charCodeAt(i % actualKey.length));
        }).join('');
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(xorResult));
      case 'rc4':
        return CryptoJS.RC4.encrypt(text, actualKey).toString();
      case 'rabbit':
        return CryptoJS.Rabbit.encrypt(text, actualKey).toString();
      case 'lzstring':
        const { lzMethod = 'compress' } = options;
        switch (lzMethod) {
          case 'compress':
            return LZString.compress(text);
          case 'compressToUTF16':
            return LZString.compressToUTF16(text);
          case 'compressToBase64':
            return LZString.compressToBase64(text);
          case 'compressToEncodedURIComponent':
            return LZString.compressToEncodedURIComponent(text);
          case 'compressToUint8Array':
            const uint8Array = LZString.compressToUint8Array(text);
            return Array.from(uint8Array).join(',');
          default:
            return LZString.compress(text);
        }
      default:
        throw new Error('Algorithm not implemented');
    }
  };

  const decryptText = async (text, algorithm, key, options) => {
    const defaultKey = 'default-key';
    const actualKey = key || defaultKey;

    try {
      switch (algorithm) {
        case 'aes':
          return CryptoJS.AES.decrypt(text, actualKey).toString(CryptoJS.enc.Utf8);
        case 'des':
          return CryptoJS.DES.decrypt(text, actualKey).toString(CryptoJS.enc.Utf8);
        case 'base64':
          return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(text));
        case 'xor':
          const decoded = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(text));
          return [...decoded].map((char, i) => {
            return String.fromCharCode(char.charCodeAt(0) ^ actualKey.charCodeAt(i % actualKey.length));
          }).join('');
        case 'rc4':
          return CryptoJS.RC4.decrypt(text, actualKey).toString(CryptoJS.enc.Utf8);
        case 'rabbit':
          return CryptoJS.Rabbit.decrypt(text, actualKey).toString(CryptoJS.enc.Utf8);
        case 'lzstring':
          const { lzMethod = 'compress' } = options || {};
          try {
            let result;
            switch (lzMethod) {
              case 'compress':
                result = LZString.decompress(text);
                break;
              case 'compressToUTF16':
                result = LZString.decompressFromUTF16(text);
                break;
              case 'compressToBase64':
                result = LZString.decompressFromBase64(text);
                break;
              case 'compressToEncodedURIComponent':
                result = LZString.decompressFromEncodedURIComponent(text);
                break;
              case 'compressToUint8Array':
                const uint8Array = new Uint8Array(text.split(',').map(Number));
                result = LZString.decompressFromUint8Array(uint8Array);
                break;
              default:
                result = LZString.decompress(text);
            }
            return result || 'Invalid compressed data';
          } catch (error) {
            console.error('LZ-String decompression error:', error);
            throw new Error('Failed to decompress: Invalid input or method');
          }
        default:
          throw new Error('Algorithm not implemented');
      }
    } catch (error) {
      throw new Error('Decryption failed. Please check your input and key.');
    }
  };

  return {
    processingTime,
    isProcessing,
    history,
    calculateKeyStrength,
    processEncryption,
  };
};

export default useEncryption;
