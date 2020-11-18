import { Drawable } from 'roughjs/bin/core';

export type ElementWhiteboardDrawing = {
  id: number;
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
  toolType: string;
  text: "unset" | string;
  roughElement?: Drawable;
};
