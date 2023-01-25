import { type Component } from "solid-js";
import { SOURCE_CODE_LINK } from "../../../constants/constants";
import { Help } from "../Info/Help";
import styles from "./Footer.module.scss";

export const Footer: Component = () => (
  <footer class={styles.footer}>
    <div class={styles.footer__sourceCode}>
      <a href={SOURCE_CODE_LINK} target="_blank">
        Github
      </a>
    </div>
    <div class={styles.footer__help}>
      <Help />
    </div>
  </footer>
);
