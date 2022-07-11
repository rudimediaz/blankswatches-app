import {
  type JSX,
  type Component,
  createSignal,
  createSelector,
  Switch,
  Match,
} from 'solid-js';
import Card from '../shared/Card';
import ColorInfo from './ColorInfo';
import c from './TabbedWidget.module.css';

type ClickHandler = JSX.EventHandler<HTMLButtonElement, MouseEvent>;

type TabButtonProps = {
  label: string;
  value: number;
  onClick?: ClickHandler;
  selected: boolean;
};

const TabButton: Component<TabButtonProps> = (props) => {
  return (
    <button
      classList={{ [c.selected]: props.selected }}
      textContent={props.label}
      value={`${props.value}`}
      onClick={props.onClick}
    ></button>
  );
};

const TabbedWidget: Component = () => {
  const [tabId, setTabId] = createSignal(1);

  const handleTabButton: ClickHandler = (e) => {
    setTabId(+e.currentTarget.value);
  };

  const selected = createSelector(tabId);

  return (
    <Card class={c.ctn}>
      <div class={c.tab_head}>
        <TabButton
          value={1}
          label="Info"
          selected={selected(1)}
          onClick={handleTabButton}
        />
        <TabButton
          value={2}
          label="Bookmarks"
          selected={selected(2)}
          onClick={handleTabButton}
        />
      </div>
      <Switch>
        <Match when={tabId() === 1}>
          <ColorInfo />
        </Match>
        <Match when={tabId() === 2}>
          <div>bookmarks content</div>
        </Match>
      </Switch>
    </Card>
  );
};

export default TabbedWidget;
