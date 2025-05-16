import { useState } from 'react';

/**
 * A minimal test application to isolate rendering issues
 */
function TestApp() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">React Test Application</h1>
      <p className="mb-4">This is a minimal test to verify React rendering is working</p>
      
      <div className="p-4 bg-gray-100 rounded mb-4">
        <p className="font-medium">Count: {count}</p>
        <button 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify({
            NODE_ENV: import.meta.env.MODE,
            VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
            VITE_DEBUG: import.meta.env.VITE_DEBUG,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default TestApp;
