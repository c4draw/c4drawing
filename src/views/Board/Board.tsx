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
  // const [elements, setElements] = useState<Array<ElementWhiteboardDrawing>>([]);
  const [elements, setElements] = useState<DrawableElement[]>([]);
  const [action, setAction] = useState<ActionType>("none");
  // const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [tool, setTool] = useState<ToolType>("line");

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasContext =
      canvas.getContext("2d") || ({} as CanvasRenderingContext2D);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // const roughCanvas = rough.canvas(canvas);
    // // elements.forEach(({ roughElement }) => {
    // //   if (roughElement) {
    // //     roughCanvas.draw(roughElement);
    // //   }
    // // });

    showElements(false);

    elements.forEach((element: DrawableElement) => {
      RoughUtils.drawElement(canvas, element);
      // console.log("> Draw: ", element);
    });
  }, [elements]);

  function showElements(show: boolean) {
    if (show) {
      console.clear();
      const newLine = ">>> ";

      elements.forEach((elmt) => {
        const obj = newLine + JSON.stringify(elmt);
        console.log(obj);
      });
    }
  }

  function updateElement(
    element: DrawableElement
    // id: number,
    // xStart: number,
    // yStart: number,
    // xEnd: number,
    // yEnd: number,
    // type: string
  ) {
    // const updateCurrentElementCreated = RoughUtils.createElement(
    //   id,
    //   xStart,
    //   yStart,
    //   xEnd,
    //   yEnd,
    //   type
    // );

    // const elementsWithLastCreated = [...elements];
    // elementsWithLastCreated[id] = updateCurrentElementCreated;

    const elementsWithLastCreated = [...elements];
    elementsWithLastCreated[element.id] = element;

    setElements(elementsWithLastCreated);
  }

  /**
   * @param element Send "null" to unselet the selected element
   */
  function setSelectedElement(newElement: DrawableElement | null) {
    let newElements: DrawableElement[] = [...elements];
    // console.log(">>>> setSelectedElement -> element", element);
    // console.log(">>>> setSelectedElement -> newElements", newElements);

    if (newElement) {
      setSelectedElement(null); // Unselect all after select one
      newElements[newElement.id] = { ...newElement, isSelected: true };
      // newElements = elements.map((oldElement: DrawableElement) => {
      //   if (oldElement.id === newElement.id) {
      //     return { ...newElement, isSelected: true };
      //   }
      //   return { ...oldElement, isSelected: false };
      // });
      // setElements(newElements);
    } else {
      const selectedElmtIdx = getSelectedElementId();
      const selectedElmt = newElements[selectedElmtIdx];
      newElements[selectedElmtIdx] = { ...selectedElmt, isSelected: false };
    }

    // console.log(">>>> setSelectedElement -> newElements", newElements);

    setElements(newElements);
  }

  function moveOrResizeSelectedElement(event: React.MouseEvent) {
    const element = getElementAtPosition(
      event.clientX,
      event.clientY,
      elements
    );
    console.log(">>> getElementAtPosition", element);
    // if (!element) return;
    // if (!element.coordinates) return;

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
    // setElements((prevState) => [...prevState, newElement]);
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
    // const newRoughElement = RoughUtils.createElement(
    //   id,
    //   event.clientX,
    //   event.clientY,
    //   event.clientX,
    //   event.clientY,
    //   tool
    // );

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
      updateElement(
        raisedElement
        // raisedElement.id,
        // raisedElement.xStart,
        // raisedElement.yStart,
        // raisedElement.xEnd,
        // raisedElement.yEnd,
        // raisedElement.type
      );
    }
  }

  function handleOnMouseMove(event: React.MouseEvent) {
    MouseUtils.setMouseStyleByTool(tool, event, elements);
    updateElementByAction(event);
  }

  function getSelectedElementId() {
    const notFoundId = -1;
    if (!elements) return notFoundId;

    const id = elements.findIndex((element) => element && element.isSelected);
    return id || notFoundId;
  }

  function getSelectedElement() {
    const selectedElementIndex = getSelectedElementId();
    return elements[selectedElementIndex];
  }

  function updateSelectElementCoordinates() {
    console.log(">> elements", elements);
    if (!elements) return;

    // const index = selectedElement.id;
    const index = getSelectedElementId();
    // const { id, toolType } = elements[index];
    console.log(">> index", index);

    if (index === -1) return;

    const { id, shape } = elements[index];
    const newElementCoods = adjustElementCoordinates(elements[index]);
    if (!newElementCoods) return;

    updateElement({
      id,
      coordinates: newElementCoods,
      shape,
    });

    // updateElement(
    //   id,
    //   newElementCoods.xStart,
    //   newElementCoods.yStart,
    //   newElementCoods.xEnd,
    //   newElementCoods.yEnd,
    //   toolType
    // );
  }

  function handleOnMouseUp() {
    if (!getSelectedElementId()) return;

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
      };

      mockedDrawable.push(newElement);
    });

    // setElements([...elements, ...mockedDrawable]);
    addManyNewElements(mockedDrawable);
  }

  useEffect(() => {
    loadElements();
    // console.log(">>> Load after:", elements);
    // addRect();
    // // addLine();

    // const newElmt: DrawableElement = {
    //   id: elements.length,
    //   coordinates: {
    //     xStart: getRandomArbitrary(10, 600),
    //     yStart: getRandomArbitrary(10, 600),
    //     xEnd: getRandomArbitrary(10, 600),
    //     yEnd: getRandomArbitrary(10, 600),
    //   },
    //   shape: new Date().getSeconds() % 2 == 0 ? "rectangle" : "line",
    // };
    // setElements([...elements, newElmt]);
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
