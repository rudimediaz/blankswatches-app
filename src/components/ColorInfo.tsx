import { Match, Switch, type Component } from 'solid-js';
import { useColorContext } from '../contexts/color';

const ColorInfo: Component = () => {
  const [resource] = useColorContext();

  const [data] = resource;

  return (
    <Switch>
      <Match when={data.error}>
        <div>error</div>
      </Match>
      <Match when={data.loading}>
        <div>data loading</div>
      </Match>
      <Match when={data()}>
        <div>
          <div>data ready</div>
          <div>bookmarks link</div>
        </div>
      </Match>
    </Switch>
  );
};

export default ColorInfo;
