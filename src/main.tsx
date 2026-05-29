import { render } from 'preact';
import './styles/base.css';
import './styles/okami.css';
import './styles/tanka.css';
import { OkamiBackground } from './app/OkamiBackground';
import { App } from './app/App';

const root = document.getElementById('app');
if (!root) throw new Error('#app not found');
render(
  <>
    <OkamiBackground />
    <App />
  </>,
  root,
);
