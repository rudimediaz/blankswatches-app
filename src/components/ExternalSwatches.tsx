import {
  createUniqueId,
  type JSX,
  type Component,
  createSignal,
} from 'solid-js';
import { useSwatchesContext } from '../contexts/swatches';
import Card from '../shared/Card';
import c from './ExternalSwatches.module.css';
import Gradients from './Gradients';

type SliderInputInit = {
  value: number;
  target: 'h' | 's' | 'l';
};

type FormControlProps = {
  swatchesType: 'h' | 's' | 'l';
  label: string;
  value: number;
  onInput?: (init: SliderInputInit) => void;
};

const VARIANT = { h: 360, s: 100, l: 100 };

const FormControl: Component<FormControlProps> = (props) => {
  const id = createUniqueId();
  const [focused, setFocused] = createSignal(false);

  const max = VARIANT[props.swatchesType];

  const handleInput: JSX.EventHandler<
    HTMLInputElement,
    InputEvent
  > = (e) => {
    if (props.onInput) {
      props.onInput({
        value: e.currentTarget.valueAsNumber,
        target: props.swatchesType,
      });
    }
  };

  const handleDbClick: JSX.EventHandler<
    HTMLInputElement,
    MouseEvent
  > = (e) => {
    e.stopPropagation();
    if (props.onInput) {
      if (props.swatchesType === 'h') {
        props.onInput({ value: 0, target: props.swatchesType });
      } else if (
        props.swatchesType === 's' ||
        props.swatchesType === 'l'
      ) {
        props.onInput({
          value: VARIANT[props.swatchesType] / 2,
          target: props.swatchesType,
        });
      }
    }
  };

  return (
    <Gradients swatchesKey={props.swatchesType}>
      <label classList={{ [c.focused]: focused() }} for={id}>
        {props.label}
      </label>
      <input
        type="range"
        id={id}
        value={props.value}
        onInput={handleInput}
        max={max}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onDblClick={handleDbClick}
      />
    </Gradients>
  );
};

const ExternalSwatches: Component = () => {
  const swatchesContext = useSwatchesContext();
  const [state, { updateCurrent }] = swatchesContext;

  const handleInput = (init: SliderInputInit) => {
    updateCurrent({
      [init.target]: init.value,
    });
  };
  return (
    <Card class={c.ctn}>
      <div class={c.form_control}>
        <FormControl
          label="Hue"
          value={state.current.h}
          swatchesType="h"
          onInput={handleInput}
        />
      </div>
      <div class={c.form_control}>
        <FormControl
          label="Saturation"
          value={state.current.s}
          swatchesType="s"
          onInput={handleInput}
        />
      </div>
      <div class={c.form_control}>
        <FormControl
          label="Lightness"
          value={state.current.l}
          swatchesType="l"
          onInput={handleInput}
        />
      </div>
    </Card>
  );
};

export default ExternalSwatches;
