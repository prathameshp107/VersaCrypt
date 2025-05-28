export const readFile = (file, setInputText, setFile) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => setInputText(e.target.result);
    reader.readAsText(file);
    setFile(file);
  }
};

export const exportData = (outputText, mode) => {
  if (!outputText) return;

  const blob = new Blob([outputText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${mode === 'encrypt' ? 'encrypted' : 'decrypted'}_data.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};