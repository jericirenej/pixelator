import { type Component } from "solid-js";
import { ActionButtonProps } from "../../../types";

export const CropImageSvg: Component<ActionButtonProps> = p => {
  const handleClick = () => p.onClick && p.onClick();
  return (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class={p.class}
      onClick={handleClick}>
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6.75 2.25v12.75a2.25 2.25 0 002.25 2.25h12.75"
      />
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17.25 14.25V9a2.25 2.25 0 00-2.25-2.25H9.75M17.25 17.25v4.5M6.75 6.75H2.25"
      />
    </svg>
  );
};

