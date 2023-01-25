import { mergeProps, Show, type Component } from "solid-js";
import { TEXT_LABELS } from "../../../constants/constants";
import styles from "./UploadMessage.module.scss";

const { UPLOAD_PLACEHOLDER } = TEXT_LABELS;

export const UploadMessage: Component<{
  error: string|null;
  class?: string;
}> = props => {
  const p = mergeProps({ class: "" }, props);
  return (
    <div classList={{ message: true, [p.class]: !!p.class }}>
      <Show when={!p.error}>
        <span class={styles.message__description}>{UPLOAD_PLACEHOLDER}</span>
      </Show>
      <Show when={!!p.error}>
        <span class={styles.message__error}>{p.error}</span>
      </Show>
    </div>
  );
};
