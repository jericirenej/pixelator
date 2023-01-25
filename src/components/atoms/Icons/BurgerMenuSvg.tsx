import { Index, type Component } from "solid-js";
import styles from "./BurgerMenu.module.scss";

interface BurgerMenuProps {
  active: boolean;
}
export const BurgerMenu: Component<BurgerMenuProps> = p => {
  const bars = [0, 1, 2];
  return (
    <div class={styles.burgerMenu}>
      <Index each={bars}>
        {bar => (
          <span
            classList={{
              [styles.burgerMenu__line]: true,
              [styles.burgerMenu__line_active]: p.active,
            }}
          />
        )}
      </Index>
    </div>
  );
};
