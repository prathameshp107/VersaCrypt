import CryptoJS from 'crypto-js';
import LZString from 'lz-string';

export const encryptText = (inputText, key, algorithm) => {
  switch (algorithm) {
    case 'aes':
      return CryptoJS.AES.encrypt(inputText, key || 'default-key').toString();
    case 'des':
      return CryptoJS.DES.encrypt(inputText, key || 'default-key').toString();
    case 'base64':
      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(inputText));
    case 'xor':
      const xorKey = key || 'default-key';
      let result = [...inputText].map((char, i) => {
        return String.fromCharCode(char.charCodeAt(0) ^ xorKey.charCodeAt(i % xorKey.length));
      }).join('');
      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(result));
    case 'rc4':
      return CryptoJS.RC4.encrypt(inputText, key || 'default-key').toString();
    case 'rabbit':
      return CryptoJS.Rabbit.encrypt(inputText, key || 'default-key').toString();
    case 'lzstring':
      return LZString.compressToBase64(inputText);
    default:
      return 'Algorithm not implemented';
  }
};

export const decryptText = (inputText, key, algorithm) => {
  switch (algorithm) {
    case 'aes':
      return CryptoJS.AES.decrypt(inputText, key || 'default-key').toString(CryptoJS.enc.Utf8);
    case 'des':
      return CryptoJS.DES.decrypt(inputText, key || 'default-key').toString(CryptoJS.enc.Utf8);
    case 'base64':
      return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(inputText));
    case 'xor':
      let decoded = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(inputText));
      const xorKey = key || 'default-key';
      return [...decoded].map((char, i) => {
        return String.fromCharCode(char.charCodeAt(0) ^ xorKey.charCodeAt(i % xorKey.length));
      }).join('');
    case 'rc4':
      return CryptoJS.RC4.decrypt(inputText, key || 'default-key').toString(CryptoJS.enc.Utf8);
    case 'rabbit':
      return CryptoJS.Rabbit.decrypt(inputText, key || 'default-key').toString(CryptoJS.enc.Utf8);
    case 'lzstring':
      return LZString.decompressFromBase64(inputText) || 'Invalid compressed data';
    default:
      return 'Algorithm not implemented';
  }
};