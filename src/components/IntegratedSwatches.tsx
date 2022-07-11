import { Motion, Presence } from '@motionone/solid';
import debounce from 'lodash-es/debounce';
import { spring } from 'motion';
import rgbHex from 'rgb-hex';
import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
  Show,
  type Component,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { useMedia } from '../composables/media';
import {
  createHSL,
  createHSLString,
  hslSchema,
  useSwatchesContext,
  type HSL,
} from '../contexts/swatches';
import ColorName from './ColorName';
import Gradients from './Gradients';
import c from './IntegratedSwatches.module.css';
import TouchSensor, {
  type SenseInit,
  type SlideInit,
} from './TouchSensor';

type IntegratedSwatchesProps = {
  class?: string;
};

const variantMax = {
  h: 360,
  s: 100,
  l: 100,
};

function createHexRetriever<T extends HTMLElement>() {
  const [hex, setHex] = createSignal('');
  const callback: MutationCallback = (records) => {
    let rawRGB = (records[0].target as T).style.backgroundColor;
    setHex(rgbHex(rawRGB));
  };

  const debouncedCallback = debounce(callback, 1000, {
    maxWait: 1000 * 60,
  });

  const observer = new MutationObserver(debouncedCallback);

  return [hex, observer] as const;
}

const IntegratedSwatches: Component<IntegratedSwatchesProps> = (
  props
) => {
  let containerRef: HTMLDivElement;
  const context = useSwatchesContext();
  const hslString = createHSLString(context);
  const [swatches, { boot, updateCurrent, resumeFromLargeScreen }] =
    context;
  const [sensorActivity, setSensorActivity] = createStore({
    engaged: false,
    target: null as keyof HSL | null,
    moved: false,
  });
  const [hex, observer] = createHexRetriever();
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

  onMount(() => {
    observer.observe(containerRef, { attributeFilter: ['style'] });

    onCleanup(() => {
      observer.disconnect();
    });
  });

  createEffect(
    on(largeScreen, (current, prev) => {
      if (prev === true && current === false) {
        resumeFromLargeScreen();
      }
    })
  );

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
      ref={containerRef!}
      class={`${props.class} ${c.ctn}`}
      style={{ 'background-color': hslString() }}
    >
      <Presence exitBeforeEnter>
        <Show when={adjusting()}>
          {(val) => (
            <Gradients swatchesKey={val.target}>
              <Motion.div
                class={c.floating_info}
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
            </Gradients>
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
      <Motion.div
        animate={{ opacity: [0, 1] }}
        transition={{ delay: 1, duration: 0.4, easing: 'ease-in' }}
        class={c.ctn_colorinfo}
      >
        <ColorName hex={hex()} />
      </Motion.div>
    </div>
  );
};

export default IntegratedSwatches;
