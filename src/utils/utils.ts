import { RENDERED_IMAGE_DIMENSION_LIMIT } from "../constants/constants";
import type {
  NumberImageRatios,
  RenderedImageDimensionLimits,
  StringifiedImageRatios
} from "../types";


/**Concatenate several module styles in a single class string or a classList object.
 * ClassList will evaluate to true for all specified classes.
 */
export function stylesConcat(styleObj: CSSModuleClasses, classes: string[]): string {
  return classes.map(className => styleObj[className]).join(" ");
}
export const throttle = <F extends (...params: Parameters<F>) => ReturnType<F>>(
  fn: F,
  delay: number
) => {
  let shouldWait = false;
  return (...params: Parameters<F>) => {
    if (shouldWait) return;
    fn(...params);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
};

/**Calculate appropriate width of the image by taking into account
 * its native widthToHeightRatio, the client widthToHeight ratio
 * and the maximum allowed height.
 *
 * This presupposes that the width of the image is given relative to the client window width. */
const widthFinder = ({
  widthToHeight,
  clientWidthToHeight,
  defaultWidth,
  maximumHeight,
  percentStep = 3,
}: {
  widthToHeight: number;
  clientWidthToHeight: number;
  defaultWidth: number;
  maximumHeight: number;
  percentStep?: number;
}): number => {
  let newWidth = defaultWidth,
    /* We multiply by client ratio to contextualize the calculated height to the viewport.
    In narrow (portrait oriented) viewports. */
    currentHeight = (newWidth / widthToHeight) * clientWidthToHeight;
  const willOverflow = currentHeight > maximumHeight;
  if (!willOverflow) return newWidth;
  const percent = defaultWidth / 100;
  while (currentHeight > maximumHeight) {
    newWidth -= percent * percentStep;
    currentHeight = (newWidth / widthToHeight) * clientWidthToHeight;
  }
  return newWidth;
};

export const imageRatios = (
  widthToHeight: number,
  clientWidthToHeight: number,
  dimensionLimits: RenderedImageDimensionLimits = RENDERED_IMAGE_DIMENSION_LIMIT,
  finderStep?: number
): NumberImageRatios => {
  const { desktop: d, mobile: m } = dimensionLimits;
  const base = { widthToHeight, clientWidthToHeight, finderStep },
    desktop = { defaultWidth: d.defaultWidth, maximumHeight: d.maximumHeight },
    mobile = { defaultWidth: m.defaultWidth, maximumHeight: m.maximumHeight };
  const desktopWidth = widthFinder({
      ...base,
      ...desktop,
    }),
    mobileWidth = widthFinder({
      ...base,
      ...mobile,
    });
  return { "--width": desktopWidth, "--mobile-width": mobileWidth };
};

/** Determine uploaded image dimensions relative to window dimensions. */
export const determineImageRatios = (
  widthToHeight: number,
  clientWidthToHeight: number,
  unit = "vw",
  dimensionLimits: RenderedImageDimensionLimits = RENDERED_IMAGE_DIMENSION_LIMIT,
  finderStep?: number
): StringifiedImageRatios => {
  const result = imageRatios(
      widthToHeight,
      clientWidthToHeight,
      dimensionLimits,
      finderStep
    ),
    stringifiedRatios = {} as StringifiedImageRatios;
  for (const prop in result) {
    const typedProp = prop as keyof NumberImageRatios;
    stringifiedRatios[typedProp] = `${result[typedProp]}${unit}`;
  }
  return stringifiedRatios;
};
