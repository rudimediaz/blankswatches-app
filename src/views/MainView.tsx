import type { Component } from 'solid-js';
import IntegratedSwatches from '../components/IntegratedSwatches';
import SidePane from '../components/SidePane';
import c from './MainView.module.css';

const MainView: Component = () => {
  return (
    <div class={c.ctn} data-testid="main-view">
      <IntegratedSwatches class={c.swatches} />
      <div class={c.sidebar}>
        <SidePane />
      </div>
    </div>
  );
};

export default MainView;
