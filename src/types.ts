export interface ImageObject {
  uploaded: File | undefined;
  uploadDataUrl: string | undefined;
  pixelatedDataUrl: string | undefined;
}

export type CropCorners = "T" | "R" | "B" | "L" | "TR" | "TL" | "BR" | "BL";

export type InlineCornerTypes = "L" | "R";
export type BlockCornerTypes = "T" | "B";

export type DragTypes = "corner" | "move";
export type CornerDragConfiguration = { dragType: "corner"; dragConfig: CropCorners };
export type MoveDragConfiguration = { dragType: "move"; dragConfig: null };
export type DragConfigurations = CornerDragConfiguration | MoveDragConfiguration;

export type CropDimensions = Record<
  | "imageHeight"
  | "imageWidth"
  | "imageNaturalWidth"
  | "imageNaturalHeight"
  | "width"
  | "height"
  | "bottom"
  | "top"
  | "left"
  | "right",
  number
> & { ref: HTMLImageElement | null };

export type EventPosition = { clientX: number; clientY: number };

export type MoveActiveEvents = { mouse: "mousemove"; touch: "touchmove" };
export type MoveEndEvents = { mouse: "mouseup"; touch: "touchend" };
export type MoveEvents = MoveActiveEvents | MoveEndEvents;

export type MouseAndTouchEvent<T extends MoveEvents> = T extends "mousemove"
  ? MouseEvent
  : TouchEvent;

export type AspectRatioKey = "shift" | "ctrl" | "alt" | null;

export type ExtractCornerTypes = (type: string) => {
  inlineType: InlineCornerTypes | undefined;
  blockType: BlockCornerTypes | undefined;
};

export type PreserveRatioObject = {
  determinant: "inline" | "block";
  determinantRatio: number;
};
export type PreserveRatioEvaluate = ({
  prevDimensions,
  blockType,
  inlineType,
}: {
  prevDimensions: CropDimensions;
  blockType: BlockCornerTypes | undefined;
  inlineType: InlineCornerTypes | undefined;
}) => PreserveRatioObject;

export type InlineCropDim = { width: number; left: number; right: number };
export type BlockCropDim = { height: number; top: number; bottom: number };

export type PreserveRatioCrop = ({
  cornerTypes,
  dimensions,
  refClientRect,
  inlineDim,
  blockDim,
}: {
  cornerTypes: ReturnType<ExtractCornerTypes>;
  dimensions: CropDimensions;
  refClientRect: DOMRect;
  inlineDim: InlineCropDim;
  blockDim: BlockCropDim;
}) => { inlineDim: InlineCropDim; blockDim: BlockCropDim };

export type PointerPositions = {
  topY: number;
  bottomY: number;
  leftX: number;
  rightX: number;
};

export type ParsedCropCorners = {
  inlineType: InlineCornerTypes | undefined;
  blockType: BlockCornerTypes | undefined;
};

export type UpdateCropDim = {
  refClientRect: DOMRect;
  dimensions: CropDimensions;
  pointerPositions: PointerPositions;
  cornerTypes: ReturnType<ExtractCornerTypes>;
};

export interface ActionButtonProps {
  class?: string;
  onClick?: () => void;
}

export type RenderedImageDimensionLimits = Record<
  "desktop" | "mobile",
  { defaultWidth: number; maximumHeight: number }
>;

type ThemeVariables =
  | "--main-color"
  | "--secondary-color"
  | "--background-gradient"
  | "--active-color";

export type AvailableThemes = "dark" | "gray" | "blue" | "white"|"red";

export type ThemeData = Record<ThemeVariables, string>;
export type Theme = { name: AvailableThemes; theme: ThemeData };
export type Themes = Record<AvailableThemes, Theme>;

export interface NumberImageRatios {
  "--width": number;
  "--mobile-width": number;
}
export type StringifiedImageRatios = {
  [k in keyof NumberImageRatios]: string;
};

export type HelpPhases = "initial" | "upload" | "pixelated";
