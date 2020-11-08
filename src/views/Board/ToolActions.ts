import IElementsProps from 'interfaces/ElementsComponents';
import { ElementWhiteboardDrawing } from 'types/elementWhiteboardDrawing';

import { cursorForPosition } from './MouseUtils';
import { getElementAtPosition, resizedCoordinates } from './Utils';

interface IToolActionsProps {
  event: React.MouseEvent | any;
  elements: ElementWhiteboardDrawing[];
  selectedTool: string;
  selectedElement: any;
}

function none({ event, elements }: IToolActionsProps): void {
  const element = getElementAtPosition(event.clientX, event.clientY, elements);
  event.target.style.cursor = element
    ? cursorForPosition(element.position)
    : "default";
}

function moving({ selectedElement, event }: IToolActionsProps): IElementsProps {
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
}

function drawing({
  event,
  elements,
  selectedTool,
}: IToolActionsProps): IElementsProps {
  const currentElementCreatedIndex = elements.length - 1;
  const { xStart, yStart } = elements[currentElementCreatedIndex];
  const { clientX: clientXEnd, clientY: clientYEnd } = event;

  return {
    id: currentElementCreatedIndex,
    xStart,
    yStart,
    xEnd: clientXEnd,
    yEnd: clientYEnd,
    type: selectedTool,
  };
}

function resizing({
  event,
  selectedElement,
}: IToolActionsProps): IElementsProps | null {
  const { id, type, position, ...coordinates } = selectedElement;

  const coordinatesResized = resizedCoordinates(
    event.clientX,
    event.clientY,
    position,
    coordinates
  );

  if (!coordinatesResized) return null;

  return {
    id,
    xStart: coordinatesResized.xStart,
    yStart: coordinatesResized.yStart,
    xEnd: coordinatesResized.xEnd,
    yEnd: coordinatesResized.yEnd,
    type,
  };
}

const ToolActions = { none, moving, drawing, resizing };
export default ToolActions;
