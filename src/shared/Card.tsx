import { type ParentComponent } from 'solid-js';
import c from './Card.module.css';
type CardProps = {
  class?: string;
};

const Card: ParentComponent<CardProps> = (props) => {
  return (
    <div class={`${props.class} ${c.ctn}`}>{props.children}</div>
  );
};

export default Card;
