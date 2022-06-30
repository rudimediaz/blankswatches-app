import { css } from 'goober';
import { type Component, onMount } from 'solid-js';
import {
  createHSL,
  createHSLString,
  hslSchema,
  useSwatchesContext,
} from '../contexts/swatches';

type IntegratedSwatchesProps = {
  class?: string;
};

const ctn = css({
  display: 'grid',
});

const IntegratedSwatches: Component<IntegratedSwatchesProps> = (
  props
) => {
  const context = useSwatchesContext();
  const hslString = createHSLString(context);
  const [_, { boot }] = context;
  onMount(() => {
    try {
      const data = sessionStorage.getItem('initial_hsl');

      if (typeof data === 'string') {
        const parsed = JSON.parse(data);

        const initialHSL = hslSchema.parse(parsed);

        boot(initialHSL);
        sessionStorage.removeItem('initial_hsl');
      } else {
        throw new Error('not stored');
      }
    } catch (_error) {
      boot(createHSL());
    }
  });

  return (
    <div
      class={`${props.class} ${ctn}`}
      style={{ 'background-color': hslString() }}
    >
      <div>sensor</div>
      <div>sensor</div>
      <div>sensor</div>
    </div>
  );
};

export default IntegratedSwatches;
