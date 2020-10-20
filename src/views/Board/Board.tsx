import "./styles.css";

import React, { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

import { ToolType } from "../../constants/toolType";
import { ElementWhiteboardDrawing } from "../../types/elementWhiteboardDrawing";
import { ActionType } from "../../constants/actionType";

const Board = () => {
  const [elements, setElements] = useState<Array<ElementWhiteboardDrawing>>([]);
  const [action, setAction] = useState(ActionType.DEFAULT);
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [tool, setTool] = useState(ToolType.LINE);

  const roughGenerator = rough.generator();

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
    xEnd: number,
    yStart: number,
    yEnd: number,
    type: string
  ) {
    const updateCurrentElementCreated = createElement(
      id,
      xEnd,
      yEnd,
      yStart,
      xStart,
      type
    );

    const elementsWithLastCreated = [...elements];
    elementsWithLastCreated[id] = updateCurrentElementCreated;

    setElements(elementsWithLastCreated);
  }

  function createElement(
    id: number,
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    toolType: string
  ) {
    let roughElement;

    if (tool === ToolType.LINE) {
      roughElement = roughGenerator.line(xStart, yStart, xEnd, yEnd);
    }

    if (tool === ToolType.RECTANGLE) {
      roughElement = roughGenerator.rectangle(
        xStart,
        yStart,
        xEnd - xStart,
        yEnd - yStart
      );
    }

    return { id, xStart, xEnd, yStart, yEnd, toolType, roughElement };
  }

  function distance(
    pointA: { x: number; y: number },
    pointB: { x: number; y: number }
  ) {
    return Math.sqrt(
      Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
    );
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
        element.yEnd,
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
      const end = nearPoint(
        clientX,
        clientY,
        element.xEnd,
        element.yEnd,
        "end"
      );

      const inside = Math.abs(offset) < 1 ? "inside" : null;

      return start || end || inside;
    }
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

  function handleOnMouseDown(event: React.MouseEvent) {
    if (tool === ToolType.SELECTION) {
      const element = getElementAtPosition(
        event.clientX,
        event.clientY,
        elements
      );

      if (element) {
        setSelectedElement(element);
        setAction(ActionType.MOVING);
      }
    } else {
      const id = elements.length;
      const newRoughElement = createElement(
        id,
        event.clientX,
        event.clientY,
        event.clientY,
        event.clientX,
        tool
      );
      setElements((prevState) => [...prevState, newRoughElement]);

      setAction(ActionType.DRAWING);
    }
  }

  function handleOnMouseMove(event: React.MouseEvent) {
    if (action === ActionType.DRAWING) {
      const currentElementCreatedIndex = elements.length - 1;
      const { xStart, yStart } = elements[currentElementCreatedIndex];
      const { clientX: clientXEnd, clientY: clientYEnd } = event;

      updateElement(
        currentElementCreatedIndex,
        xStart,
        clientXEnd,
        yStart,
        clientYEnd,
        tool
      );
    } else if (action === ActionType.MOVING) {
      const width = selectedElement.xEnd - selectedElement.xStart;
      const height = selectedElement.yEnd - selectedElement.yStart;

      updateElement(
        selectedElement.id,
        event.clientX,
        event.clientX + width,
        event.clientY,
        event.clientY + height,
        tool
      );
    }
  }

  function handleOnMouseUp() {
    setAction(ActionType.DEFAULT);
    setSelectedElement(null);
  }

  return (
    <div id="board" className="fade-in">
      <div style={{ position: "fixed" }}>
        <input
          type="radio"
          id="line"
          checked={tool === ToolType.SELECTION}
          onChange={() => setTool(ToolType.SELECTION)}
        />
        <label htmlFor="line">Selection</label>
        <input
          type="radio"
          id="line"
          checked={tool === ToolType.LINE}
          onChange={() => setTool(ToolType.LINE)}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={tool === ToolType.RECTANGLE}
          onChange={() => setTool(ToolType.RECTANGLE)}
        />
        <label htmlFor="rectangle">Rectangle</label>
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
};

export default Board;
