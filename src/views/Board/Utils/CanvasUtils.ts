import { ElementWhiteboardDrawing } from 'types/elementWhiteboardDrawing';

export const CanvasUtils = {
  writeText: function (
    ctx: CanvasRenderingContext2D,
    textualElement: ElementWhiteboardDrawing
  ) {
    ctx.save();
    ctx.font = "20px Neucha";
    const { text, xStart, yStart } = textualElement;
    ctx.fillText(text, xStart, yStart);
    ctx.restore();
  },
};
