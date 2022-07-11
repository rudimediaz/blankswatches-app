import {
  createEffect,
  createMemo,
  on,
  type Component,
  type JSX,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import c from './TouchSensor.module.css';

type SwatchesType = 'h' | 's' | 'l';
export type SlideInit = {
  swatchesType: SwatchesType;
  value: number;
};

export type SenseInit = {
  engaged: boolean;
  swatchesType: SwatchesType;
  moved: boolean;
};

type TouchSensorProps = {
  max: number;
  session: number;
  step: number;
  active: boolean;
  swatchesType: SwatchesType;
  onSlide?: (init: SlideInit) => void;
  onSense?: (init: SenseInit) => void;
};

type TouchEventHandler = JSX.EventHandler<HTMLDivElement, TouchEvent>;

class Interpolation {
  constructor(private step: number) {}

  interpolate(target: number) {
    let division = target / this.step;

    if (division === Infinity) {
      return target;
    }

    return division;
  }

  deinterpolate(target: number, factor = 0) {
    let mult = target * this.step;

    if (factor > 0) {
      return Math.floor(mult);
    } else if (factor < 0) {
      return Math.ceil(mult);
    } else {
      return Math.round(mult);
    }
  }
}

const TouchSensor: Component<TouchSensorProps> = (props) => {
  // set step to constant;
  const STEP = props.step;
  const interpolation = new Interpolation(STEP);
  const max = createMemo(() => interpolation.interpolate(props.max));
  const session = createMemo(() =>
    interpolation.interpolate(props.session)
  );

  const active = () => props.active;

  let sliderRef: HTMLInputElement;

  const [touchData, setTouchData] = createStore({
    touches: [] as Touch[],
    engaged: false,
  });

  createEffect(
    on(
      [() => touchData.engaged, () => touchData.touches],
      (currents) => {
        const [engagedValue, touchesValue] = currents;
        if (props.onSense) {
          props.onSense({
            engaged: engagedValue,
            swatchesType: props.swatchesType,
            moved: touchesValue.length > 2,
          });
        }
      },
      { defer: true }
    )
  );

  const delta = createMemo(() => {
    if (touchData.touches.length > 1) {
      let [lastTwo, last] = touchData.touches.slice(
        touchData.touches.length - 2,
        touchData.touches.length
      );

      let ltx = lastTwo.clientX;
      let lx = last.clientX;
      let ly = last.screenY;
      let sy = touchData.touches[0].screenY;

      let va = Math.abs(ly - sy);

      if (va > 10) {
        return 0;
      } else {
        if (ltx > lx) return -Math.random();
        if (ltx < lx) return Math.random();
        return 0;
      }
    } else {
      return 0;
    }
  });

  createEffect(
    on(session, (sessionValue) => {
      if (sliderRef) {
        sliderRef.value = `${sessionValue}`;
      }
    })
  );

  const sliderMoveCallback = (delta: number) => {
    if (sliderRef && props.onSlide) {
      const init: SlideInit = {
        swatchesType: props.swatchesType,
        value: interpolation.deinterpolate(
          sliderRef.valueAsNumber,
          delta
        ),
      };

      props.onSlide(init);
    }
  };

  createEffect(
    on(delta, (deltaValue) => {
      if (sliderRef) {
        if (deltaValue > 0) {
          sliderRef.stepUp();
          setTimeout(sliderMoveCallback, 0, deltaValue);
        } else if (deltaValue < 0) {
          sliderRef.stepDown();
          setTimeout(sliderMoveCallback, 0, deltaValue);
        } else {
          sliderRef.stepUp(0);
        }
      }
    })
  );

  const invalidateSensor = (e: Event, callback: () => void) => {
    if (active() === false) {
      e.stopImmediatePropagation();
      return;
    } else {
      callback();
    }
  };

  const handleTouchStart: TouchEventHandler = (e) => {
    invalidateSensor(e, () => {
      e.stopPropagation();
      setTouchData(
        produce((d) => {
          d.touches = [];
          d.engaged = true;
        })
      );
    });
  };

  const handleTouchMove: TouchEventHandler = (e) => {
    invalidateSensor(e, () => {
      e.stopPropagation();
      setTouchData(
        produce((d) => {
          d.touches = [...d.touches, e.changedTouches[0]];
        })
      );
    });
  };

  const handleTouchEnd: TouchEventHandler = (e) => {
    invalidateSensor(e, () => {
      e.stopPropagation();
      setTouchData(
        produce((d) => {
          d.engaged = false;
        })
      );
    });
  };

  return (
    <div
      class={c.ctn}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <input
        type="range"
        class={c.slider}
        ref={sliderRef!}
        step={STEP}
        max={max()}
      />
    </div>
  );
};

export default TouchSensor;
