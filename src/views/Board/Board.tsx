import './styles.css';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActionType } from 'types/actionType';
import { DrawableElement } from 'types/DrawableElement';
import { ShapeType } from 'types/ShapeType';
import { ToolType } from 'types/ToolType';

import { mockedElements } from './mock';
import ToolBox from './ToolBox';
import ToolsActions from './ToolsActions';
import { adjustElementCoordinates, getElementAtPosition } from './Utils/ElementUtils';
import MouseUtils from './Utils/MouseUtils';
import RoughUtils from './Utils/RoughUtils';

function Board() {
  const notSelectedId = -1;
  const [selectedElementId, setSelectedElementId] = useState(notSelectedId);
  const [elements, setElements] = useState<DrawableElement[]>([]);
  const [action, setAction] = useState<ActionType>("none");
  const [tool, setTool] = useState<ToolType>("line");

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasContext =
      canvas.getContext("2d") || ({} as CanvasRenderingContext2D);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    showElements(true);

    elements.forEach((element: DrawableElement) => {
      RoughUtils.drawElement(canvas, element);
      // console.log("> Draw: ", element);
    });
  }, [elements]);

  function showElements(show: boolean) {
    if (show) {
      console.clear();
      const newLine = "\n";
      console.log(">>> Selected ID: " + selectedElementId);

      elements.forEach((elmt) => {
        console.log(">>> Element: " + elmt.id);

        const obj =
          `\t coords: ${JSON.stringify(elmt.coordinates)} ${newLine}` +
          `\t shape: ${JSON.stringify(elmt.shape)} ${newLine}` +
          `\t isSelected: ${JSON.stringify(elmt.isSelected)} ${newLine}`;

        console.log(obj);
      });
    }
  }

  function updateElement(updatedElement: DrawableElement) {
    const elementsWithLastCreated = elements.map((oldElement) => {
      if (updatedElement.id === oldElement.id) return updatedElement;
      return oldElement;
    });

    setElements(elementsWithLastCreated);
  }

  /**
   * @param element Send "null" to unselet the selected element
   */
  function setSelectedElement(newElement: DrawableElement | null) {
    let newElements: DrawableElement[] = elements.map((elmt) => {
      const isSelected = elmt.id === newElement?.id;
      return { ...elmt, isSelected };
    });

    setElements(newElements);
    const selectedId = newElement?.id || notSelectedId;
    setSelectedElementId(selectedId);
  }

  function moveOrResizeSelectedElement(event: React.MouseEvent) {
    const element = getElementAtPosition(
      event.clientX,
      event.clientY,
      elements
    );
    console.log(">>> getElementAtPosition", element);

    if (element) {
      const { coordinates } = element;
      const { xStart, yStart } = coordinates;
      const offsetX = event.clientX - xStart;
      const offsetY = event.clientY - yStart;

      const newCoords = { ...coordinates, offsetX, offsetY };
      console.log(">>> newCoords", newCoords);

      setSelectedElement({ ...element, coordinates: newCoords });

      if (element.position === "inside") {
        setAction("moving");
      } else {
        setAction("resizing");
      }
    }
  }

  function addNewElement(newElement: DrawableElement) {
    const newElements = [...elements, newElement];

    setElements(newElements);

    setSelectedElement(newElement);
  }

  function addManyNewElements(newElementArr: DrawableElement[]) {
    const newElements = [...elements, ...newElementArr];
    setElements(newElements);
  }

  function drawNewElement(event: React.MouseEvent, shape: ShapeType) {
    const id = elements.length;

    const newElement: DrawableElement = {
      id,
      coordinates: {
        xStart: event.clientX,
        yStart: event.clientY,
        xEnd: event.clientX,
        yEnd: event.clientY,
      },
      shape,
    };
    addNewElement(newElement);
    setAction("drawing");
  }

  function handleOnMouseDown(event: React.MouseEvent) {
    if (tool === "selection") {
      moveOrResizeSelectedElement(event);
    } else {
      const shape: ShapeType = tool === "line" ? "line" : "rectangle";
      drawNewElement(event, shape);
    }
  }

  function updateElementByAction(event: React.MouseEvent) {
    const toolAction = ToolsActions[action];

    const selectedElement = getSelectedElement();

    const raisedElement = toolAction({
      event,
      tool,
      elements,
      selectedElement,
    });

    if (raisedElement) {
      updateElement(raisedElement);
    }
  }

  function handleOnMouseMove(event: React.MouseEvent) {
    MouseUtils.setMouseStyleByTool(tool, event, elements);
    updateElementByAction(event);
  }

  function getSelectedElement() {
    return elements.find((elmt) => elmt.id === selectedElementId);
  }

  function updateSelectElementCoordinates() {
    const selectedElement = getSelectedElement();
    if (selectedElement) {
      const newElementCoords = adjustElementCoordinates(selectedElement);
      const newElement = { ...selectedElement, coordinates: newElementCoords };
      updateElement(newElement);
    }
  }

  function handleOnMouseUp() {
    if (!selectedElementId) return;

    const allowedActions: ActionType[] = ["drawing", "resizing"];

    if (allowedActions.includes(action)) {
      updateSelectElementCoordinates();
    }

    setAction("none");
    setSelectedElement(null);
  }

  function loadElements() {
    // Posteriorly we'll search these elements from DynamoDB (not mocked)
    const mockedDrawable: DrawableElement[] = [];

    mockedElements.forEach((element: any) => {
      const newElement = {
        id: element.id,
        coordinates: {
          xStart: element.xStart,
          yStart: element.yStart,
          xEnd: element.xEnd,
          yEnd: element.yEnd,
        },
        shape: element.toolType,
        isSelected: false,
      };

      mockedDrawable.push(newElement);
    });

    // setElements([...elements, ...mockedDrawable]);
    addManyNewElements(mockedDrawable);
  }

  useEffect(() => {
    setTool("selection");
    loadElements();
  }, []);

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
