'use client';

import { useState } from 'react';

export default function CodePage() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/code', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.code?.code) {
        setGeneratedCode(data.code.code);
      } else {
        setGeneratedCode('Error generating code');
      }
    } catch (error) {
      console.error(error);
      setGeneratedCode('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <button
        onClick={handleGenerate}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Code'}
      </button>

      {generatedCode && (
        <p className="mt-4 text-xl text-green-700">
          <span className="font-mono">{generatedCode}</span>
        </p>
      )}
    </div>
  );
}
