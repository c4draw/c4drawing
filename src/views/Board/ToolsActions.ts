import { ElementWhiteboardDrawing } from 'types/elementWhiteboardDrawing';

import { resizedCoordinates } from './Utils';

interface IToolsActionsProps {
  event: any;
  tool: string;
  elements: ElementWhiteboardDrawing[];
  selectedElement: any | null;
}

interface IElementInfo {
  id: number;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  type: string;
}

const ToolsActions = {
  none: function name(params: any) {
    return null;
  },
  moving: function ({ event, selectedElement }: IToolsActionsProps) {
    const width = selectedElement.xEnd - selectedElement.xStart;
    const height = selectedElement.yEnd - selectedElement.yStart;

    const newX1 = event.clientX - selectedElement.offsetX;
    const newY1 = event.clientY - selectedElement.offsetY;

    return {
      id: selectedElement.id,
      xStart: newX1,
      yStart: newY1,
      xEnd: newX1 + width,
      yEnd: newY1 + height,
      type: selectedElement.toolType,
    };
  },
  drawing: function ({
    event,
    tool,
    elements,
  }: IToolsActionsProps): IElementInfo {
    const currentElementCreatedIndex = elements.length - 1;
    const { xStart, yStart } = elements[currentElementCreatedIndex];
    const { clientX: clientXEnd, clientY: clientYEnd } = event;

    return {
      id: currentElementCreatedIndex,
      xStart: xStart,
      yStart: yStart,
      xEnd: clientXEnd,
      yEnd: clientYEnd,
      type: tool,
    };
  },
  resizing: function ({ event, selectedElement }: IToolsActionsProps) {
    const { id, type, position, ...coordinates } = selectedElement;

    const coordinatesResized = resizedCoordinates(
      event.clientX,
      event.clientY,
      position,
      coordinates
    );

    if (!coordinatesResized) return;

    return {
      id: id,
      xStart: coordinatesResized.xStart,
      yStart: coordinatesResized.yStart,
      xEnd: coordinatesResized.xEnd,
      yEnd: coordinatesResized.yEnd,
      type: selectedElement.toolType,
    };
  },
};

export default ToolsActions;
