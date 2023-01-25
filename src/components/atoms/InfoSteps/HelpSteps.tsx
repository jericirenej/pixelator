import { Match, Switch, type Component } from "solid-js";
import { TEXT_LABELS } from "../../../constants/constants";
import { HelpPhases } from "../../../types";
import { ArrowCircleSvg } from "../Icons/ArrowCircleSvg";
import { CropImageSvg } from "../Icons/CropImageSvg";
import { DeleteSvg } from "../Icons/DeleteSvg";
import { DownloadSvg } from "../Icons/DownloadSvg";
import { GoBackSvg } from "../Icons/GoBackSvg";
import styles from "./HelpSteps.module.scss";

const { clearPicture, pixelate, resetCrop, reset, download, back } =
  TEXT_LABELS.PICTURE_ACTIONS;

interface HelpStepProps {
  step: HelpPhases;
}
export const HelpSteps: Component<HelpStepProps> = p => {
  return (
    <div class={styles.wrapper}>
      <Switch>
        <Match when={p.step === "initial"}>
          <article class={styles.initial}>
            <p>
              <b>Start</b> by uploading a picture. Click the placeholder or drag a file
              onto it.
            </p>
            <p>The help section will be updated at each step to guide you through.</p>
            <p>Check back after uploading an image for more info!</p>
          </article>
        </Match>
        <Match when={p.step === "upload"}>
          <ul class={styles.infoList}>
            <li class={styles.infoList__item}>
              <DeleteSvg />
              <span>{clearPicture}</span>
            </li>
            <li class={styles.infoList__item}>
              <CropImageSvg />
              <span>{resetCrop}</span>
            </li>
            <li class={styles.infoList__item}>
              <ArrowCircleSvg />
              <span>{pixelate}</span>
            </li>
          </ul>
          <div class={styles.infoList__hint}>
            <span>
              Hint: While cropping, hold{" "}
              <b>
                <pre>shift</pre>
              </b>{" "}
              to preserve aspect ratio.
            </span>
          </div>
        </Match>
        <Match when={p.step === "pixelated"}>
          <ul class={styles.infulist}>
            <li class={styles.infoList__item}>
              <GoBackSvg />
              <span>{back}</span>
            </li>
            <li class={styles.infoList__item}>
              <DeleteSvg />
              <span>{reset}</span>
            </li>
            <li class={styles.infoList__item}>
              <DownloadSvg />
              <span>{download}</span>
            </li>
          </ul>
        </Match>
      </Switch>
    </div>
  );
};
