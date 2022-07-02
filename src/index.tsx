/* @refresh reload */

import 'open-props/normalize';
import { Router } from 'solid-app-router';
import { render } from 'solid-js/web';
import App from './App';
import { ColorProvider } from './contexts/color';
import { createHSL, SwatchesProvider } from './contexts/swatches';
import './index.css';

sessionStorage.setItem('initial_hsl', JSON.stringify(createHSL()));

render(
  () => (
    <SwatchesProvider>
      <ColorProvider>
        <Router>
          <App />
        </Router>
      </ColorProvider>
    </SwatchesProvider>
  ),
  document.getElementById('root')!
);
