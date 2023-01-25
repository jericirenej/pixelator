import { createEffect, createSignal, onMount, type Component } from "solid-js";
import type { AvailableThemes, Theme, ThemeData } from "../../../types";
import styles from "./ThemeOption.module.scss";

interface ThemeOptionProps {
  themeOption: Theme;
  chosen: AvailableThemes;
  handleSelect: (name: AvailableThemes) => void;
}

type ThemeSansActive = Omit<ThemeData, "--active-color">;

export const ThemeOption: Component<ThemeOptionProps> = p => {
  const [isChosen, setIsChosen] = createSignal<boolean>(false);
  const [themeData, setThemeData] = createSignal<ThemeSansActive>();

  createEffect(() => setIsChosen(p.themeOption.name === p.chosen));
  onMount(() => {
    const theme = p.themeOption.theme;
    const themeObj = (Object.keys(theme) as (keyof ThemeData)[]).reduce((obj, curr) => {
      if (curr !== "--active-color") obj[curr] = theme[curr];
      return obj;
    }, {} as ThemeSansActive);
    setThemeData(themeObj);
  });

  const handleSelect = (): void => {
    p.handleSelect(p.themeOption.name);
  };
  return (
    <li
      role="button"
      onMouseDown={handleSelect}
      style={themeData()}
      classList={{ [styles.option]: true, [styles.option__chosen]: isChosen() }}>
      {p.themeOption.name}
    </li>
  );
};
