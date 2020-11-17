import { DrawableElement } from 'types/DrawableElement';

import { resizedCoordinates } from './Utils/ElementUtils';

interface IToolsActionsProps {
  event: any;
  tool: string;
  elements: DrawableElement[];
  selectedElement: DrawableElement | undefined;
}

// interface IElementInfo {
//   id: number;
//   xStart: number;
//   yStart: number;
//   xEnd: number;
//   yEnd: number;
//   type: string;
// }

const ToolsActions = {
  none: function name(params: any) {
    return null;
  },
  moving: function ({
    event,
    selectedElement,
  }: IToolsActionsProps): DrawableElement | undefined {
    if (!selectedElement) return;

    const { coordinates } = selectedElement;
    const { xStart, yStart, xEnd, yEnd, offsetX, offsetY } = coordinates;

    const width = xEnd - xStart;
    const height = yEnd - yStart;
    const offsetXToSub = width / 2 + (offsetX || 0);
    const offsetYToSub = height / 2 + (offsetY || 0);
    const newX1 = event.clientX - offsetXToSub;
    const newY1 = event.clientY - offsetYToSub;

    // return {
    //   id: selectedElement.id,
    //   xStart: newX1,
    //   yStart: newY1,
    //   xEnd: newX1 + width,
    //   yEnd: newY1 + height,
    //   type: selectedElement.toolType,
    // };
    return {
      ...selectedElement,
      coordinates: {
        xStart: newX1,
        yStart: newY1,
        xEnd: newX1 + width,
        yEnd: newY1 + height,
      },
    };
  },
  drawing: function ({
    event,
    tool,
    elements,
  }: IToolsActionsProps): DrawableElement | undefined {
    if (!elements) return;
    if (!elements.length) return;

    const currentElementCreatedIndex = elements.length - 1;
    const { coordinates, shape, isSelected } = elements[
      currentElementCreatedIndex
    ];
    const { xStart, yStart } = coordinates;
    const { clientX: clientXEnd, clientY: clientYEnd } = event;

    // return {
    //   id: currentElementCreatedIndex,
    //   xStart: xStart,
    //   yStart: yStart,
    //   xEnd: clientXEnd,
    //   yEnd: clientYEnd,
    //   type: tool,
    // };

    return {
      id: currentElementCreatedIndex,
      coordinates: {
        xStart: xStart,
        yStart: yStart,
        xEnd: clientXEnd,
        yEnd: clientYEnd,
      },
      shape,
      isSelected,
    };
  },
  resizing: function ({
    event,
    selectedElement,
  }: IToolsActionsProps): DrawableElement | undefined {
    if (!selectedElement) return;
    const { coordinates, position } = selectedElement;

    const coordinatesResized = resizedCoordinates(
      event.clientX,
      event.clientY,
      position,
      coordinates
    );

    if (!coordinatesResized) return;

    return {
      ...selectedElement,
      coordinates: coordinatesResized,
    };
  },
};

export default ToolsActions;
