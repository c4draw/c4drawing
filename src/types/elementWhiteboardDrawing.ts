import { Drawable } from "roughjs/bin/core";

export type ELementWhiteboardDrawing = {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  roughElement: Drawable;
};
