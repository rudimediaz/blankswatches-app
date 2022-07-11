import {
  type Accessor,
  createContext,
  createResource,
  createSignal,
  type ParentProps,
  useContext,
  createEffect,
  on,
} from 'solid-js';
import { z } from 'zod';
import axios from 'axios';

export const colorAPISchema = z.object({
  paletteTitle: z.string(),
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
      rgb: z.object({ r: z.number(), g: z.number(), b: z.number() }),
      hsl: z.object({ h: z.number(), s: z.number(), l: z.number() }),
      lab: z.object({ l: z.number(), a: z.number(), b: z.number() }),
      luminance: z.number(),
      luminanceWCAG: z.number(),
      requestedHex: z.string(),
      distance: z.number(),
    })
  ),
});

export type ColorAPIResponse = z.infer<typeof colorAPISchema>;

function fetchColor(hex: string, controller: AbortController) {
  return axios
    .get('https://api.color.pizza/v1/' + hex, {
      signal: controller.signal,
    })
    .then((response) => colorAPISchema.parseAsync(response.data));
}

export function createColorResource() {
  const controller = new AbortController();
  const [hex, setHex] = createSignal('');
  const value = createResource(hex, async (currentHex) => {
    let requestedHex = await new Promise<string>((resolve) => {
      if (currentHex) {
        resolve(currentHex);
      }
    });

    let data = await fetchColor(requestedHex, controller);

    return data;
  });

  return [
    value,
    setHex,
    { abort: () => controller.abort() },
  ] as const;
}

export type ColorContextValue = ReturnType<
  typeof createColorResource
>;

export const ColorContext = createContext<ColorContextValue>();

export function useColorQuery(hex: Accessor<string>) {
  const [resource, setHex, utils] = useContext(ColorContext)!;

  createEffect(
    on(
      hex,
      (hexValue) => {
        setHex(hexValue);
      },
      { defer: true }
    )
  );

  return [resource, utils] as const;
}

export function useColorContext() {
  const context = useContext(ColorContext);

  if (!context) {
    throw new Error('not in scoped');
  } else {
    return context;
  }
}

export const ColorProvider = (props: ParentProps) => {
  const value = createColorResource();

  return (
    <ColorContext.Provider value={value}>
      {props.children}
    </ColorContext.Provider>
  );
};
