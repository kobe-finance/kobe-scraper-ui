import React from 'react';

/**
 * Simple test page to verify React rendering is working
 */
export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a basic test page to verify React rendering.</p>
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify({
            NODE_ENV: import.meta.env.MODE,
            VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
            VITE_DEBUG: import.meta.env.VITE_DEBUG,
            VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
