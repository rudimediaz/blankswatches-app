import { type ParentComponent } from 'solid-js';
import {
  createHSLRawString,
  createHSLString,
  useSwatchesContext,
} from '../contexts/swatches';

const CurrentHSL: ParentComponent = (props) => {
  const context = useSwatchesContext();

  const hslString = createHSLString(context);
  const hslRawString = createHSLRawString(context);

  return (
    <div
      style={{
        display: 'contents',
        '--current-hsl': hslString(),
        '--current-hsl-raw': hslRawString(),
      }}
    >
      {props.children}
    </div>
  );
};

export default CurrentHSL;
