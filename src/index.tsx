/* @refresh reload */

import 'open-props/normalize';
import { Router } from 'solid-app-router';
import { render } from 'solid-js/web';
import App from './App';
import { createHSL, SwatchesProvider } from './contexts/swatches';
import './index.css';

sessionStorage.setItem('initial_hsl', JSON.stringify(createHSL()));

render(
  () => (
    <SwatchesProvider>
      <Router>
        <App />
      </Router>
    </SwatchesProvider>
  ),
  document.getElementById('root')!
);
