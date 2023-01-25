import { Motion, Presence } from "@motionone/solid";
import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  type Component
} from "solid-js";
import { useImageContext } from "../../../context/Context";
import { HelpPhases } from "../../../types";
import { DeleteSvg } from "../../atoms/Icons/DeleteSvg";
import { QuestionMarkSvg } from "../../atoms/Icons/QuestionMarkSvg";
import { HelpSteps } from "../../atoms/InfoSteps/HelpSteps";
import styles from "./Help.module.scss";

export const Help: Component = () => {
  const {
    data: { uploadDataUrl, pixelatedDataUrl },
  } = useImageContext();
  const [showInfo, setShowInfo] = createSignal<boolean>(false);
  const [helpStep, setHelpStep] = createSignal<HelpPhases>("initial");

  let sectionRef!: HTMLDivElement;
  const clickOutside = (e: Event) => {
    if (!e.composedPath().includes(sectionRef)) setShowInfo(false);
  };
  onMount(() => {
    window.addEventListener("click", clickOutside);
    onCleanup(() => window.removeEventListener("click", clickOutside));
  });

  createEffect(() => {
    if (pixelatedDataUrl()) return setHelpStep("pixelated");
    if (uploadDataUrl()) return setHelpStep("upload");
    setHelpStep("initial");
  });

  return (
    <div class={styles.wrapper} ref={sectionRef}>
      <Presence>
        <Show when={!showInfo()}>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0, transition: { delay: 0 } }}
            transition={{ duration: 0.3 }}>
            <div class={styles.infoIcon} onClick={() => setShowInfo(true)}>
              <p class={styles.infoIcon__text}>Help</p>
              <QuestionMarkSvg class={styles.infoIcon__icon} />
            </div>
          </Motion.div>
        </Show>
      </Presence>
      <Presence>
        <Show when={showInfo()}>
          <Motion.div
            class={styles.infoWrapper}
            initial={{ width: 0, opacity: 0, height: "275px" }}
            animate={{ opacity: 1, width: "275px", transition: { delay: 0.3 } }}
            exit={{ width: 0, opacity: 0, transition: { delay: 0 } }}
            transition={{ duration: 0.3 }}>
            <h2>Pixelator Info</h2>
            <section class={styles.infoSection}>
              <HelpSteps step={helpStep()} />
            </section>
            <div class={styles.footer}>
              <small class={styles.footer__text}>
                Made with{" "}
                <a href="https://www.solidjs.com/" target="_blank">
                  SolidJS
                </a>
              </small>
              <DeleteSvg
                class={styles.footer__closeIcon}
                onClick={() => setShowInfo(false)}
              />
            </div>
          </Motion.div>
        </Show>
      </Presence>
    </div>
  );
};
