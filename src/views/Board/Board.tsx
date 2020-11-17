import './styles.css';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActionType } from 'types/actionType';
import { DrawableElement } from 'types/DrawableElement';
import { ShapeType } from 'types/ShapeType';
import { ToolType } from 'types/ToolType';

import { mockedElements } from './mock';
import ToolBox from './ToolBox';
import ToolsActions from './ToolsActions';
import { adjustElementCoordinates, getElementAtPosition, getId, positionWithinElement } from './Utils/ElementUtils';
import MouseUtils from './Utils/MouseUtils';
import RoughUtils from './Utils/RoughUtils';

function Board() {
  type PointType = { x: number; y: number };
  const positionZero = { x: 0, y: 0 };
  let startMousePosition: PointType = positionZero;
  const notSelectedId = -1;
  const [selectedElementId, setSelectedElementId] = useState(notSelectedId);
  const [elements, setElements] = useState<DrawableElement[]>([]);
  // const [hoverelement, setHoverElement] = useState<DrawableElement>();
  const [mousePosition, setMousePosition] = useState<PointType>(positionZero);
  const [action, setAction] = useState<ActionType>("none");
  const [tool, setTool] = useState<ToolType>("line");
  const [stuffToLog, setStuffToLog] = useState<any[]>([]);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasContext =
      canvas.getContext("2d") || ({} as CanvasRenderingContext2D);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element: DrawableElement) => {
      RoughUtils.drawElement(canvas, element);
      // console.log("> Draw: ", element);
    });
  }, [elements]);

  function logger(show: boolean) {
    if (show) {
      console.clear();
      const newLine = "\n";
      console.log(">>> Selected ID: " + selectedElementId);
      console.log(">>> Selected tool: " + tool);
      console.log(">>> Element hovered: ");
      console.log("----------------------------------------");
      console.log(">>> Stuff: ");
      stuffToLog.map((stuff) => {
        console.log(`\t${JSON.stringify(stuff)}`);
      });
      console.log("----------------------------------------");

      elements.forEach((elmt) => {
        console.log(">>> Element: " + elmt.id);

        const obj =
          `\t coords: ${JSON.stringify(elmt.coordinates)} ${newLine}` +
          `\t shape: ${JSON.stringify(elmt.shape)} ${newLine}` +
          `\t position: ${JSON.stringify(elmt.position)} ${newLine}` +
          `\t isSelected: ${JSON.stringify(elmt.isSelected)} ${newLine}`;

        console.log(obj);
      });
    }
  }

  function updateElement(updatedElement: DrawableElement) {
    const elementsWithLastCreated = elements.map((oldElement) => {
      if (updatedElement.id === oldElement.id) {
        const position = positionWithinElement(
          mousePosition.x,
          mousePosition.y,
          updatedElement
        );
        return { ...updatedElement, position };
      }
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
    // const element = getElementAtPosition(
    //   event.clientX,
    //   event.clientY,
    //   elements
    // );

    const element = getElementAtPosition(
      mousePosition.x,
      mousePosition.y,
      elements
    );

    setStuffToLog([{ key: "getElementAtPosition", value: element || null }]);

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

    // setSelectedElement(newElement);
  }

  function addManyNewElements(newElementArr: DrawableElement[]) {
    const newElements = [...elements, ...newElementArr];
    setElements(newElements);
  }

  function drawNewElement(event: React.MouseEvent, shape: ShapeType) {
    const id = elements.length;
    // const id = getId(elements);

    const xStart = startMousePosition.x;
    const yStart = startMousePosition.y;
    const xEnd = event.clientX;
    const yEnd = event.clientY;

    const newElement: DrawableElement = {
      id,
      coordinates: { xStart, yStart, xEnd, yEnd },
      shape,
      isSelected: true,
    };
    setSelectedElementId(id);
    addNewElement(newElement);
    setAction("drawing");
  }

  function handleOnMouseDown(event: React.MouseEvent) {
    startMousePosition = { x: event.clientX, y: event.clientY };
    if (tool === "selection") {
      moveOrResizeSelectedElement(event);
    } else {
      drawNewElement(event, tool);
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

    // setStuffToLog([
    //   { key: "raisedElement", value: raisedElement || null },
    //   { key: "selectedElement", value: selectedElement || null },
    // ]);

    if (raisedElement) {
      if (raisedElement.isSelected) setSelectedElementId(raisedElement.id);
      updateElement(raisedElement);
    }
  }

  function handleOnMouseMove(event: React.MouseEvent) {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
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
    addNewElement({
      id: 213,
      coordinates: { xStart: 484, yStart: 374, xEnd: 556, yEnd: 395 },
      shape: "rectangle",
    });
    // Posteriorly we'll search these elements from DynamoDB (not mocked)
    const mockedDrawable: DrawableElement[] = [];

    mockedElements.forEach((element: any) => {
      const newElement = {
        // id: element.id,
        id: getId(elements),
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

  useEffect(() => {
    logger(true);
  }, [elements, tool, selectedElementId, stuffToLog]);

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
