import "./styles.css";

import React, { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

import mouseSVG from "../../assets/svg/mouse.svg";
import lineSVG from "../../assets/svg/line.svg";
import squareSVG from "../../assets/svg/square.svg";

import { ToolType } from "../../constants/toolType";
import { ElementWhiteboardDrawing } from "../../types/elementWhiteboardDrawing";
import { ActionType } from "../../constants/actionType";

const roughGenerator = rough.generator();

function createElement(
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

function positionWithinElement(
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

function distance(
  pointA: { x: number; y: number },
  pointB: { x: number; y: number }
) {
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
  );
}

function getElementAtPosition(
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

function adjustElementCoordinates(element: ElementWhiteboardDrawing) {
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

function resizedCoordinates(
  clientX: number,
  clientY: number,
  position: string,
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

function Board() {
  const [elements, setElements] = useState<Array<ElementWhiteboardDrawing>>([]);
  const [action, setAction] = useState(ActionType.DEFAULT);
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [tool, setTool] = useState(ToolType.LINE);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasContext =
      canvas.getContext("2d") || ({} as CanvasRenderingContext2D);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  function updateElement(
    id: number,
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    type: string
  ) {
    const updateCurrentElementCreated = createElement(
      id,
      xStart,
      yStart,
      xEnd,
      yEnd,
      type
    );

    const elementsWithLastCreated = [...elements];
    elementsWithLastCreated[id] = updateCurrentElementCreated;

    setElements(elementsWithLastCreated);
  }

  function handleOnMouseDown(event: React.MouseEvent) {
    if (tool === ToolType.SELECTION) {
      const element = getElementAtPosition(
        event.clientX,
        event.clientY,
        elements
      );

      if (element) {
        const offsetX = event.clientX - element.xStart;
        const offsetY = event.clientY - element.yStart;

        setSelectedElement({ ...element, offsetX, offsetY });

        if (element.position === "inside") {
          setAction(ActionType.MOVING);
        } else {
          setAction(ActionType.RESIZING);
        }
      }
    } else {
      const id = elements.length;
      const newRoughElement = createElement(
        id,
        event.clientX,
        event.clientY,
        event.clientX,
        event.clientY,
        tool
      );

      setElements((prevState) => [...prevState, newRoughElement]);
      setSelectedElement(newRoughElement);
      setAction(ActionType.DRAWING);
    }
  }

  function handleOnMouseMove(event: any) {
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

    if (action === ActionType.DRAWING) {
      const currentElementCreatedIndex = elements.length - 1;
      const { xStart, yStart } = elements[currentElementCreatedIndex];
      const { clientX: clientXEnd, clientY: clientYEnd } = event;

      updateElement(
        currentElementCreatedIndex,
        xStart,
        yStart,
        clientXEnd,
        clientYEnd,
        tool
      );
    } else if (action === ActionType.MOVING) {
      const width = selectedElement.xEnd - selectedElement.xStart;
      const height = selectedElement.yEnd - selectedElement.yStart;

      const newX1 = event.clientX - selectedElement.offsetX;
      const newY1 = event.clientY - selectedElement.offsetY;

      updateElement(
        selectedElement.id,
        newX1,
        newY1,
        newX1 + width,
        newY1 + height,
        selectedElement.toolType
      );
    } else if (action === ActionType.RESIZING) {
      const { id, type, position, ...coordinates } = selectedElement;

      const coordinatesResized = resizedCoordinates(
        event.clientX,
        event.clientY,
        position,
        coordinates
      );

      if (!coordinatesResized) return;

      updateElement(
        id,
        coordinatesResized.xStart,
        coordinatesResized.yStart,
        coordinatesResized.xEnd,
        coordinatesResized.yEnd,
        selectedElement.toolType
      );
    }
  }

  function handleOnMouseUp() {
    if (!selectedElement) return;

    const index = selectedElement.id;
    const { id, toolType } = elements[index];

    if (action === ActionType.DRAWING || action === ActionType.RESIZING) {
      const elementCoordinatesAdjusted = adjustElementCoordinates(
        elements[index]
      );

      if (!elementCoordinatesAdjusted) return;

      updateElement(
        id,
        elementCoordinatesAdjusted.xStart,
        elementCoordinatesAdjusted.yStart,
        elementCoordinatesAdjusted.xEnd,
        elementCoordinatesAdjusted.yEnd,
        toolType
      );
    }

    setAction(ActionType.DEFAULT);
    setSelectedElement(null);
  }

  return (
    <div id="board" className="fade-in">
      <div className="tool-box">
        <div
          className={`button-selection ${
            tool === ToolType.SELECTION && "button-selection-selected"
          }`}
          onClick={() => setTool(ToolType.SELECTION)}
        >
          <img src={mouseSVG} alt="Selecionar..." />
        </div>
        <div
          className={`button-selection ${
            tool === ToolType.LINE && "button-selection-selected"
          }`}
          onClick={() => setTool(ToolType.LINE)}
        >
          <img src={lineSVG} alt="Linha" />
        </div>
        <div
          className={`button-selection ${
            tool === ToolType.RECTANGLE && "button-selection-selected"
          }`}
          onClick={() => setTool(ToolType.RECTANGLE)}
        >
          <img src={squareSVG} alt="Quadrado" />
        </div>
      </div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseUp={handleOnMouseUp}
        onMouseDown={handleOnMouseDown}
        onMouseMove={handleOnMouseMove}
      >
        Canvas
      </canvas>
    </div>
  );
}

export default Board;
