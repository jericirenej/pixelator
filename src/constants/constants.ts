import type {
  CropCorners,
  MoveActiveEvents,
  MoveEndEvents,
  RenderedImageDimensionLimits
} from "../types";


const baseUnit = 2 ** 10;
const unitTable = [
  [baseUnit ** 2, "MB"],
  [baseUnit, "KB"],
] as const;

export const SOURCE_CODE_LINK = "https://github.com/jericirenej/pixelator"

export const STORAGE_KEY = { theme: "pixelatorTheme", save: "pixelatorState" };

export const bytesToUnits = (bytes: number, locale = "en-US", decimals = 2): string => {
  let unit = "B";
  let finalValue = bytes;
  for (const [value, name] of unitTable) {
    const division = bytes / value;
    if (division < 1) continue;
    finalValue = division;
    unit = name;
    if (division >= 1) break;
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(finalValue);
  return `${formatted} ${unit}`;
};

export const UPLOAD_SIZE_LIMIT = 5 * 2 ** 20
export const RENDERED_IMAGE_DIMENSION_LIMIT: RenderedImageDimensionLimits = {
  desktop: {
    defaultWidth: 50,
    maximumHeight: 75,
  },
  mobile: {
    defaultWidth: 75,
    maximumHeight: 75,
  },
};
export const TEXT_LABELS = {
  MAIN_TITLE: {
    title: "Pixelator",
    subtitleSegments: ["Upload", "Pixelate", "Repeat"],
  },
  UPLOAD_PLACEHOLDER: `Upload picture (max. ${bytesToUnits(UPLOAD_SIZE_LIMIT)})`,
  PICTURE_ACTIONS: {
    clearPicture: "Clear Picture",
    resetCrop: "Reset Crop",
    pixelate: "Pixelate",
    download: "Download Image",
    back: "Go Back",
    reset: "Reset",
  },
  ERRORS: {
    size: "Size limit exceeded!",
    fileType: "Please supply an image file!",
  },
  PIXELATION_RANGE: {
    title: "Pixelation",
    rangeSetterLabel: "px",
    rangeOptionLabel: "Interval",
  },
  THEME_PICKER: {
    title: "Pick color theme",
    close: "Close theme picker",
    saveSettings: "Save",
    saveTitle: "Save to local storage",
  },
};

export const animationConstants = {
  duration: 0.4,
  initialDelay: 1,
  delayFactor: 2,
};

const [corner, top, bottom, left, right, vertical, horizontal] = [
  "corner",
  "top",
  "bottom",
  "left",
  "right",
  "vertical",
  "horizontal",
] as const;
export const CROP_CORNER_CLASSES: Map<CropCorners, string[]> = new Map([
  ["T", [corner, top, vertical]],
  ["B", [corner, bottom, vertical]],
  ["R", [corner, right, horizontal]],
  ["L", [corner, left, horizontal]],
  ["TL", [corner, top, left]],
  ["TR", [corner, top, right]],
  ["BL", [corner, bottom, left]],
  ["BR", [corner, bottom, right]],
]);

export const [tLeft, bLeft, tRight, bRight] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

export const INITIAL_CLIP_PATH = [
  tLeft,
  bLeft,
  bLeft,
  tLeft,
  tRight,
  bRight,
  bLeft,
  bLeft,
  bRight,
  tRight,
] as const;

export const MOVE_EVENTS: { moveActive: MoveActiveEvents; moveEnd: MoveEndEvents } = {
  moveActive: { mouse: "mousemove", touch: "touchmove" },
  moveEnd: { mouse: "mouseup", touch: "touchend" },
};
