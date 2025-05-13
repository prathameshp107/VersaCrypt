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
  - Upload text files for encryption/decryption
  - Export results as text files
  - Drag and drop file support

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

## Security Considerations

- This application processes all data locally in your browser
- No data is sent to any server
- For maximum security, consider using this application offline
- The strength of your encryption depends on the complexity of your key

## License

MIT

## Acknowledgments

- [CryptoJS](https://github.com/brix/crypto-js) for cryptographic functions
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build system

