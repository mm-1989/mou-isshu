import { render } from 'preact';
import './styles/base.css';
import './styles/tanka.css';
import { App } from './app/App';

const root = document.getElementById('app');
if (!root) throw new Error('#app not found');
render(<App />, root);
