import defaultTo from 'lodash-es/defaultTo';
import memoize from 'lodash-es/memoize';
import pick from 'lodash-es/pick';
import random from 'lodash-es/random';
import {
  createContext,
  createMemo,
  useContext,
  type ParentProps,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { z } from 'zod';

export const hslSchema = z.object({
  h: z.number().nonnegative(),
  s: z.number().nonnegative(),
  l: z.number().nonnegative(),
});

export type HSL = z.infer<typeof hslSchema>;

export function createHSL(...hsl: number[]): HSL {
  const [h, s, l] = hsl;

  return {
    h: defaultTo(h, random(0, 360)),
    s: defaultTo(s, random(30, 90)),
    l: defaultTo(l, random(40, 60)),
  };
}

export function hslToString(hsl: HSL) {
  return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`;
}

export function hslToRawString(hsl: HSL) {
  return hslToString(hsl).replace(/[hsl()]/g, '');
}

const INITIAL_HSL = createHSL(0, 0, 0);

export function createSwatchesStore(initialHSL = INITIAL_HSL) {
  const [state, setState] = createStore({
    current: { ...initialHSL },
    session: { ...initialHSL },
  });

  return [
    state,
    {
      boot(input: HSL) {
        setState(
          produce((d) => {
            d.current = input;
            d.session = input;
          })
        );
      },
      updateCurrent(input: Partial<HSL>) {
        setState(
          produce((d) => {
            d.current = { ...d.current, ...input };
          })
        );
      },
      resumeFromLargeScreen() {
        setState(
          produce((d) => {
            d.session = d.current;
          })
        );
      },
    },
  ] as const;
}

export type SwatchesContextValue = ReturnType<
  typeof createSwatchesStore
>;

const SwatchesContext = createContext<SwatchesContextValue>();

export function useSwatchesContext() {
  const context = useContext(SwatchesContext);

  if (!context) {
    throw new Error('not in scope');
  } else {
    return context;
  }
}

export function createHSLString(context: SwatchesContextValue) {
  const [state] = context;

  const value = createMemo(() => {
    return hslToString(state.current);
  });

  return value;
}

export function createHSLRawString(context: SwatchesContextValue) {
  const [state] = context;

  const value = createMemo(() => {
    return hslToRawString(state.current);
  });

  return value;
}

const GRADIENT_LENGTH = {
  h: 361,
  s: 100,
  l: 100,
};

function createStaticGradients(key: keyof HSL) {
  const length = GRADIENT_LENGTH[key];
  const arr: Partial<HSL>[] = [];

  for (let i = 0; i < length; i++) {
    arr.push({ [key]: i });
  }

  return arr;
}

export const memoizedCreateStaticGradients = memoize(
  createStaticGradients
);

export function createGradients(
  key: keyof HSL,
  context: SwatchesContextValue
) {
  const [state] = context;

  const value = createMemo(() => {
    const staticGradients = memoizedCreateStaticGradients(key);
    const dynamic = pick(state.current, 'h', 's', 'l');
    const gradients = staticGradients.map((part) => {
      return hslToString({ ...dynamic, ...part });
    });

    return gradients.join(', ');
  });

  return value;
}

export const SwatchesProvider = (props: ParentProps) => {
  const value = createSwatchesStore();
  return (
    <SwatchesContext.Provider value={value}>
      {props.children}
    </SwatchesContext.Provider>
  );
};

export function formatGradient(colors: string) {
  return `linear-gradient(to right, ${colors})`;
}
