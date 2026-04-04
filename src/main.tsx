import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import './i18n'; // Initialize i18next
import App from './App.tsx'
import DevOverlay from './components/dev/DevOverlay.tsx';
import SystemHealthHUD from './components/dev/SystemHealthHUD.tsx';
import { SystemHealthEngine } from './services/SystemHealthEngine.ts';

// Initialize the Health Engine before React renders
SystemHealthEngine.initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <DevOverlay />
    <SystemHealthHUD />
  </StrictMode>,
)
