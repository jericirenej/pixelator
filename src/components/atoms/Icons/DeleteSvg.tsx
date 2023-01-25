import { type Component } from "solid-js";
import type { ActionButtonProps } from "../../../types";

export const DeleteSvg: Component<ActionButtonProps> = p => {
  const handleClick = (e: Event) => p.onClick && p.onClick();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class={p.class}
      onClick={handleClick}>
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};
