import './styles.css';

import IElementsProps from 'interfaces/ElementsComponents';
import React, { useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';

import { ToolType } from '../../constants/toolType';
import { ActionTypeEnum } from '../../enums/actionTypeEnum';
import { ActionType } from '../../types/actionType';
import { ElementWhiteboardDrawing } from '../../types/elementWhiteboardDrawing';
import ToolActions from './ToolActions';
import ToolBox from './ToolBox';
import { adjustElementCoordinates, createElement, getElementAtPosition } from './Utils';

function Board() {
  const [elements, setElements] = useState<Array<ElementWhiteboardDrawing>>([]);
  const [action, setAction] = useState<ActionType>(ActionTypeEnum.DEFAULT);
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [tool, setTool] = useState(ToolType.LINE);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasContext =
      canvas.getContext("2d") || ({} as CanvasRenderingContext2D);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    console.log(">>>>", elements);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  function updateElement({
    id,
    xStart,
    yStart,
    xEnd,
    yEnd,
    type,
  }: IElementsProps) {
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

  function moveOrResizeExistingElement(event: React.MouseEvent) {
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
        setAction(ActionTypeEnum.MOVING);
      } else {
        setAction(ActionTypeEnum.RESIZING);
      }
    }
  }

  function drawNewElement(event: React.MouseEvent) {
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
    setAction(ActionTypeEnum.DRAWING);
  }

  function isSelectionTool() {
    return tool === ToolType.SELECTION;
  }

  function handleOnMouseDown(event: React.MouseEvent) {
    if (isSelectionTool()) {
      moveOrResizeExistingElement(event);
    } else {
      drawNewElement(event);
    }
  }

  function handleOnMouseMove(event: any) {
    const toolAction = ToolActions[action];

    if (!toolAction) return;

    const elmtProps = toolAction({
      event,
      elements,
      selectedTool: tool,
      selectedElement,
    });

    if (elmtProps) updateElement(elmtProps);
  }

  function handleOnMouseUp() {
    if (!selectedElement) return;

    const index = selectedElement.id;
    const { id, toolType } = elements[index];

    const allowedActionsToAjustCoords: ActionType[] = [
      ActionTypeEnum.DRAWING,
      ActionTypeEnum.RESIZING,
    ];

    if (allowedActionsToAjustCoords.includes(action)) {
      const elementCoordinatesAdjusted = adjustElementCoordinates(
        elements[index]
      );

      if (!elementCoordinatesAdjusted) return;

      updateElement({
        id,
        xStart: elementCoordinatesAdjusted.xStart,
        yStart: elementCoordinatesAdjusted.yStart,
        xEnd: elementCoordinatesAdjusted.xEnd,
        yEnd: elementCoordinatesAdjusted.yEnd,
        type: toolType,
      });
    }

    setAction(ActionTypeEnum.DEFAULT);
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
