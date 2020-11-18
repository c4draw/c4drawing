import "./styles.css";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActionType } from "types/actionType";
import { TextualElementType } from "types/TextualElement";

import { ToolType } from "../../constants/toolType";
import { ElementWhiteboardDrawing } from "../../types/elementWhiteboardDrawing";
import ToolBox from "./ToolBox";
import ToolsActions from "./ToolsActions";
import { CanvasUtils } from "./Utils/CanvasUtils";
import {
  adjustElementCoordinates,
  getElementAtPosition,
} from "./Utils/ElementUtils";
import MouseUtils from "./Utils/MouseUtils";
import RoughUtils, { rough } from "./Utils/RoughUtils";

function Board() {
  type PointType = { x: number; y: number };
  const minInputWidth = 5;
  const mouseOffset: PointType = { x: 8, y: 14 };
  const initialInputInfo: TextualElementType = { value: "", x: -1, y: -1 };

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [elements, setElements] = useState<Array<ElementWhiteboardDrawing>>([]);
  const [action, setAction] = useState<ActionType>("none");
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [tool, setTool] = useState(ToolType.LINE);
  const [, setMousePosition] = useState<PointType>({ x: 0, y: 0 });

  const [inputInfo, setInputInfo] = useState(initialInputInfo);
  const [, setInputWidht] = useState(minInputWidth);
  const [showInput, setShowInput] = useState(false);

  useLayoutEffect(() => {
    // const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasContext =
      canvas.getContext("2d") || ({} as CanvasRenderingContext2D);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element: ElementWhiteboardDrawing) => {
      const { roughElement } = element;
      if (roughElement) {
        roughCanvas.draw(roughElement);
        return;
      }
      CanvasUtils.writeText(canvasContext, element);
    });
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
    elementsWithLastCreated[id] = {
      ...updateCurrentElementCreated,
      text: "unset",
    };

    setElements(elementsWithLastCreated);
  }

  function writeText() {
    setShowInput(true);
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

    setElements((prevState) => [
      ...prevState,
      { ...newRoughElement, text: "unset" },
    ]);
    setSelectedElement(newRoughElement);
    setAction("drawing");
  }

  function handleOnMouseDown(event: React.MouseEvent) {
    event.preventDefault();
    switch (tool) {
      case ToolType.SELECTION:
        moveOrResizeSelectedElement(event);
        break;

      case ToolType.TEXT:
        writeText();
        break;

      default:
        drawNewElement(event);
        break;
    }

    // if (tool === ToolType.SELECTION) {
    //   moveOrResizeSelectedElement(event);
    // } else {
    //   drawNewElement(event);
    // }
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

  function updateMousePosition(event: React.MouseEvent) {
    const safeX = event.clientX - mouseOffset.x;
    const safeY = event.clientY - mouseOffset.y;
    setMousePosition({ x: event.clientX, y: event.clientY });
    if (!showInput) setInputInfo({ ...inputInfo, x: safeX, y: safeY });
    // if (showInput) setInputInfo({ ...inputInfo, x: safeX, y: safeY });
  }

  function handleOnMouseMove(event: React.MouseEvent) {
    updateMousePosition(event);
    // console.clear();
    // console.log(">>> inputRef: ", inputRef.current);

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
    if (tool === ToolType.TEXT) {
      inputRef.current?.focus();
    }

    if (!selectedElement) return;

    const allowedActions: ActionType[] = ["drawing", "resizing"];

    if (allowedActions.includes(action)) {
      updateSelectElementCoordinates();
    }

    setAction("none");
    setSelectedElement(null);
  }

  useEffect(() => {
    setTool(ToolType.TEXT);
  }, []);

  useEffect(() => {
    setInputWidht(inputInfo.value.length);
  }, [inputInfo.value]);

  useEffect(() => {
    if (tool !== "text") {
      setShowInput(false);
    }
  }, [tool]);

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setInputInfo({ ...inputInfo, value });
  }

  function handleInputKeyDown({ key }: React.KeyboardEvent) {
    if (!inputRef.current) return;

    if (key === "Escape") {
      setShowInput(false);
      const { width, height } = inputRef.current.style;
      const numericwidth = Number(width.replace("px", ""));
      const numericheight = Number(height.replace("px", ""));

      const textElement: ElementWhiteboardDrawing = {
        id: elements.length,
        toolType: "text",
        xStart: inputInfo.x + mouseOffset.x,
        yStart: inputInfo.y + mouseOffset.y,
        text: inputInfo.value,
        xEnd: inputInfo.x + numericwidth,
        yEnd: inputInfo.y + numericheight,
      };
      setElements([...elements, textElement]);
      setInputInfo(initialInputInfo);
    }
  }

  return (
    <div id="board" className="fade-in">
      <textarea
        id="text-input"
        ref={inputRef}
        value={inputInfo.value}
        className="text-input"
        style={{
          top: inputInfo.y,
          left: inputInfo.x,
          visibility: showInput ? "visible" : "hidden",
        }}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        maxLength={500}
        autoFocus
      />
      <ToolBox tool={tool} setTool={setTool} />
      <canvas
        // id="canvas"
        ref={canvasRef}
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
