import {
  Component,
  createEffect,
  createSignal,
  For,
  mergeProps,
  onCleanup,
  onMount,
  Show
} from "solid-js";
import { CROP_CORNER_CLASSES, MOVE_EVENTS } from "../../../constants/constants";
import { useImageContext } from "../../../context/Context";
import type {
  AspectRatioKey,
  CropCorners,
  CropDimensions,
  DragConfigurations
} from "../../../types";
import {
  addOrRemoveHandler,
  cornerHandler,
  cropToPixels,
  defaultCropDimensions,
  extractEventPosition,
  maskClipPath,
  moveHandler,
  resizeUpdateDimensions,
  shouldPreserveRatio
} from "../../../utils/cropUtils";
import { stylesConcat } from "../../../utils/utils";
import { RenderImage } from "../../atoms/RenderImage/RenderImage";
import styles from "./CropImage.module.scss";

const corners = [...CROP_CORNER_CLASSES.entries()];

interface CropImageProps {
  src: string;
  selectionListener?: (data: CropDimensions) => unknown;
  width?: string;
  mask?: boolean;
  aspectRatioKey?: AspectRatioKey;
  showCrop?: boolean;
  presetDimensions?: CropDimensions;
}

type AttachHandlerProps =
  | { e: MouseEvent | TouchEvent; dragType: "corner"; dragConfig: CropCorners }
  | { e: MouseEvent | TouchEvent; dragType: "move" };

export const CropImage: Component<CropImageProps> = props => {
  const { moveActive, moveEnd } = MOVE_EVENTS;
  const {
    data: { croppedDataUrl },
  } = useImageContext();
  const [imgLoaded, setImgLoaded] = createSignal<boolean>(false);
  const [dimensions, setDimensions] = createSignal<CropDimensions>();
  const [containerWidth, setContainerWidth] = createSignal<string>("100%");
  const [dragConfiguration, setDragConfiguration] = createSignal<
    DragConfigurations | undefined
  >();
  const [mask, setMask] = createSignal<{ "clip-path": string }>();
  const [prevPosition, setPrevPosition] = createSignal<{
    clientX: number;
    clientY: number;
  }>();

  let imgRef!: HTMLImageElement;
  const p = mergeProps(
    {
      width: "100%",
      mask: true,
      aspectRatioKey: "shift" as AspectRatioKey,
      showCrop: true,
    },
    props
  );

  const handleImgLoad = () => setImgLoaded(true);

  const cropHandler = (e: MouseEvent | TouchEvent) => {
    const prevDim = dimensions()!;
    const config = dragConfiguration()!;
    const { dragType } = config;
    const eventPosition = extractEventPosition(e);

    let update: Partial<CropDimensions> = {};
    if (dragType === "corner") {
      const preserveAspectRatio = shouldPreserveRatio(e, p.aspectRatioKey);
      const cornerUpdate = cornerHandler({
        config,
        refClientRect: imgRef!.getBoundingClientRect(),
        dimensions: prevDim,
        eventPosition,
        preserveAspectRatio,
      });
      update = { ...update, ...cornerUpdate };
    }
    if (dragType === "move") {
      const moveUpdate = moveHandler({
        dimensions: prevDim,
        eventPosition,
        prevPosition: prevPosition()!,
      });
      update = { ...update, ...moveUpdate };
    }

    if (prevDim) {
      const newDimensions = {
        ...prevDim,
        ...update,
      };
      setPrevPosition(eventPosition);
      setDimensions(newDimensions);
      setMask(maskClipPath(newDimensions));
    }
  };

  const resizeHandler = (resize: readonly ResizeObserverSize[]) => {
    const resizeData = resize && resize[0];
    const current = dimensions();
    if (!resizeData || !current) return;
    const newDimensions = resizeUpdateDimensions(resizeData, current);
    setDimensions({ ...newDimensions });
  };

  const attachMoveHandler = (args: AttachHandlerProps) => {
    const { dragType, e } = args;
    setPrevPosition(extractEventPosition(e));
    if (dragType === "corner") {
      setDragConfiguration({ dragType, dragConfig: args.dragConfig });
    } else {
      setDragConfiguration({
        dragType,
        dragConfig: null,
      });
    }
    addOrRemoveHandler(e, moveActive, cropHandler);
  };

  const removeMoveHandler = (e: MouseEvent | TouchEvent) => {
    setDragConfiguration(undefined);
    setPrevPosition(undefined);
    addOrRemoveHandler(e, moveActive, cropHandler, "remove");
    if (p.selectionListener) p.selectionListener(dimensions()!);
  };

  const setupRemoveHandlers = (type: "add" | "remove" = "add"): void => {
    Object.values(moveEnd).forEach(evType =>
      type === "add"
        ? document.addEventListener(evType, removeMoveHandler)
        : document.removeEventListener(evType, removeMoveHandler)
    );
  };
  // eslint-disable-next-line solid/reactivity
  const resizeObserver = new ResizeObserver(([{ borderBoxSize }]) =>
    resizeHandler(borderBoxSize)
  );

  const pixelDimensions = () => {
    const cropDimensions = dimensions();
    return cropDimensions && cropToPixels(cropDimensions);
  };

  const setDefault = (preset?:CropDimensions) => {
    const defaultDimensions = preset ?? defaultCropDimensions(imgRef);
    setDimensions(defaultDimensions);
    setMask(maskClipPath(defaultDimensions, !preset));
  };

  onMount(() => {
    setupRemoveHandlers();
    p.width && setContainerWidth(p.width);
    resizeObserver.observe(imgRef);
  });

  onCleanup(() => {
    setupRemoveHandlers("remove");
    resizeObserver.disconnect();
  });

  createEffect(() => imgLoaded() && setDefault(p.presetDimensions));
  // Reset to default dimensions, if crop dimensions are cleared, but only
  // once the image has been loaded.
  createEffect(() => !croppedDataUrl() && imgLoaded() && setDefault());

  return (
    <div style={{ position: "relative", width: containerWidth() }}>
      <RenderImage src={p.src} ref={imgRef} imageLoaded={handleImgLoad} />
      <Show when={imgLoaded() && p.showCrop}>
        <Show when={p.mask}>
          <div class={styles.mask} style={mask()} />
        </Show>
        <div class={styles.cropper} style={pixelDimensions()}>
          <div
            class={styles.move}
            onMouseDown={e => attachMoveHandler({ e, dragType: "move" })}
            onTouchStart={e => attachMoveHandler({ e, dragType: "move" })}
          />
          <For each={corners}>
            {corner => {
              const [label, classes] = corner;
              return (
                <span
                  class={stylesConcat(styles, classes)}
                  onMouseDown={e =>
                    attachMoveHandler({ e, dragType: "corner", dragConfig: label })
                  }
                  onTouchStart={e =>
                    attachMoveHandler({ e, dragType: "corner", dragConfig: label })
                  }
                />
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};
