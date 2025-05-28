// Generate a 1MB string (approximately)
function generateLargeString(sizeInMB = 1) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  const bytesPerChar = 2; // Assuming UTF-16 encoding (JavaScript's default)
  const totalChars = (sizeInMB * 1024 * 1024) / bytesPerChar;
  
  let result = '';
  for (let i = 0; i < totalChars; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  console.log(`Generated string of approximately ${result.length * bytesPerChar / (1024 * 1024)} MB`);
  return result;
}

// Generate strings of different sizes
const smallTest = generateLargeString(0.1);  // 100KB
const mediumTest = generateLargeString(0.5); // 500KB
const largeTest = generateLargeString(1);    // 1MB
const veryLargeTest = generateLargeString(5); // 5MB - be careful with this one!

// Save the strings to files
const fs = require('fs');
const path = require('path');

// Create a test-data directory if it doesn't exist
const testDataDir = path.join(__dirname, 'test-data');
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir);
  console.log('Created test-data directory');
}

// Save each test string to a file
fs.writeFileSync(path.join(testDataDir, 'small-100kb.txt'), smallTest);
console.log('Saved small test data (100KB)');

fs.writeFileSync(path.join(testDataDir, 'medium-500kb.txt'), mediumTest);
console.log('Saved medium test data (500KB)');

fs.writeFileSync(path.join(testDataDir, 'large-1mb.txt'), largeTest);
console.log('Saved large test data (1MB)');

fs.writeFileSync(path.join(testDataDir, 'very-large-5mb.txt'), veryLargeTest);
console.log('Saved very large test data (5MB)');

console.log('All test data files have been created in the test-data directory');

// Copy one of these to clipboard to paste into your app
console.log('Small test string ready');
// To copy to clipboard in browser console:
// copy(smallTest);