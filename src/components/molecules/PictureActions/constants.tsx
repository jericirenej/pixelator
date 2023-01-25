import { JSX } from "solid-js";
import { TEXT_LABELS } from "../../../constants/constants";
import type { ActionButtonProps } from "../../../types";
import { ArrowCircleSvg } from "../../atoms/Icons/ArrowCircleSvg";
import { CropImageSvg } from "../../atoms/Icons/CropImageSvg";
import { DeleteSvg } from "../../atoms/Icons/DeleteSvg";
import { DownloadSvg } from "../../atoms/Icons/DownloadSvg";
import { GoBackSvg } from "../../atoms/Icons/GoBackSvg";

export interface PictureActionsProps {
  type: ActionTypes;
}
type ActionTypes = "prepare" | "result";


export type EventTypes = "clearUpload" | "crop" | "pixelate" | "download" | "back" | "reset";
interface SingleComponent {
  component: (p: ActionButtonProps) => JSX.Element;
  title: string;
  eventType: EventTypes;
  animationName: string;
}

const { clearPicture, pixelate, resetCrop, reset, download, back } =
  TEXT_LABELS.PICTURE_ACTIONS;



export const animation = { val: 0.2, unit: "s" };
export const componentList: Record<ActionTypes, SingleComponent[]> = {
  prepare: [
    {
      component: (p: ActionButtonProps) => <DeleteSvg {...p} />,
      title: clearPicture,
      eventType: "clearUpload",
      animationName: "swivel",
    },
    {
      component: (p: ActionButtonProps) => <CropImageSvg {...p} />,
      title: resetCrop,
      eventType: "crop",
      animationName: "flip",
    },
    {
      component: (p: ActionButtonProps) => <ArrowCircleSvg {...p} />,
      title: pixelate,
      eventType: "pixelate",
      animationName: "roll",
    },
  ],
  result: [
    {
      component: (p: ActionButtonProps) => <GoBackSvg {...p} />,
      title: back,
      eventType: "back",
      animationName: "scale",
    },
    {
      component: (p: ActionButtonProps) => <DeleteSvg {...p} />,
      title: reset,
      eventType: "reset",
      animationName: "swivel",
    },
    {
      component: (p: ActionButtonProps) => <DownloadSvg {...p} />,
      title: download,
      eventType: "download",
      animationName: "bounce",
    },
  ],
};