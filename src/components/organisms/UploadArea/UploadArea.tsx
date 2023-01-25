import {
  Component,
  createEffect,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Switch
} from "solid-js";
import { createStore } from "solid-js/store";
import { useImageContext } from "../../../context/Context";
import type { CropDimensions, StringifiedImageRatios } from "../../../types";
import { loadHandler } from "../../../utils/fileHandlers";
import { extractCrop } from "../../../utils/pixelatorFunction";
import { imageWaitForLoad } from "../../../utils/promisified";
import { determineImageRatios, throttle } from "../../../utils/utils";
import { PixelatorConfig } from "../../atoms/PixelatorConfig/PixelatorConfig";
import { RenderImage } from "../../atoms/RenderImage/RenderImage";
import { UploadMessage } from "../../atoms/UploadMessage/UploadMessage";
import { UploadPlaceholder } from "../../atoms/UploadPlaceholder/UploadPlaceholder";
import { PictureActions } from "../../molecules/PictureActions/PictureActions";
import { CropImage } from "../../organisms/CropImage/CropImage";
import styles from "./UploadArea.module.scss";

interface WidthToHeightSignal {
  upload: number;
  pixelated: number;
  client: number;
}

const defaultWidthToHeight: WidthToHeightSignal = {
  upload: 0,
  pixelated: 0,
  client: 0,
};

export const UploadArea: Component = () => {
  const [error, setError] = createSignal<string | null>(null);
  const [clientWidthToHeight, setClientWidthToHeight] =
    createStore<WidthToHeightSignal>(defaultWidthToHeight);
  const [dragActive, setDragActive] = createSignal<boolean>(false);
  const [cropDimensions, setCropDimensions] = createSignal<
    CropDimensions | undefined
  >();
  const [uploadImageDimensions, setUploadImageDimensions] =
    createSignal<StringifiedImageRatios>();

  const pixelatorConfig = () => <PixelatorConfig />;
  const {
    data: { uploadDataUrl, pixelatedDataUrl },
    setContextData,
  } = useImageContext();

  const preventDefault = (e: Event) => e.preventDefault();

  const onResize = throttle(
    (e: Event) =>
      setClientWidthToHeight("client", window.innerWidth / window.innerHeight),
    100
  );

  onMount(() => {
    setClientWidthToHeight("client", window.innerWidth / window.innerHeight);

    ["dragover", "drop"].forEach(
      ev => window.addEventListener(ev, preventDefault),
      false
    );

    window.addEventListener("resize", onResize);
    onCleanup(() => {
      ["dragover", "drop"].forEach(ev =>
        window.removeEventListener(ev, preventDefault, false)
      );
      window.removeEventListener("resize", onResize);
    });
  });

  createEffect(() => {
    !uploadDataUrl() && setCropDimensions(undefined);
  });

  createEffect(() => {
    if (uploadDataUrl()) {
      setUploadImageDimensions(
        determineImageRatios(clientWidthToHeight.upload, clientWidthToHeight.client)
      );
    }
  });

  const handleCrop = (data: CropDimensions): void => {
    setCropDimensions(data);
    setContextData("crop", extractCrop(data) ?? "");
    const { width, height } = data;
    setClientWidthToHeight("pixelated", width / height);
  };

  const setImageRatio = async (src: string): Promise<void> => {
    const img = new Image();
    await imageWaitForLoad(img, src);
    setClientWidthToHeight("upload", img.naturalWidth / img.naturalHeight);
  };

  const uploadImage = async (e: Event): Promise<void> => {
    try {
      const input = e.target as HTMLInputElement;
      const imgData = await loadHandler(input);
      if (imgData) {
        const { uploadDataUrl } = imgData;
        await setImageRatio(uploadDataUrl);
        setContextData("upload", uploadDataUrl);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleDrag = (type: "enter" | "leave") => {
    if (type === "enter") setDragActive(true);
    if (type === "leave") setDragActive(false);
  };

  const handleDrop = async (e: DragEvent): Promise<void> => {
    setDragActive(false);
    try {
      if (e.dataTransfer) {
        const imgData = await loadHandler(e.dataTransfer);
        if (imgData) {
          const { uploadDataUrl } = imgData;
          await setImageRatio(uploadDataUrl);
          setContextData("upload", uploadDataUrl);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div
      classList={{
        [styles.outerContainer]: true,
        [styles.outerContainer_dragActive]: dragActive(),
      }}>
      <Switch>
        <Match when={!uploadDataUrl()}>
          <div
            class={styles.uploadContainer}
            onDragOver={() => handleDrag("enter")}
            onDragLeave={() => handleDrag("leave")}
            onDrop={e => handleDrop(e)}>
            <div class={styles.uploadContainer__svgPlaceholder}>
              <UploadPlaceholder onChange={uploadImage} setError={setError} />
            </div>
            <UploadMessage error={error()} class={styles.uploadContainer__message} />
          </div>
        </Match>
        <Match when={uploadDataUrl() && !pixelatedDataUrl()}>
          <div style={uploadImageDimensions()} class={styles.pictureContainer}>
            <div class={styles.actionsWrapper}>
              <PictureActions type="prepare" />
            </div>
            <div class={styles.pixelationFactorWrapper}>{pixelatorConfig()}</div>
            <CropImage
              src={uploadDataUrl()!}
              selectionListener={handleCrop}
              presetDimensions={cropDimensions()}
            />
          </div>
        </Match>
        <Match when={pixelatedDataUrl()}>
          <div
            class={styles.pixelatedContainer}
            style={determineImageRatios(
              clientWidthToHeight.pixelated,
              clientWidthToHeight.client
            )}>
            <div class={styles.actionsWrapper}>
              <PictureActions type="result" />
            </div>
            <RenderImage src={pixelatedDataUrl()!} />
          </div>
        </Match>
      </Switch>
    </div>
  );
};
