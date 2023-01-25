import {
  createContext,
  createSignal,
  useContext,
  type Component,
  type ParentProps,
  type Setter
} from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import { STORAGE_KEY } from "../constants/constants";
import { THEMES } from "../constants/themes";
import type { AvailableThemes, ThemeData } from "../types";

// PIXELATION-RELATED CONTEXT
interface PixelationConfig {
  val: number;
  step: number;
}

const defaultPixelationConfig: PixelationConfig = { val: 1, step: 1 };
export type DataTypes = "upload" | "crop" | "pixelated";
export type AllDataTypes = "upload" | "crop" | "pixelated" | "setPixelation";
type SetContextValType<T extends AllDataTypes> = T extends DataTypes
  ? string
  : T extends "setPixelation"
  ? PixelationConfig
  : never;

const assertGuard = <T extends AllDataTypes>(arg: unknown, check: T): arg is T =>
  arg === check;

export const imageObject = () => {
  const [uploadDataUrl, setUploadDataUrl] = createSignal<string | undefined>();
  const [croppedDataUrl, setCroppedDataUrl] = createSignal<string | undefined>();
  const [pixelatedDataUrl, setPixelatedDataUrl] = createSignal<string | undefined>();
  const [pixelationConfig, setPixelationConfig] = createStore<PixelationConfig>(
    defaultPixelationConfig
  );

  const methodMap: Record<DataTypes, Setter<string | undefined>> &
    Record<"setPixelation", SetStoreFunction<PixelationConfig>> = {
    upload: setUploadDataUrl,
    crop: setCroppedDataUrl,
    pixelated: setPixelatedDataUrl,
    setPixelation: setPixelationConfig,
  };
  return {
    data: {
      uploadDataUrl,
      croppedDataUrl,
      pixelatedDataUrl,
      pixelationConfig,
    },
    setContextData<T extends AllDataTypes>(type: T, val: SetContextValType<T>) {
      const isPixelationFactor = assertGuard(type, "setPixelation");
      if (isPixelationFactor) {
        return methodMap[type](val as SetContextValType<typeof type>);
      }
      return methodMap[type satisfies DataTypes](val as SetContextValType<DataTypes>);
    },
    clearContextData(type?: DataTypes) {
      if (type) return methodMap[type](undefined);
      setPixelatedDataUrl(undefined);
      setUploadDataUrl(undefined);
      setPixelationConfig(defaultPixelationConfig);
    },
  } as const;
};

type ImageContextType = ReturnType<typeof imageObject>;

export const ImageContext = createContext<ImageContextType>(imageObject());

// THEME_RELATED CONTEXT

export const themeObject = () => {
  const themes = THEMES;
  const defaultTheme: AvailableThemes = "dark";
  const [theme, setTheme] = createSignal<AvailableThemes>(defaultTheme);
  const [saveToStorage, setSaveToStorage] = createSignal<boolean>(false);

  const toggleSavePermission = (val: boolean) => {
    if (!val) {
      [STORAGE_KEY.theme, STORAGE_KEY.save].forEach(key =>
        localStorage.removeItem(key)
      );
    } else {
      localStorage.setItem(STORAGE_KEY.save, "true");
    }
    setSaveToStorage(val);
  };
  const setContentTheme = (data: ThemeData): void => {
    const metaTag = document.head.querySelector(
      "[name='theme-color']"
    ) as HTMLMetaElement;
    metaTag.content = data["--main-color"];
  };
  const implementChosenTheme = () => {
    const chosen = themes[theme()].theme;
    const savePermit = saveToStorage();
    Object.entries(chosen).forEach(([key, val]) =>
      document.body.style.setProperty(key, val)
    );

    setContentTheme(chosen)
    if (savePermit) {
      const storage = localStorage.getItem(STORAGE_KEY.theme);
      if (storage !== theme()) localStorage.setItem(STORAGE_KEY.theme, theme());
    }
  };

  const setCurrentTheme = (theme: AvailableThemes) => {
    setTheme(theme);
    implementChosenTheme();
  };
  const initializeTheme = () => {
    const saveState = !!localStorage.getItem(STORAGE_KEY.save);
    setSaveToStorage(saveState);
    if (saveState) {
      const storage = localStorage.getItem(STORAGE_KEY.theme) as AvailableThemes | null;
      if (storage && storage !== theme()) setTheme(storage);
    }
    implementChosenTheme();
  };

  return {
    theme,
    setSaveToStorage,
    initializeTheme,
    implementChosenTheme,
    toggleSavePermission,
    setCurrentTheme,
    saveToStorage,
  } as const;
};

type ThemeContextType = ReturnType<typeof themeObject>;

export const ThemeContext = createContext<ThemeContextType>(themeObject());

export const ContextProvider: Component<ParentProps> = props => {
  return (
    <ThemeContext.Provider value={ThemeContext.defaultValue}>
      <ImageContext.Provider value={ImageContext.defaultValue}>
        {props.children}
      </ImageContext.Provider>
    </ThemeContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
export const useThemeContext = () => useContext(ThemeContext);
