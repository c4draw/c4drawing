import { Drawable } from "roughjs/bin/core";

export type ElementWhiteboardDrawing = {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  toolType: string;
  roughElement: Drawable;
};
