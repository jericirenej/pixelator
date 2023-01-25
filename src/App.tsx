import { onMount, type Component } from "solid-js";
import styles from "./App.module.scss";
import { Title } from "./components/atoms/Title/Title";
import { Footer } from "./components/molecules/Footer/Footer";
import { ThemePicker } from "./components/molecules/ThemePicker/ThemePicker";
import { UploadArea } from "./components/organisms/UploadArea/UploadArea";
import { useThemeContext } from "./context/Context";

const App: Component = () => {
  const { initializeTheme } = useThemeContext();
  onMount(() => {
    initializeTheme();
  });
  return (
    <>
      <header class={styles.header}>
        <div />
        <Title />
        <div class={styles.options}>
          <ThemePicker />
        </div>
      </header>
      <main>
        <div class={styles.baseContainer}>
          <div
            classList={{
              [styles.baseContainer__uploadArea]: true,
            }}>
            <UploadArea />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
export default App;
