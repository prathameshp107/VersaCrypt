# Secure Crypt - Encryption & Decryption Tool

A modern, feature-rich encryption and decryption application built with React and CryptoJS. This application provides a user-friendly interface for encrypting and decrypting text using various cryptographic algorithms.

![Secure Crypt App](https://via.placeholder.com/800x450.png?text=Secure+Crypt+App)

## Features

### Core Functionality
- **Multiple Encryption Algorithms**:
  - AES (Advanced Encryption Standard)
  - DES (Data Encryption Standard)
  - RC4 (Rivest Cipher 4)
  - Rabbit Stream Cipher
  - Base64 Encoding
  - XOR Cipher

- **Dual Operation Modes**:
  - Encrypt: Convert plain text into encrypted format
  - Decrypt: Convert encrypted text back to plain text

### File Encryption & Decryption
- **File Support**:
  - Encrypt any file type (documents, images, archives, etc.)
  - Decrypt previously encrypted files
  - Preserve original file extensions
  
- **Secure File Handling**:
  - Files are processed entirely in the browser
  - No file contents are sent to any server
  - Automatic file extension management (.enc for encrypted files)
  
- **User Experience**:
  - Drag and drop interface
  - Clear visual feedback during processing
  - Download processed files with a single click

### Advanced Features
- **Secure Password Generator**:
  - Customizable password length (8-32 characters)
  - Toggle inclusion of uppercase letters, lowercase letters, numbers, and symbols
  - One-click copy to clipboard
  - Option to use generated password as encryption key

- **Key Strength Meter**:
  - Real-time evaluation of encryption key strength
  - Visual indicator with color coding (red, yellow, green)
  - Percentage-based strength calculation

- **Algorithm Performance Comparison**:
  - Compare encryption/decryption speed across different algorithms
  - View output size and success status for each algorithm
  - Helps users choose the most efficient algorithm for their needs

- **File Operations**:
  - Upload files of any type for encryption/decryption
  - Export results with proper file extensions
  - Drag and drop interface for easy file selection
  - File size and type validation

- **User Experience Enhancements**:
  - Dark/Light mode toggle
  - Processing time display
  - Operation history tracking
  - Copy to clipboard functionality
  - Responsive design with modern UI
  - Animated gradient backgrounds

## Technical Implementation

- **Frontend**: React with functional components and hooks
- **Styling**: Tailwind CSS with custom animations
- **Cryptography**: CryptoJS library
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/encrypt_and_decrypt_app.git
   cd encrypt_and_decrypt_app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Usage Guide

### Text Encryption/Decryption
1. **Select Operation Mode**:
   - Choose between "Encrypt" or "Decrypt" modes
   
2. **Choose Encryption Algorithm**:
   - Select from AES, DES, RC4, Rabbit, Base64, or XOR

3. **Enter or Generate a Key** (not required for Base64):
   - Type a passphrase directly
   - Or use the password generator to create a secure key

4. **Input Text**:
   - Type or paste text to encrypt/decrypt
   - Or upload a text file

5. **Process Data**:
   - Click the "Encrypt Data" or "Decrypt Data" button

6. **View and Use Results**:
   - Copy the result to clipboard
   - Export the result as a text file
   - View processing time and algorithm performance

### File Encryption/Decryption
1. **Switch to File Mode**:
   - Click on the "File Encryption" tab

2. **Select Operation**:
   - Choose between "Encrypt File" or "Decrypt File"

3. **Choose Encryption Algorithm**:
   - Select your preferred encryption method
   - Note: Some algorithms may be better suited for certain file types

4. **Enter Your Encryption Key**:
   - Input a secure passphrase
   - Remember this key for decryption

5. **Upload Your File**:
   - Click to browse or drag and drop your file
   - For encryption: Any file type is supported
   - For decryption: Must be a file encrypted by this application

6. **Process and Download**:
   - Click the "Encrypt File" or "Decrypt File" button
   - The processed file will download automatically
   - Encrypted files will have a ".enc" extension added
   - Decrypted files will have their original extension restored

2. **Choose Encryption Algorithm**:
   - Select from AES, DES, RC4, Rabbit, Base64, or XOR

3. **Enter or Generate a Key** (not required for Base64):
   - Type a passphrase directly
   - Or use the password generator to create a secure key

4. **Input Text**:
   - Type or paste text to encrypt/decrypt
   - Or upload a text file

5. **Process Data**:
   - Click the "Encrypt Data" or "Decrypt Data" button

6. **View and Use Results**:
   - Copy the result to clipboard
   - Export the result as a text file
   - View processing time and algorithm performance

## Security Considerations

### Data Privacy
- All encryption/decryption happens locally in your browser
- No files or keys are ever sent to any server
- Your data never leaves your computer

### Best Practices
- **For Maximum Security**:
  - Use the application offline for sensitive files
  - Choose strong, unique encryption keys
  - Keep your encryption keys secure and private
  - Verify file integrity after decryption

### Limitations
- File size is limited by your browser's memory
- Very large files may cause performance issues
- The strength of your encryption depends on:
  - The complexity of your key
  - The chosen encryption algorithm
  - The implementation security

### Important Notes
- Always keep backups of your original files
- Test decryption with non-critical files first
- Remember that encrypted files are only as secure as your encryption key

## License

MIT

## Acknowledgments

- [CryptoJS](https://github.com/brix/crypto-js) for cryptographic functions
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build system

