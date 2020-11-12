import './styles.css';

import React, { useLayoutEffect, useState } from 'react';
import { ActionType } from 'types/actionType';

import { ToolType } from '../../constants/toolType';
import { ElementWhiteboardDrawing } from '../../types/elementWhiteboardDrawing';
import MouseUtils from './MouseUtils';
import RoughUtils, { rough } from './RoughUtils';
import ToolBox from './ToolBox';
import ToolsActions from './ToolsActions';
import { adjustElementCoordinates, getElementAtPosition } from './Utils';

function Board() {
  const [elements, setElements] = useState<Array<ElementWhiteboardDrawing>>([]);
  const [action, setAction] = useState<ActionType>("none");
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
    const updateCurrentElementCreated = RoughUtils.createElement(
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

  function moveOrResizeSelectedElement(event: React.MouseEvent) {
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
        setAction("moving");
      } else {
        setAction("resizing");
      }
    }
  }

  function drawNewElement(event: React.MouseEvent) {
    const id = elements.length;
    const newRoughElement = RoughUtils.createElement(
      id,
      event.clientX,
      event.clientY,
      event.clientX,
      event.clientY,
      tool
    );

    setElements((prevState) => [...prevState, newRoughElement]);
    setSelectedElement(newRoughElement);
    setAction("drawing");
  }

  function handleOnMouseDown(event: React.MouseEvent) {
    if (tool === ToolType.SELECTION) {
      moveOrResizeSelectedElement(event);
    } else {
      drawNewElement(event);
    }
  }

  function updateElementByAction(event: React.MouseEvent) {
    const toolAction = ToolsActions[action];
    const raisedElement = toolAction({
      event,
      tool,
      elements,
      selectedElement,
    });

    if (raisedElement) {
      updateElement(
        raisedElement.id,
        raisedElement.xStart,
        raisedElement.yStart,
        raisedElement.xEnd,
        raisedElement.yEnd,
        raisedElement.type
      );
    }
  }

  function handleOnMouseMove(event: React.MouseEvent) {
    MouseUtils.setMouseStyleByTool(tool, event, elements);
    updateElementByAction(event);
  }

  function updateSelectElementCoordinates() {
    const index = selectedElement.id;
    const { id, toolType } = elements[index];
    const newElementCoods = adjustElementCoordinates(elements[index]);

    if (!newElementCoods) return;

    updateElement(
      id,
      newElementCoods.xStart,
      newElementCoods.yStart,
      newElementCoods.xEnd,
      newElementCoods.yEnd,
      toolType
    );
  }

  function handleOnMouseUp() {
    if (!selectedElement) return;

    const allowedActions: ActionType[] = ["drawing", "resizing"];

    if (allowedActions.includes(action)) {
      updateSelectElementCoordinates();
    }

    setAction("none");
    setSelectedElement(null);
  }

  return (
    <div id="board" className="fade-in">
      <ToolBox tool={tool} setTool={setTool} />
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
