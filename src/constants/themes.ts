import type { Theme, Themes } from "../types";

const DARK_THEME: Theme = {
  name: "dark",
  theme: {
    "--main-color": "hsl(0deg, 0%, 5%)",
    "--secondary-color": "hsl(0deg, 0%, 85%)",
    "--background-gradient":
      "linear-gradient(305deg, hsl(0deg,0%,10%) 0%, hsl(0deg,0%,5%) 100%)",
    "--active-color": "hsl(52, 100%, 45%)",
  },
};

const GRAY_THEME: Theme = {
  name: "gray",
  theme: {
    "--main-color": "hsl(0deg, 0%, 92%)",
    "--secondary-color": "hsl(0deg, 0%, 5%)",
    "--background-gradient":
      "linear-gradient(305deg, hsl(0deg,0%,92%) 0%, hsl(0deg, 1%, 75%) 100%)",
    "--active-color": "hsl(346deg, 88%, 37%)",
  },
};

const BLUE_THEME: Theme = {
  name: "blue",
  theme: {
    "--main-color": "hsl(219deg, 66%, 45%)",
    "--secondary-color": "hsl(0deg, 0%, 90%)",
    "--background-gradient":
      "linear-gradient(305deg, hsl(219deg,66%,48%) 0%, hsl(219deg, 56%, 38%) 100%)",
    "--active-color": "hsl(112deg, 80%, 56%)",
  },
};

const WHITE_THEME: Theme = {
  name: "white",
  theme: {
    "--main-color": "hsl(0deg, 0%, 98%)",
    "--secondary-color": "hsl(0deg, 0%, 0%)",
    "--background-gradient":
      "linear-gradient(305deg, hsl(0deg, 0%, 100%) 0%, hsl(0deg, 0%, 95%) 100%)",
    "--active-color": "hsl(72deg, 69%, 35%)",
  },
};
const RED_THEME: Theme = {
  name: "red",
  theme: {
    "--main-color": "hsl(0deg, 96%, 32%)",
    "--secondary-color": "hsl(0deg, 0%, 90%)",
    "--background-gradient":
      "linear-gradient(305deg, hsl(0deg, 96%, 38%) 0%, hsl(0deg, 96%, 28%) 100%)",
    "--active-color": "hsl(194deg, 67%, 49%)",
  },
};

export const THEMES: Themes = [
  DARK_THEME,
  WHITE_THEME,
  GRAY_THEME,
  RED_THEME,
  BLUE_THEME,
].reduce((themes, currTheme) => {
  themes[currTheme.name] = currTheme;
  return themes;
}, {} as Themes);
