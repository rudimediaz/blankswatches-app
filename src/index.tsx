/* @refresh reload */

import { glob } from 'goober';
import { Router } from 'solid-app-router';
import { render } from 'solid-js/web';
import App from './App';

//styles
import 'open-props/normalize';
import { createHSL, SwatchesProvider } from './contexts/swatches';

glob({
  body: {
    fontFamily: `'Inter', system-ui`,
  },
});

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
