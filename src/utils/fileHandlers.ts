import { TEXT_LABELS, UPLOAD_SIZE_LIMIT } from "../constants/constants";
import { asyncReadFile } from "./promisified";

const { ERRORS } = TEXT_LABELS;

export const loadHandler = async (
  target: HTMLInputElement | DataTransfer,
  sizeLimit = UPLOAD_SIZE_LIMIT
): Promise<{ uploaded: File; uploadDataUrl: string } | undefined> => {
  const files = target.files;
  if (files && files.length) {
    const uploaded = files[0];
    const imageRegex = /^image\//;
    const isImage = imageRegex.test(uploaded.type);
    if (!isImage) throw new Error(ERRORS.fileType);
    if (sizeLimit && uploaded.size > sizeLimit) {
      throw new Error(ERRORS.size);
    }
    const uploadDataUrl = await asyncReadFile(uploaded);
    return { uploaded, uploadDataUrl };
  }
  return undefined;
};

export const downloadHandler = async (url: string, name?: string): Promise<void> => {
  const anchor = document.createElement("a") as HTMLAnchorElement;
  anchor.download = name ?? "pixelated";
  anchor.href = url;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
