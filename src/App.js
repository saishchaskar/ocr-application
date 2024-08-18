import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = event => {
    const file = event.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5 MB limit
      setError('File size should not exceed 5 MB.');
      setSelectedFile(null);
    } else {
      setError('');
      setSelectedFile(file);
    }
  };

  const onFileUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setText('');
    setError('');

    axios.post('https://ocr-backend-f7f7b4xm6q-el.a.run.app/upload', formData)
      .then(response => {
        setText(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error uploading file.');
        setLoading(false);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (


    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload an Image for OCR</h2>
        <input
          type="file"
          onChange={onFileChange}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:border-blue-500"
        />
        <p className="text-sm text-gray-600 mt-2">Max file size: 5 MB</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          onClick={onFileUpload}
          className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          disabled={!selectedFile || loading}
        >
          Click to Upload
        </button>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        )}
        {text && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Detected Text:</h3>
            <p className="text-gray-800 bg-gray-100 p-4 rounded-lg">{text}</p>
            <button
              onClick={copyToClipboard}
              className="mt-2 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
