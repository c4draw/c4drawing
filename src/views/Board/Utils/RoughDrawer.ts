import { ElementColorPalette } from 'constants/ColorPalette';
import { DrawableElement } from 'types/DrawableElement';

interface IRoughDrawerProps {
  roughCanvas: any;
  element: DrawableElement;
}

// doc: https://github.com/rough-stuff/rough/wiki

function getOptions(element: DrawableElement) {
  return {
    stroke: element.isSelected
      ? ElementColorPalette.Selected
      : ElementColorPalette.Default,
  };
}

const RoughDrawer = {
  rectangle: function ({ roughCanvas, element }: IRoughDrawerProps) {
    const { coordinates } = element;
    const { xStart, yStart, xEnd, yEnd } = coordinates;
    const width = xEnd - xStart;
    const height = yEnd - yStart;
    const options = getOptions(element);

    roughCanvas.rectangle(xStart, yStart, width, height, options);
  },
  line: function ({ roughCanvas, element }: IRoughDrawerProps) {
    const { coordinates } = element;
    const { xStart, yStart, xEnd, yEnd } = coordinates;

    const options = getOptions(element);

    roughCanvas.line(xStart, yStart, xEnd, yEnd, options);
  },
};

export default RoughDrawer;
