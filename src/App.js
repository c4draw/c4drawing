import React, { useLayoutEffect, useState } from "react";
import Draggable from "react-draggable";
import rough from "roughjs/bundled/rough.esm";

import "./styles.css";

const roughGenerator = rough.generator();

function createElement(xStart, yStart, xEnd, yEnd) {
  const roughElement = roughGenerator.line(xStart, yStart, xEnd, yEnd);
  return { xStart, yStart, xEnd, yEnd, roughElement };
}

function App() {
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");

    const canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  });

  function handleOnMouseDown({ clientX, clientY }) {
    setDrawing(true);

    const newRoughElement = createElement(clientX, clientY, clientX, clientY);
    setElements((prevState) => [...prevState, newRoughElement]);
  }

  function handleOnMouseMove({ clientX: clientXEnd, clientY: clientYEnd }) {
    if (!drawing) return;

    const currentElementCreatedIndex = elements.length - 1;
    const { xStart, yStart } = elements[currentElementCreatedIndex];

    const updateCurrentElementCreated = createElement(
      xStart,
      yStart,
      clientXEnd,
      clientYEnd
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
    <canvas
      id="canvas"
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseUp={handleOnMouseUp}
      onMouseDown={handleOnMouseDown}
      onMouseMove={handleOnMouseMove}
      style={{ backgroundColors: "blue" }}
    >
      Canvas
    </canvas>
  );
}

export default App;
