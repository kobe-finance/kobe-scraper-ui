import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import TestApp from './TestApp';

// Render our simplified test app
const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
} else {
  console.error('Failed to find the root element');
}
