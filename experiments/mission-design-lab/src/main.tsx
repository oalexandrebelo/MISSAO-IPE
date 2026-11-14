import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles.css';
import './orbit.css';
import './ui/scientific-missions.css';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento de montagem da Missão Ipê não encontrado.');
createRoot(root).render(<StrictMode><App /></StrictMode>);

