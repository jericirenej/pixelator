
export const asyncReadFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), {
      once: true,
    });
    reader.addEventListener("error", () => reject, { once: true });
    reader.readAsDataURL(file);
  });
};
export const asyncImageSrc = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => reject, { once: true });
    image.src = src;
  });
};

export const imageWaitForLoad = (img: HTMLImageElement, src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => reject, { once: true });
    img.src = src;
  });
};
