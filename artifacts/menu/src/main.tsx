import { createRoot } from 'react-dom/client';

import App from './App';
import { initEdt } from './lib/edt/edtInit';
import { initSpl } from './lib/spl/spl';
import { initMv }  from './lib/mv/mvInit';

import './styles/index.css';

initEdt();
initSpl();
initMv();
createRoot(document.getElementById('root')!).render(<App />);
