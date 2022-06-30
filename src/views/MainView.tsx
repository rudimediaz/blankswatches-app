import { css } from 'goober';
import type { Component } from 'solid-js';

const ctn = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3,1fr)',
  gridTemplateRows: 'minmax(100vh,1fr)',
});

const swatches = css({
  gridArea: '1/1/2/4',
  '@media (min-width : 1024px)': {
    gridArea: '1/1/2/3',
  },
});

const sidebar = css({
  display: 'none',
  '@media (min-width : 1024px)': {
    gridArea: '1/3/2/4',
    display: 'grid',
  },
});

const MainView: Component = () => {
  return (
    <div class={ctn} data-testid="main-view">
      <div class={swatches}>swatches</div>
      <div class={sidebar}>sidebar</div>
    </div>
  );
};

export default MainView;
