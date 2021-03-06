import { CursorModeEnum } from 'enums/CursorMode';
import React, { useEffect, useState } from 'react';
import { Arrow, Layer, Stage } from 'react-konva';

import AbsoluteContainer from './Components/AbsoluteContainer';
import InputTextModal from './Components/InputTextModal';
import ToolBox from './Components/ToolBox';
import { ColorPalete } from './Enums/ColorPallete';
import { ToolsEnum } from './Enums/ToolsEnum';
import { IElementProps } from './Interfaces/ElementProps';
import { CursorType } from './Types/CursorType';
import { InteractionElementType } from './Types/InteractionElementType';
import { KovaMouseEvent } from './Types/KonvaMouseEvent';
import { PointType } from './Types/PointType';
import { PrimaryElementType } from './Types/PrimaryElementType';
import { SupportElementType } from './Types/SupportElementType';
import { UserElementType } from './Types/UserElementType';
import PrimaryElement from './UI/PrimaryElement';
import SupportElement from './UI/SupportElement';
import UserElement from './UI/UserElement';

const NewBoard = () => {
  const [tool, setTool] = useState(ToolsEnum.None);
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const initialPosition: PointType = { x: 0, y: 0 };

  const initialCursor = {
    position: initialPosition,
    mode: CursorModeEnum.Default,
  };

  const [cursor, setCursor] = useState<CursorType>(initialCursor);

  const [lineStart, setLineStart] = useState<PointType>();

  const [userElements, setUserElements] = useState<UserElementType[]>([]);

  const [primaryElements, setPrimaryElements] = useState<PrimaryElementType[]>(
    []
  );

  const [supportElements, setSupportElements] = useState<SupportElementType[]>(
    []
  );

  const [interactionElements, setInteractionElements] = useState<
    InteractionElementType[]
  >([]);

  const [showTextInput, setShowTextInput] = useState(false);

  function handeMouseMove(event: KovaMouseEvent) {
    const { evt } = event;
    const { clientX, clientY } = evt;

    const newCursor = { ...cursor, position: { x: clientX, y: clientY } };

    switch (tool) {
      case ToolsEnum.None:
        newCursor.mode = CursorModeEnum.Crosshair;
        break;

      case ToolsEnum.Interaction:
        break;

      default:
        break;
    }

    setCursor(newCursor);
  }

  function handleStageMouseDown(event: KovaMouseEvent) {
    const { evt } = event;
    const { clientX, clientY } = evt;
    const currentPosition: PointType = { x: clientX, y: clientY };

    switch (tool) {
      case ToolsEnum.User:
        const newUser: UserElementType = {
          id: userElements.length,
          x: currentPosition.x,
          y: currentPosition.y,
        };
        setUserElements([...userElements, newUser]);
        break;

      case ToolsEnum.Principal:
        const newPrimary: PrimaryElementType = {
          id: primaryElements.length,
          x: cursor.position.x - 25,
          y: cursor.position.y - 20,
        };
        setPrimaryElements([...primaryElements, newPrimary]);
        break;

      case ToolsEnum.Support:
        const newSupport: SupportElementType = {
          id: supportElements.length,
          x: cursor.position.x - 25,
          y: cursor.position.y - 20,
        };
        setSupportElements([...supportElements, newSupport]);
        break;

      case ToolsEnum.Interaction:
        if (isDrawingArrow === false) {
          setIsDrawingArrow(true);
          setLineStart(currentPosition);
          return;
        }

        if (isDrawingArrow === true) {
          if (lineStart === undefined) return; // Só para o typescript parar de reclamar

          const newInteraction: InteractionElementType = {
            id: interactionElements.length,
            points: [
              lineStart.x,
              lineStart.y,
              currentPosition.x,
              currentPosition.y,
            ],
          };
          setInteractionElements([...interactionElements, newInteraction]);

          setIsDrawingArrow(false);
          setTool(ToolsEnum.None);
          setLineStart(undefined);
        }
        break;

      default:
        break;
    }
  }

  function handleShowTextInput() {
    setShowTextInput(true);
  }

  const elementsProps: IElementProps = {
    cursor,
    setCursor,
    showTextInput: handleShowTextInput,
  };

  function hideModal() {
    setShowTextInput(false);
    setCursor({ ...cursor, mode: CursorModeEnum.Grab });
  }

  function arrowDrawer(end: PointType) {
    const defaultPosition = [350, 196, 500, 275];
    const start = lineStart;

    return (
      <Arrow
        points={[
          start?.x || defaultPosition[0],
          start?.y || defaultPosition[1],
          end?.x || defaultPosition[2],
          end?.y || defaultPosition[3],
        ]}
        dash={[10, 5]}
        strokeWidth={5}
        stroke={ColorPalete.Line}
      />
    );
  }

  function renderSelectedElement() {
    let elementToRender: any;
    switch (tool) {
      case ToolsEnum.User:
        elementToRender = (
          <UserElement
            {...elementsProps}
            position={{ x: cursor.position.x - 125, y: cursor.position.y }}
          />
        );
        break;

      case ToolsEnum.Principal:
        elementToRender = (
          <PrimaryElement
            {...elementsProps}
            position={{
              x: cursor.position.x - 150,
              y: cursor.position.y - 20,
            }}
          />
        );
        break;

      case ToolsEnum.Support:
        elementToRender = (
          <SupportElement
            {...elementsProps}
            position={{
              x: cursor.position.x - 150,
              y: cursor.position.y - 20,
            }}
          />
        );
        break;

      case ToolsEnum.Interaction:
        const isDrawing = Boolean(lineStart?.x);
        if (isDrawing) {
          elementToRender = arrowDrawer({
            x: cursor.position.x,
            y: cursor.position.y,
          });
        }
        break;

      default:
        elementToRender = null;
        break;
    }
    return elementToRender;
  }

  function handleNewBoadKeyDown(event: any) {
    const { key } = event;

    if (key === "Escape") {
      setTool(ToolsEnum.None);
      setLineStart(undefined);
      setIsDrawingArrow(false);
    }
  }

  useEffect(() => {
    window.onkeydown = handleNewBoadKeyDown;
  }, []);

  return (
    <div style={{ cursor: cursor.mode }} onKeyDown={handleNewBoadKeyDown}>
      <AbsoluteContainer position={{ left: 10, top: 10 }}>
        <ToolBox tool={tool} setTool={setTool} />
      </AbsoluteContainer>

      <AbsoluteContainer position={{ top: 0, left: 0 }}>
        {showTextInput && <InputTextModal hideModal={hideModal} />}
      </AbsoluteContainer>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseMove={handeMouseMove}
        onMouseDown={handleStageMouseDown}
      >
        <Layer>
          {renderSelectedElement()}

          {userElements.map((item, idx) => (
            <UserElement
              key={`user-` + idx}
              {...elementsProps}
              position={{ x: item.x - 125, y: item.y }}
            />
          ))}

          {primaryElements.map((item, idx) => (
            <PrimaryElement
              key={`primary-` + idx}
              {...elementsProps}
              position={{ x: item.x - 125, y: item.y }}
            />
          ))}

          {supportElements.map((item, idx) => (
            <SupportElement
              key={`support-` + idx}
              {...elementsProps}
              position={{ x: item.x - 125, y: item.y }}
            />
          ))}

          {interactionElements.map((item, idx) => (
            <Arrow
              key={`interaction-` + idx}
              points={item.points}
              dash={[10, 5]}
              strokeWidth={5}
              stroke={ColorPalete.Line}
              draggable={true}
            />
          ))}
        </Layer>
      </Stage>

      <AbsoluteContainer position={{ left: 8, bottom: 0 }}>
        <p>{cursor.position.x + " x " + cursor.position.y}</p>
      </AbsoluteContainer>
    </div>
  );
};

export default NewBoard;
