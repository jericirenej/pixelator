import { Motion, Presence } from "@motionone/solid";
import { Show, type Component } from "solid-js";
import { useImageContext } from "../../../context/Context";
import styles from "./RenderImage.module.scss";

export interface ImageProps {
  src: string | undefined;
  rounded?: boolean;
  deletable?: boolean;
  width?: string;
  ref?: HTMLImageElement;
  allowExternal?: boolean;
  imageLoaded?: () => unknown;
}

export const RenderImage: Component<ImageProps> = p => {
  const { clearContextData } = useImageContext();
  const loaded = () => p.imageLoaded && p.imageLoaded();
  return (
    <Presence exitBeforeEnter>
      <Show when={!!p.src}>
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3 }}>
          <div
            style={{ width: `${p.width ? p.width : "100%"}` }}
            class={styles.container}>
            <img
              crossOrigin={p.allowExternal ? "anonymous" : ""}
              classList={{ [styles.img]: true, [styles.rounded]: p.rounded }}
              src={p.src as string}
              ref={p.ref}
              onLoad={loaded}
            />
            <span
              classList={{
                [styles.delete]: true,
                [styles.hide]: !p.deletable,
                [styles.rounded]: p.rounded,
              }}
              onClick={() => clearContextData()}
              title="Delete"
            />
          </div>
        </Motion.div>
      </Show>
    </Presence>
  );
};
