import { createRoot } from 'react-dom/client';

import App from './App';
import { initEdt } from './lib/edt/edtInit';

import './styles/index.css';

initEdt();
createRoot(document.getElementById('root')!).render(<App />);
