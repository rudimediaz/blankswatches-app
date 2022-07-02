import { Motion, Presence } from '@motionone/solid';
import {
  createMemo,
  For,
  Match,
  Show,
  Switch,
  type Component,
} from 'solid-js';
import { useColorQuery } from '../contexts/color';
import c from './ColorName.module.css';

type ColorNameProps = {
  hex: string;
};

const pointKeyframes = [
  ['-50px', 0, '50px', 0],
  [0, '-50px', 0, '50px'],
  ['50px', 0, '-50px', 0],
];

const ColorName: Component<ColorNameProps> = (props) => {
  const [resource] = useColorQuery(() => props.hex);
  const [data] = resource;

  const luminance = () => {
    if (data()) {
      return data()!.colors[0].luminanceWCAG;
    } else {
      if (data.latest) {
        return data.latest.colors[0].luminanceWCAG;
      } else {
        return 0;
      }
    }
  };

  const highContrast = createMemo(() => {
    return luminance() > 0.5;
  });

  return (
    <Presence exitBeforeEnter>
      <Switch>
        <Match when={data.error}>
          <Show when={data.error}>
            <span>error</span>
          </Show>
        </Match>
        <Match when={data.loading}>
          <Motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: [0, 1], y: [-100, 0] }}
            exit={{ opacity: 0, y: [-100, 0] }}
            transition={{
              easing: [0.7, 0.34, 0, 1.05],
              duration: 0.4,
            }}
            class={c.ctn_point}
            classList={{ [c.highcontrast]: highContrast() }}
            data-high-contrast={highContrast()}
          >
            <For each={pointKeyframes}>
              {(keyframe) => (
                <Motion.div
                  animate={{ y: keyframe }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: 0,
                    endDelay: 0,
                  }}
                  class={c.point}
                ></Motion.div>
              )}
            </For>
          </Motion.div>
        </Match>
        <Match when={data() && data.loading === false}>
          <Motion.span
            class={c.namespan}
            classList={{
              [c.highcontrast]: highContrast(),
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              scale: [0, 1],
              opacity: [0, 1],
            }}
            transition={{ easing: [0.7, 0.34, 0, 1.05] }}
            exit={{ opacity: 0, scale: 0 }}
            data-high-contrast={highContrast()}
          >
            {data()!.colors[0].name}
          </Motion.span>
        </Match>
      </Switch>
    </Presence>
  );
};

export default ColorName;
