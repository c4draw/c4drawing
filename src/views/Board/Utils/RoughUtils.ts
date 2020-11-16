import rough from 'roughjs/bundled/rough.esm';
import { DrawableElement } from 'types/DrawableElement';

import RoughDrawer from './RoughDrawer';

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

    if (toolType === "line") {
      roughElement = roughGenerator.line(xStart, yStart, xEnd, yEnd);
    }

    if (toolType === "rectangle") {
      roughElement = roughGenerator.rectangle(
        xStart,
        yStart,
        xEnd - xStart,
        yEnd - yStart
      );
    }

    // return { id, xStart, xEnd, yStart, yEnd, toolType, roughElement };
    return roughElement;
  },
  drawElement: function (canvas: HTMLCanvasElement, element: DrawableElement) {
    if (!element) return;
    const { shape } = element;
    const drawer = RoughDrawer[shape];

    if (!drawer) {
      throw Error(`"${shape}" is not recognized as a RoughDrawer.ts function.`);
    }

    const roughCanvas = rough.canvas(canvas);
    drawer({ roughCanvas, element });
  },
};

export default RoughUtils;
export { rough, roughGenerator };
