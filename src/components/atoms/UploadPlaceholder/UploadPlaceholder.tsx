import { Setter, type Component } from "solid-js";
import { ImageSvg } from "../Icons/ImageSvg";
import styles from "./UploadPlaceholder.module.scss";

interface UploadPlaceholderProps {
  setError: Setter<string|null>
  onChange: (e: Event) => Promise<void>
}

export const UploadPlaceholder: Component<UploadPlaceholderProps> = (p) => {
  let inputRef!:HTMLInputElement;
  const handleClick = () => {
    p.setError(null);
    inputRef.click()
  };
  const handleUpload = (e:Event) => p.onChange(e);
  return (
    <>
      <ImageSvg class={styles.svg} onClick={handleClick} />
      <input
        accept="image"
        ref={inputRef}
        onChange={handleUpload}
        type="file"
        id="file-input"
        class={styles.input}
      />
    </>
  );
};
