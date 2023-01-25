import { For, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useImageContext } from "../../../context/Context";
import { downloadHandler } from "../../../utils/fileHandlers";
import { pixelate as pixelatorFunction } from "../../../utils/pixelatorFunction";
import { stylesConcat } from "../../../utils/utils";
import { animation, componentList, type EventTypes, type PictureActionsProps } from "./constants";

import styles from "./PictureActions.module.scss";

export const PictureActions: Component<PictureActionsProps> = p => {
  const {
    clearContextData,
    setContextData,
    data: { croppedDataUrl, pixelatedDataUrl, pixelationConfig },
  } = useImageContext();

  const handleClick = async (type: EventTypes): Promise<void> => {
    if (!type) return;
    switch (type) {
      case "clearUpload":
        return clearContextData("upload");
      case "reset":
        return clearContextData();
      case "back":
        return clearContextData("pixelated");
      case "crop":
        return clearContextData("crop");
      case "pixelate": {
        const pixelatedUrl = await pixelatorFunction(
          croppedDataUrl()!,
          pixelationConfig.val
        );
        setContextData("pixelated", pixelatedUrl);
        return;
      }
      case "download":
        return downloadHandler(pixelatedDataUrl()!);
      default:
        return;
    }
  };

  return (
    <ul class={styles.actions}>
      <For each={componentList[p.type]}>
        {(data, index) => {
          const { component, title, eventType, animationName } = data;
          const { val, unit } = animation;
          return (
            <li
              class={styles.actions__item}
              onClick={() => handleClick(eventType)}
              role="button"
              aria-label={title}
              style={{
                "animation-delay": `${index() * val * 0.5}${unit}`,
                "animation-duration": `${val}${unit}`,
              }}>
              <Dynamic
                component={component}
                class={stylesConcat(styles, ["svg", animationName])}
              />
            </li>
          );
        }}
      </For>
    </ul>
  );
};
