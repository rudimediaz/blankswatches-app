import type { Component } from 'solid-js';
import CurrentHSL from '../components/CurrentHSL';
import IntegratedSwatches from '../components/IntegratedSwatches';
import SidePane from '../components/SidePane';
import c from './MainView.module.css';

const MainView: Component = () => {
  return (
    <CurrentHSL>
      <div class={c.ctn} data-testid="main-view">
        <IntegratedSwatches class={c.swatches} />
        <div class={c.sidebar}>
          <SidePane />
        </div>
      </div>
    </CurrentHSL>
  );
};

export default MainView;
