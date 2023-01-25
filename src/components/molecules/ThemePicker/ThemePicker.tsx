import { Motion, Presence } from "@motionone/solid";
import {
  createSignal,
  Index,
  onCleanup,
  onMount,
  Show,
  type Component
} from "solid-js";
import { TEXT_LABELS } from "../../../constants/constants";
import { THEMES } from "../../../constants/themes";
import { useThemeContext } from "../../../context/Context";
import { AvailableThemes } from "../../../types";
import { BurgerMenu } from "../../atoms/Icons/BurgerMenuSvg";
import { ThemeOption } from "../../atoms/ThemeOption/ThemeOption";
import styles from "./ThemePicker.module.scss";

const { saveSettings, title, close } = TEXT_LABELS.THEME_PICKER;

export const ThemePicker: Component = () => {
  const [pickerActive, setPickerActive] = createSignal<boolean>(false);
  const [tooltip, setTooltip] = createSignal<string>(title);
  const { theme, setCurrentTheme, saveToStorage, toggleSavePermission } = useThemeContext();
  const themes = THEMES;
  const keys = Object.keys(themes) as AvailableThemes[];
  let wrapperRef!: HTMLDivElement;
  const handleSelect = (chosen: AvailableThemes) => setCurrentTheme(chosen);
  const handleSaveToStorage = (e: Event) => {
    toggleSavePermission((e.target as HTMLInputElement).checked);
  };

  const clickOutside = (e: Event) => {
    if (!e.composedPath().includes(wrapperRef)) setPickerActive(false);
  };
  onMount(() => {
    window.addEventListener("click", clickOutside);
    onCleanup(() => window.removeEventListener("click", clickOutside));
  });
  const pickerToggle = () => {
    const newPicker = !pickerActive();
    setPickerActive(newPicker);
    setTooltip(newPicker ? close : title);
  };

  return (
    <div
      ref={wrapperRef}
      classList={{ [styles.wrapper]: true, [styles.wrapper__active]: pickerActive() }}>
      <div
        onClick={pickerToggle}
        role="button"
        title={tooltip()}
        classList={{
          [styles.menuIcon]: true,
          [styles.menuIcon__active]: pickerActive(),
        }}>
        <BurgerMenu active={pickerActive()} />
      </div>
      <Presence>
        <Show when={pickerActive()}>
          <Motion.div
            class={styles.configMenu}
            initial={{ width: 0, opacity: 0 }}
            animate={{ opacity: 1, width: "120px" }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <ul class={styles.picker}>
              <Index each={keys}>
                {key => (
                  <ThemeOption
                    themeOption={themes[key()]}
                    handleSelect={handleSelect}
                    chosen={theme()}
                  />
                )}
              </Index>
            </ul>
            <div class={styles.save}>
              <label for="set-storage-permission" class={styles.save__label}>
                {saveSettings}
              </label>
              <input
                class={styles.save__input}
                id="set-storage-permission"
                type="checkbox"
                onChange={handleSaveToStorage}
                checked={saveToStorage()}
              />
            </div>
          </Motion.div>
        </Show>
      </Presence>
    </div>
  );
};
