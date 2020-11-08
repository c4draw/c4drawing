import rough from 'roughjs/bundled/rough.esm';
import { PositionType } from 'types/positionType';

import { ToolType } from '../../constants/toolType';
import { ElementWhiteboardDrawing } from '../../types/elementWhiteboardDrawing';

export const roughGenerator = rough.generator();

export function createElement(
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
}

export function nearPoint(
  clientX: number,
  clientY: number,
  clientXEnd: number,
  clientYEnd: number,
  pointName: string
) {
  return Math.abs(clientX - clientXEnd) < 5 &&
    Math.abs(clientY - clientYEnd) < 5
    ? pointName
    : null;
}

export function positionWithinElement(
  clientX: number,
  clientY: number,
  element: ElementWhiteboardDrawing
) {
  if (element.toolType === ToolType.RECTANGLE) {
    const topLeft = nearPoint(
      clientX,
      clientY,
      element.xStart,
      element.yStart,
      "tl"
    );
    const topRight = nearPoint(
      clientX,
      clientY,
      element.xEnd,
      element.yStart,
      "tr"
    );
    const bottomLeft = nearPoint(
      clientX,
      clientY,
      element.xStart,
      element.yEnd,
      "bl"
    );
    const bottomRight = nearPoint(
      clientX,
      clientY,
      element.xEnd,
      element.yEnd,
      "br"
    );

    const inside =
      clientX >= element.xStart &&
      clientX <= element.xEnd &&
      clientY >= element.yStart &&
      clientY <= element.yEnd
        ? "inside"
        : null;

    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }

  if (element.toolType === ToolType.LINE) {
    const pointA = { x: element.xStart, y: element.yStart };
    const pointB = { x: element.xEnd, y: element.yEnd };
    const pointC = { x: clientX, y: clientY };

    const offset =
      distance(pointA, pointB) -
      (distance(pointA, pointC) + distance(pointB, pointC));

    const start = nearPoint(
      clientX,
      clientY,
      element.xStart,
      element.yStart,
      "start"
    );
    const end = nearPoint(clientX, clientY, element.xEnd, element.yEnd, "end");

    const inside = Math.abs(offset) < 1 ? "inside" : null;

    return start || end || inside;
  }
}

export function distance(
  pointA: { x: number; y: number },
  pointB: { x: number; y: number }
) {
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
  );
}

export function getElementAtPosition(
  clientX: number,
  clientY: number,
  elements: ElementWhiteboardDrawing[]
) {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(clientX, clientY, element),
    }))
    .find((element) => element.position !== null);
}

export function adjustElementCoordinates(element: ElementWhiteboardDrawing) {
  const { toolType, xStart, xEnd, yStart, yEnd } = element;

  if (toolType === ToolType.RECTANGLE) {
    const minX = Math.min(xStart, xEnd);
    const maxX = Math.max(xStart, xEnd);
    const minY = Math.min(yStart, yEnd);
    const maxY = Math.max(yStart, yEnd);

    return { xStart: minX, yStart: minY, xEnd: maxX, yEnd: maxY };
  }

  if (toolType === ToolType.LINE) {
    if (xStart < xEnd || (xStart === xEnd && yStart < yEnd)) {
      return { xStart, yStart, xEnd, yEnd };
    } else {
      return { xStart: xEnd, yStart: yEnd, xEnd: xStart, yEnd: yStart };
    }
  }
}

export function resizedCoordinates(
  clientX: number,
  clientY: number,
  position: PositionType,
  coordinates: { xStart: number; yStart: number; xEnd: number; yEnd: number }
) {
  const { xStart, yStart, xEnd, yEnd } = coordinates;

  switch (position) {
    case "tl":
    case "start":
      return { xStart: clientX, yStart: clientY, xEnd, yEnd };
    case "tr":
      return { xStart, yStart: clientY, xEnd: clientX, yEnd };
    case "bl":
      return { xStart: clientX, yStart, xEnd, yEnd: clientY };
    case "br":
    case "end":
      return { xStart, yStart, xEnd: clientX, yEnd: clientY };
    default:
      return null;
  }
}
