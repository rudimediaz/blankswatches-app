import { createMemo, type ParentComponent } from 'solid-js';
import {
  createGradients,
  formatGradient,
  useSwatchesContext,
} from '../contexts/swatches';

type GradientsProps = {
  swatchesKey: 'h' | 's' | 'l';
};

const Gradients: ParentComponent<GradientsProps> = (props) => {
  const swatchesContext = useSwatchesContext();

  const gradients = createGradients(
    props.swatchesKey,
    swatchesContext
  );

  const contextGradients = createMemo(() => {
    return formatGradient(gradients());
  });

  return (
    <div
      style={{
        display: 'contents',
        '--context-gradients': contextGradients(),
      }}
    >
      {props.children}
    </div>
  );
};

export default Gradients;
