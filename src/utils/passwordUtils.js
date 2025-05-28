export const generatePassword = (length, includeSymbols, includeNumbers, includeLowercase, includeUppercase) => {
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
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};

export const calculateKeyStrength = (key) => {
  const lengthStrength = Math.min(key.length / 12, 1);
  const hasLowercase = /[a-z]/.test(key) ? 0.1 : 0;
  const hasUppercase = /[A-Z]/.test(key) ? 0.1 : 0;
  const hasNumbers = /[0-9]/.test(key) ? 0.1 : 0;
  const hasSymbols = /[^a-zA-Z0-9]/.test(key) ? 0.2 : 0;
  return Math.min((lengthStrength + hasLowercase + hasUppercase + hasNumbers + hasSymbols) * 100, 100);
};