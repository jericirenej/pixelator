import { Index, type Component } from "solid-js";
import { useImageContext } from "../../../context/Context";
import styles from "./PixelatorConfig.module.scss";

import { TEXT_LABELS } from "../../../constants/constants";

const { rangeSetterLabel, rangeOptionLabel, title } = TEXT_LABELS.PIXELATION_RANGE;

const stepValues = [1, 5, 10];

export const PixelatorConfig: Component = () => {
  const {
    data: { pixelationConfig },
    setContextData,
  } = useImageContext();

  const handleStepChange = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    const newStep = Number(target.value);
    const { val, step } = pixelationConfig;
    const newVal = (val / step) * newStep;
    setContextData("setPixelation", { step: newStep, val: newVal });
  };
  const handleRangeChange = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    const { step } = pixelationConfig;
    setContextData("setPixelation", { step, val: Number(target.value) });
  };

  return (
    <div class={styles.wrapper}>
      <div class={styles.inputWrapper}>
        <label for="range-setter">{title}</label>
        <input
          class={styles.inputWrapper__input}
          id="range-setter"
          type="range"
          min={pixelationConfig.step}
          max={50 * pixelationConfig.step}
          step={pixelationConfig.step}
          value={pixelationConfig.val}
          onInput={handleRangeChange}
        />
        <span
          class={
            styles.inputWrapper__value
          }>{`${pixelationConfig.val}${rangeSetterLabel}`}</span>
      </div>
      <div class={styles.selectWrapper}>
        <label class={styles.selectWrapper__label} for="range-option-input">
          {rangeOptionLabel}
        </label>
        <select
          class={styles.selectWrapper__select}
          id="range-option-input"
          onChange={handleStepChange}>
          <Index each={stepValues}>
            {stepValue => (
              <option
                class={styles.selectWrapper__option}
                value={stepValue()}
                selected={stepValue() === pixelationConfig.step}>
                {stepValue()}
              </option>
            )}
          </Index>
        </select>
      </div>
    </div>
  );
};
