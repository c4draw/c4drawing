import './styles.css';

import React, { useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';

import { ElementType } from '../../constants/elementType';
import { ELementWhiteboardDrawing } from '../../types/elementWhiteboardDrawing';

const Board = () => {
  const [elements, setElements] = useState<Array<ELementWhiteboardDrawing>>([]);
  const [drawing, setDrawing] = useState(false);
  const [elementType, setElementType] = useState(ElementType.LINE);

  const roughGenerator = rough.generator();

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasContext =
      canvas.getContext("2d") || ({} as CanvasRenderingContext2D);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  function createElement(
    xEnd: number,
    yEnd: number,
    yStart: number,
    xStart: number
  ) {
    const roughElement =
      elementType === ElementType.LINE
        ? roughGenerator.line(xStart, yStart, xEnd, yEnd)
        : roughGenerator.rectangle(
            xStart,
            yStart,
            xEnd - xStart,
            yEnd - yStart
          );

    return { xStart, xEnd, yStart, yEnd, roughElement };
  }

  function handleOnMouseDown(event: React.MouseEvent) {
    setDrawing(true);

    const newRoughElement = createElement(
      event.clientX,
      event.clientY,
      event.clientY,
      event.clientX
    );
    console.log(newRoughElement);

    setElements((prevState) => [...prevState, newRoughElement]);
  }

  function handleOnMouseMove(event: React.MouseEvent) {
    if (!drawing) return;

    const currentElementCreatedIndex = elements.length - 1;
    const { xStart, yStart } = elements[currentElementCreatedIndex];
    const { clientX: clientXEnd, clientY: clientYEnd } = event;

    const updateCurrentElementCreated = createElement(
      clientXEnd,
      clientYEnd,
      yStart,
      xStart
    );

    const elementsWithLastCreated = [...elements];
    elementsWithLastCreated[
      currentElementCreatedIndex
    ] = updateCurrentElementCreated;

    setElements(elementsWithLastCreated);
  }

  function handleOnMouseUp() {
    setDrawing(false);
  }

  return (
    <div id="board" className="fade-in">
      <div style={{ position: "fixed" }}>
        <input
          type="radio"
          id="line"
          checked={elementType === "line"}
          onChange={() => setElementType("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={elementType === "rectangle"}
          onChange={() => setElementType("rectangle")}
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
