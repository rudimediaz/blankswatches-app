/* @refresh reload */

import { glob } from 'goober';
import { Router } from 'solid-app-router';
import { render } from 'solid-js/web';
import App from './App';

//styles
import 'open-props/normalize';

glob({
  body: {
    fontFamily: `'Inter', system-ui`,
  },
});

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root')!
);
