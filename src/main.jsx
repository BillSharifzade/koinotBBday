import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// No <StrictMode>: Ballpit forces a WebGL context loss when it unmounts, so the
// dev-only mount → unmount → mount cycle would leave its canvas without a context.
createRoot(document.getElementById('root')).render(<App />);
