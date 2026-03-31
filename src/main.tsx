import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import './i18n'; // Initialize i18next
import App from './App.tsx'
import DevOverlay from './components/dev/DevOverlay.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <DevOverlay />
  </StrictMode>,
)
