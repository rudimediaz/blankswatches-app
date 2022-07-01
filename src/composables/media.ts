import { createSignal, onCleanup, onMount } from 'solid-js';

type MediaContext = {
  matches: boolean;
};

export function useMedia(mediaQuery: string) {
  const media = matchMedia(mediaQuery);
  const [matches, setMatches] = createSignal(media.matches);

  onMount(() => {
    let callback = (ctx: MediaContext) => {
      setMatches(ctx.matches);
    };

    media.addEventListener('change', callback);

    onCleanup(() => {
      media.removeEventListener('change', callback);
    });
  });

  return matches;
}
