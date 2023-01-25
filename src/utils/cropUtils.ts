import {
  bLeft,
  bRight,
  INITIAL_CLIP_PATH,
  tLeft,
  tRight
} from "../constants/constants";
import type {
  AspectRatioKey,
  BlockCornerTypes,
  BlockCropDim,
  CornerDragConfiguration,
  CropDimensions,
  EventPosition,
  InlineCornerTypes,
  InlineCropDim,
  MoveEvents,
  ParsedCropCorners,
  PointerPositions,
  PreserveRatioCrop,
  UpdateCropDim
} from "../types";

export const isMouseEvent = (ev: Event): ev is MouseEvent => ev.type.includes("mouse");
export const isTouchEvent = (ev: Event): ev is TouchEvent => ev.type.includes("touch");

export const addOrRemoveHandler = (
  e: MouseEvent | TouchEvent,
  { mouse, touch }: MoveEvents,
  handler: (e: MouseEvent | TouchEvent) => void,
  type: "add" | "remove" = "add"
) => {
  const config = isMouseEvent(e) ? mouse : isTouchEvent(e) ? touch : null;
  if (!config) return;
  if (type === "add") {
    document.addEventListener(config, handler);
    return;
  }
  if (type === "remove") {
    document.removeEventListener(config, handler);
    return;
  }
};

export const defaultCropDimensions = (
  ref: HTMLImageElement | null = null
): CropDimensions => {
  const width = ref?.width ?? 0,
    height = ref?.height ?? 0,
    naturalHeight = ref?.naturalHeight ?? 0,
    naturalWidth = ref?.naturalWidth ?? 0;
  return {
    width,
    height,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    imageWidth: width,
    imageHeight: height,
    imageNaturalWidth: naturalWidth,
    imageNaturalHeight: naturalHeight,
    ref,
  };
};

export const cropToPixels = (
  dimensions: CropDimensions
): Record<keyof CropDimensions, string> => {
  const keys = Object.keys(dimensions) as (keyof CropDimensions)[];
  const pixelDimensions = keys.reduce((pixelDim, key) => {
    pixelDim[key] = `${dimensions[key]}px`;
    return pixelDim;
  }, {} as Record<keyof CropDimensions, string>);
  return pixelDimensions;
};

export const extractCornerTypes = (type: string): ParsedCropCorners => {
  const inlineCorners: InlineCornerTypes[] = ["L", "R"],
    blockCorners: BlockCornerTypes[] = ["B", "T"];
  const splitString = type.split("");
  const inlineType = inlineCorners.filter(type => splitString.includes(type))[0];
  const blockType = blockCorners.filter(type => splitString.includes(type))[0];
  return {
    inlineType,
    blockType,
  };
};

export const extractEventPosition = (ev: MouseEvent | TouchEvent): EventPosition => {
  if (isMouseEvent(ev)) {
    return { clientX: ev.clientX, clientY: ev.clientY };
  }
  const touch = ev.changedTouches[0];
  return { clientX: touch.clientX, clientY: touch.clientY };
};

export const generatePositions = (
  eventPosition: EventPosition,
  rectBounds: DOMRect,
  dimensions: CropDimensions
): PointerPositions => {
  const { left, right, top, bottom } = rectBounds;
  const obj = {
    topY:
      eventPosition.clientY <= top
        ? top
        : eventPosition.clientY >= bottom - dimensions.bottom
        ? bottom - dimensions.bottom
        : eventPosition.clientY >= bottom
        ? bottom
        : eventPosition.clientY,
    bottomY:
      eventPosition.clientY >= bottom
        ? bottom
        : eventPosition.clientY <= top + dimensions.top
        ? top + dimensions.top
        : eventPosition.clientY,
    rightX:
      eventPosition.clientX >= right
        ? right
        : eventPosition.clientX <= left + dimensions.left
        ? left + dimensions.left
        : eventPosition.clientX,
    leftX:
      eventPosition.clientX <= left
        ? left
        : eventPosition.clientX >= right - dimensions.right
        ? right - dimensions.right
        : eventPosition.clientX,
  };
  return obj;
};

export const generateUpdatedBlock = ({
  refClientRect,
  dimensions,
  pointerPositions,
  cornerTypes,
}: UpdateCropDim): BlockCropDim => {
  const blockDim: BlockCropDim = {
    height: dimensions.height,
    top: dimensions.top,
    bottom: dimensions.bottom,
  };
  const { blockType } = cornerTypes;
  if (!blockType) return blockDim;
  const { top, bottom, height } = refClientRect,
    { topY, bottomY } = pointerPositions;
  const updatedBlock =
    blockType === "T"
      ? { top: topY - top, height: bottom - dimensions.bottom - topY }
      : {
          bottom: bottom - bottomY,
          height: height - (bottom - bottomY + dimensions.top),
        };
  return { ...blockDim, ...updatedBlock };
};

export const generateUpdatedInline = ({
  refClientRect,
  dimensions,
  pointerPositions,
  cornerTypes,
}: UpdateCropDim): InlineCropDim => {
  const { inlineType } = cornerTypes;
  const inlineDim: InlineCropDim = {
    width: dimensions.width,
    left: dimensions.left,
    right: dimensions.right,
  };
  if (!inlineType) return inlineDim;
  const { width, left, right } = refClientRect,
    { leftX, rightX } = pointerPositions;

  const updatedInline =
    cornerTypes.inlineType === "R"
      ? { right: right - rightX, width: width - (right - rightX + dimensions.left) }
      : { left: leftX - left, width: width - (leftX - left + dimensions.right) };
  return { ...inlineDim, ...updatedInline };
};

export const preserveAspectCrop: PreserveRatioCrop = ({
  cornerTypes,
  dimensions,
  refClientRect,
  inlineDim,
  blockDim,
}) => {
  const { height, width } = refClientRect,
    { blockType, inlineType } = cornerTypes;
  const heightRatio = height / width;
  let newHeight: number, newWidth: number, diff: number;
  if (blockType) {
    (newHeight = blockDim.height), (newWidth = blockDim.height / heightRatio);
  } else {
    (newWidth = inlineDim.width), (newHeight = inlineDim.width * heightRatio);
  }

  // We default to the blockType and modify the horizontal.
  if (blockType) {
    diff = newWidth - dimensions.width;
    const newInline = { ...inlineDim };
    newInline.width = newWidth;
    const primary = !inlineType || inlineType === "R" ? "right" : "left";
    const secondary = primary === "right" ? "left" : "right";
    const correction = dimensions[primary] - diff;
    const isNegative = correction < 0;
    newInline[primary] = isNegative ? 0 : correction;
    newInline[secondary] = isNegative
      ? dimensions[secondary] + correction
      : dimensions[secondary];

    return { inlineDim: newInline, blockDim };
  }
  // If we pull only the inline control, then we adjust the block.
  diff = newHeight - dimensions.height;
  const newBlock = { ...blockDim, height: newHeight };
  const bottomCorrection = height - newHeight - dimensions.top;
  const newBottom = bottomCorrection < 0 ? 0 : bottomCorrection;

  newBlock.bottom = newBottom;
  newBlock.top += bottomCorrection < 0 ? bottomCorrection : 0;
  return { inlineDim, blockDim: { ...newBlock } };
};

export const cornerHandler = ({
  config,
  refClientRect,
  dimensions,
  eventPosition,
  preserveAspectRatio,
}: {
  config: CornerDragConfiguration;
  refClientRect: DOMRect;
  dimensions: CropDimensions;
  eventPosition: EventPosition;
  preserveAspectRatio: boolean;
}): Partial<CropDimensions> => {
  const update: Partial<CropDimensions> = {};
  const { dragConfig } = config;
  const pointerPositions = generatePositions(eventPosition, refClientRect, dimensions);
  const cornerTypes = extractCornerTypes(dragConfig);

  const generateArgs = {
    refClientRect,
    cornerTypes,
    pointerPositions,
    dimensions,
  };

  const blockDim = generateUpdatedBlock(generateArgs),
    inlineDim = generateUpdatedInline(generateArgs);
  if (preserveAspectRatio) {
    const data = preserveAspectCrop({
      ...generateArgs,
      inlineDim,
      blockDim,
    });
    return { ...update, ...data.inlineDim, ...data.blockDim };
  }

  return {
    ...update,
    ...blockDim,
    ...inlineDim,
  };
};

export const moveHandler = ({
  dimensions,
  eventPosition,
  prevPosition,
}: {
  dimensions: CropDimensions;
  eventPosition: EventPosition;
  prevPosition: EventPosition;
}): Partial<CropDimensions> => {
  let update: Partial<CropDimensions> = {};
  const dx = eventPosition.clientX - prevPosition.clientX,
    dy = eventPosition.clientY - prevPosition.clientY,
    { top, bottom, left, right } = dimensions;

  // If dy is less than 0, we are moving the crop container UP,
  // otherwise we are moving it DOWN.
  if (dy < 0) {
    const newTop = top + dy >= 0 ? top + dy : 0;
    update = { ...update, top: newTop, bottom: bottom + top - newTop };
  } else {
    const newBottom = bottom - dy >= 0 ? bottom - dy : 0;
    update = { ...update, bottom: newBottom, top: top + bottom - newBottom };
  }
  //If dx is less than 0, we are moving the crop container LEFT,
  // otherwise we are moving it RIGHT.
  if (dx < 0) {
    const newLeft = left + dx >= 0 ? left + dx : 0;
    update = { ...update, left: newLeft, right: right + left - newLeft };
  } else {
    const newRight = right - dx >= 0 ? right - dx : 0;
    update = { ...update, right: newRight, left: left + right - newRight };
  }
  return update;
};

export const maskClipPath = (
  dimensions: CropDimensions,
  initial = false
): { "clip-path": string } => {
  const { top, bottom, left, right, imageHeight, imageWidth } = dimensions;
  const r = {
    left: left / imageWidth,
    right: (imageWidth - right) / imageWidth,
    top: top / imageHeight,
    bottom: (imageHeight - bottom) / imageHeight,
  };
  const polygonRatios = initial
    ? INITIAL_CLIP_PATH
    : [
        tLeft,
        bLeft,
        [r.left, 1],
        [r.left, r.top],
        [r.right, r.top],
        [r.right, r.bottom],
        [r.left, r.bottom],
        [r.left, 1],
        bRight,
        tRight,
      ];
  const stringifiedRatioPercentages = polygonRatios
    .map(coords => coords.map(entry => `${entry * 100}%`).join(" "))
    .join(",");
  const polygon = `polygon(${stringifiedRatioPercentages})`;
  return { "clip-path": polygon };
};

export const resizeUpdateDimensions = (
  resizeData: ResizeObserverSize,
  current: CropDimensions
): CropDimensions => {
  const { blockSize, inlineSize } = resizeData;
  const config = [
    { dim: ["width", "left", "right"], ratio: inlineSize / current.imageWidth },
    { dim: ["height", "bottom", "top"], ratio: blockSize / current.imageHeight },
  ] as const;
  const newDimensions = {
    ...current,
    imageHeight: blockSize,
    imageWidth: inlineSize,
  };
  config.forEach(({ dim, ratio }) =>
    dim.forEach(d => (newDimensions[d] = newDimensions[d] * ratio))
  );
  return newDimensions;
};

export const shouldPreserveRatio = (
  e: MouseEvent | TouchEvent,
  determinant: AspectRatioKey
): boolean => {
  if (determinant && isMouseEvent(e)) {
    return e[`${determinant}Key`];
  }
  return false;
};
