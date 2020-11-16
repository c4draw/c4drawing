import { Coords } from 'interfaces/Coords';
import { DrawableElement } from 'types/DrawableElement';
import { PositionType } from 'types/PositionType';

function setElementspositions(
  clientX: number,
  clientY: number,
  elements: DrawableElement[]
) {
  return elements.map((element) => ({
    ...element,
    position: positionWithinElement(clientX, clientY, element),
  }));
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

function nearPoint(
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

function distance(
  pointA: { x: number; y: number },
  pointB: { x: number; y: number }
) {
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
  );
}

function positionWithinElement(
  clientX: number,
  clientY: number,
  element: DrawableElement
) {
  if (!element) return;

  const { coordinates } = element;
  const { xStart, yStart, xEnd, yEnd } = coordinates;

  if (element.shape === "rectangle") {
    const topLeft = nearPoint(clientX, clientY, xStart, yStart, "tl");
    const topRight = nearPoint(clientX, clientY, xEnd, yStart, "tr");
    const bottomLeft = nearPoint(clientX, clientY, xStart, yEnd, "bl");
    const bottomRight = nearPoint(clientX, clientY, xEnd, yEnd, "br");

    const inside =
      clientX >= xStart &&
      clientX <= xEnd &&
      clientY >= yStart &&
      clientY <= yEnd
        ? "inside"
        : null;

    return topLeft || topRight || bottomLeft || bottomRight || inside;
  }

  if (element.shape === "line") {
    const pointA = { x: xStart, y: yStart };
    const pointB = { x: xEnd, y: yEnd };
    const pointC = { x: clientX, y: clientY };

    const offset =
      distance(pointA, pointB) -
      (distance(pointA, pointC) + distance(pointB, pointC));

    const start = nearPoint(clientX, clientY, xStart, yStart, "start");
    const end = nearPoint(clientX, clientY, xEnd, yEnd, "end");

    const inside = Math.abs(offset) < 1 ? "inside" : null;

    return start || end || inside;
  }
}

export function getElementAtPosition(
  clientX: number,
  clientY: number,
  elements: DrawableElement[]
) {
  // return elements
  //   .map((element) => ({
  //     ...element,
  //     position: positionWithinElement(clientX, clientY, element),
  //   }))
  //   .find((element) => element.position !== null);

  const elementsWithPosition = setElementspositions(clientX, clientY, elements);

  const elementAtPosition = elementsWithPosition.find(
    (element: DrawableElement) => element && element.position !== null
  );
  return elementAtPosition;
}

export function adjustElementCoordinates(element: DrawableElement): Coords {
  // const { toolType, xStart, xEnd, yStart, yEnd } = element;

  const { coordinates, shape } = element;
  const { xStart, yStart, xEnd, yEnd } = coordinates;

  if (shape === "rectangle") {
    const minX = Math.min(xStart, xEnd);
    const maxX = Math.max(xStart, xEnd);
    const minY = Math.min(yStart, yEnd);
    const maxY = Math.max(yStart, yEnd);

    return { xStart: minX, yStart: minY, xEnd: maxX, yEnd: maxY };
  }

  // if (shape === "line") {
  if (xStart < xEnd || (xStart === xEnd && yStart < yEnd)) {
    return { xStart, yStart, xEnd, yEnd };
  } else {
    return { xStart: xEnd, yStart: yEnd, xEnd: xStart, yEnd: yStart };
  }
  // }
}
