import { ToolType } from 'constants/toolType';
import { DrawableElement } from 'types/DrawableElement';

import { getElementAtPosition } from './ElementUtils';

function cursorForPosition(position: string | null | undefined) {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
}

const MouseUtils = {
  setMouseStyleByTool: function (
    tool: string,
    event: any,
    elements: DrawableElement[]
  ) {
    if (tool === ToolType.SELECTION) {
      const element = getElementAtPosition(
        event.clientX,
        event.clientY,
        elements
      );

      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }
  },
};

export default MouseUtils;
