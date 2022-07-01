import { Motion, Presence } from '@motionone/solid';
import { spring } from 'motion';
import { createMemo, onMount, Show, type Component } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { useMedia } from '../composables/media';
import {
  createGradients,
  createHSL,
  createHSLString,
  hslSchema,
  useSwatchesContext,
  type HSL,
} from '../contexts/swatches';
import c from './IntegratedSwatches.module.css';
import TouchSensor, {
  type SenseInit,
  type SlideInit,
} from './TouchSensor';

type IntegratedSwatchesProps = {
  class?: string;
};

function formatGradient(colors: string) {
  return `linear-gradient(to right, ${colors})`;
}

const variantMax = {
  h: 360,
  s: 100,
  l: 100,
};

const IntegratedSwatches: Component<IntegratedSwatchesProps> = (
  props
) => {
  const context = useSwatchesContext();
  const hslString = createHSLString(context);
  const [swatches, { boot, updateCurrent }] = context;
  const [sensorActivity, setSensorActivity] = createStore({
    engaged: false,
    target: null as keyof HSL | null,
    moved: false,
  });
  const largeScreen = useMedia('(min-width : 1024px)');

  const active = createMemo(() => {
    return largeScreen() ? false : true;
  });

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

  const handleSlide = (detail: SlideInit) => {
    updateCurrent({
      [detail.swatchesType]: detail.value,
    });
  };

  const handleSense = (detail: SenseInit) => {
    setSensorActivity(
      produce((d) => {
        d.engaged = detail.engaged;
        d.target = detail.swatchesType;
        d.moved = detail.moved;
      })
    );
  };

  const hueGradients = createGradients('h', context);
  const saturationGradients = createGradients('s', context);
  const lightnessGradients = createGradients('l', context);

  const gradient = createMemo(() => {
    return {
      h: formatGradient(hueGradients()),
      s: formatGradient(saturationGradients()),
      l: formatGradient(lightnessGradients()),
    };
  });

  const adjusting = createMemo(() => {
    if (
      sensorActivity.engaged &&
      sensorActivity.target &&
      sensorActivity.moved
    ) {
      return {
        engaged: sensorActivity.engaged,
        target: sensorActivity.target,
        max: variantMax[sensorActivity.target],
      };
    }

    return null;
  });

  return (
    <div
      class={`${props.class} ${c.ctn}`}
      style={{ 'background-color': hslString() }}
    >
      <Presence exitBeforeEnter>
        <Show when={adjusting()}>
          {(val) => (
            <Motion.div
              class={c.floating_info}
              style={{ '--grad': gradient()[val.target] }}
              animate={{ opacity: [0, 1], y: [-100, 0] }}
              transition={{ easing: spring() }}
              exit={{ opacity: 0, y: -100 }}
            >
              <input
                type="range"
                value={swatches.current[val.target]}
                readOnly={true}
                max={val.max}
              />
            </Motion.div>
          )}
        </Show>
      </Presence>
      <TouchSensor
        max={360}
        step={0.44}
        session={swatches.session.h}
        swatchesType="h"
        active={active()}
        onSlide={handleSlide}
        onSense={handleSense}
      />
      <TouchSensor
        max={100}
        step={0.35}
        session={swatches.session.s}
        swatchesType="s"
        active={active()}
        onSlide={handleSlide}
        onSense={handleSense}
      />
      <TouchSensor
        max={100}
        step={0.35}
        session={swatches.session.l}
        swatchesType="l"
        active={active()}
        onSlide={handleSlide}
        onSense={handleSense}
      />
    </div>
  );
};

export default IntegratedSwatches;
