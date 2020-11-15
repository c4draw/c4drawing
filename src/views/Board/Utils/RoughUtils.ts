import { ToolType } from 'constants/toolType';
import rough from 'roughjs/bundled/rough.esm';
import { DrawableElement } from 'types/DrawableElement';

import RoughDrawer from './RoughDrawers';

const roughGenerator = rough.generator();

const RoughUtils = {
  createElement: function (
    id: number,
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    toolType: string
  ) {
    let roughElement;

    if (toolType === ToolType.LINE) {
      roughElement = roughGenerator.line(xStart, yStart, xEnd, yEnd);
    }

    if (toolType === ToolType.RECTANGLE) {
      roughElement = roughGenerator.rectangle(
        xStart,
        yStart,
        xEnd - xStart,
        yEnd - yStart
      );
    }

    return { id, xStart, xEnd, yStart, yEnd, toolType, roughElement };
  },
  drawElement: function (canvas: HTMLCanvasElement, element: DrawableElement) {
    const { shape } = element;
    const drawer = RoughDrawer[shape];
    drawer({ canvas, element });
  },
};

export default RoughUtils;
export { rough, roughGenerator };
