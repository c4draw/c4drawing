import React, { useLayoutEffect, useState } from "react";
import Draggable from "react-draggable";
import rough from "roughjs/bundled/rough.esm";

import "./styles.css";

const roughGenerator = rough.generator();

// function createElement(xStart, yStart, xEnd, yEnd, roughElementType) {
//   const roughElement =
//     roughElementType === "line"
//       ? roughGenerator.line(xStart, yStart, xEnd, yEnd)
//       : roughGenerator.rectangle(xStart, yStart, xEnd - xStart, yEnd - yStart);

//   return { xStart, yStart, xEnd, yEnd, roughElement };
// }

function App() {
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [elementType, setElementType] = useState("line");

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");

    const canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  function createElement(xStart, yStart, xEnd, yEnd) {
    const roughElement =
      elementType === "line"
        ? roughGenerator.line(xStart, yStart, xEnd, yEnd)
        : roughGenerator.rectangle(
            xStart,
            yStart,
            xEnd - xStart,
            yEnd - yStart
          );

    return { xStart, yStart, xEnd, yEnd, roughElement };
  }

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
    <div>
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
}

export default App;
