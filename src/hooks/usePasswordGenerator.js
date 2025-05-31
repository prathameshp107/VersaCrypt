import { useState, useCallback } from 'react';

export const usePasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generatePassword = useCallback(() => {
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const numbers = '0123456789';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let charset = '';
    if (includeSymbols) charset += symbols;
    if (includeNumbers) charset += numbers;
    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;

    // Ensure at least one character set is selected
    if (!charset) {
      return '';
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }, [passwordLength, includeSymbols, includeNumbers, includeLowercase, includeUppercase]);

  const handleGeneratePassword = useCallback(() => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    return newPassword;
  }, [generatePassword]);

  return {
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
    generatePassword: handleGeneratePassword,
  };
};

export default usePasswordGenerator;
