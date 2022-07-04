import { type Component } from 'solid-js';
import Card from '../shared/Card';
import ExternalSwatches from './ExternalSwatches';
import c from './SidePane.module.css';

const SidePane: Component = () => {
  return (
    <div class={c.ctn}>
      <div>{''}</div>
      <div class={c.ctn_content}>
        <ExternalSwatches />
        <Card>info</Card>
      </div>
      <div>{''}</div>
    </div>
  );
};

export default SidePane;
