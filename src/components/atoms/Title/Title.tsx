import { Index, type Component } from "solid-js";
import { animationConstants, TEXT_LABELS } from "../../../constants/constants";
import styles from "./Title.module.scss";

export const Title: Component = () => {
  const { title, subtitleSegments } = TEXT_LABELS.MAIN_TITLE;
  const { delayFactor, duration, initialDelay } = animationConstants;
  const calculateDelay = (index: number): number => {
    return index === 0 ? initialDelay : initialDelay + index * delayFactor * duration;
  };

  return (
    <div class={styles.container}>
      <h1 class={styles.heading}>{title}</h1>
      <h2 class={styles.subheading}>
        <Index each={subtitleSegments}>
          {(word, index) => (
            <span
              style={{
                "animation-delay": `${calculateDelay(index)}s`,
                "animation-duration": duration + "s",
              }}
              class={styles.subheading__word}>
              {word()}.
            </span>
          )}
        </Index>
      </h2>
    </div>
  );
};
