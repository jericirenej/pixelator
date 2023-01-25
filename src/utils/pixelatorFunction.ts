import type { CropDimensions } from "../types";
import { asyncImageSrc } from "./promisified";

export const extractCrop = (selection: CropDimensions): string | null => {
  const {
    imageNaturalHeight,
    imageNaturalWidth,
    width,
    height,
    left,
    top,
    imageHeight,
    imageWidth,
    ref,
  } = selection;
  if (!ref) return null;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const heightRatio = imageNaturalHeight / imageHeight,
    widthRatio = imageNaturalWidth / imageWidth;

  canvas.width = width * widthRatio;
  canvas.height = height * heightRatio;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    ref,
    left * widthRatio,
    top * heightRatio,
    width * widthRatio,
    height * heightRatio,
    0,
    0,
    width * widthRatio,
    height * heightRatio
  );
  return canvas.toDataURL();
};

export const pixelate = async (
  sourceImageUrl: string,
  pixelationFactor: number
): Promise<string> => {
  const sourceImage = await asyncImageSrc(sourceImageUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const { naturalHeight, naturalWidth } = sourceImage;

  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  ctx.drawImage(sourceImage, 0, 0, naturalWidth, naturalHeight);
  const imgData = ctx.getImageData(0, 0, naturalWidth, naturalHeight).data;

  if (pixelationFactor === 0) return canvas.toDataURL();

  for (let y = 0; y < naturalHeight; y += pixelationFactor) {
    for (let x = 0; x < naturalWidth; x += pixelationFactor) {
      const pixelPosition = (x + y * naturalWidth) * 4;
      const newData = new Array(4).fill(0).map((_, i) => imgData[pixelPosition + i]);
      ctx.fillStyle = `rgba(${newData.join(",")})`;
      ctx.fillRect(x, y, pixelationFactor, pixelationFactor);
    }
  }
  return canvas.toDataURL();
};
