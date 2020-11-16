import React from 'react';
import { ToolType } from 'types/ToolType';

import lineSVG from '../../assets/svg/line.svg';
import mouseSVG from '../../assets/svg/mouse.svg';
import squareSVG from '../../assets/svg/square.svg';

interface IToolBoxProps {
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
}

const ToolBox: React.FC<IToolBoxProps> = ({ tool, setTool }) => {
  return (
    <div className="tool-box">
      <div
        className={`button-selection ${
          tool === "selection" && "button-selection-selected"
        }`}
        onClick={() => setTool("selection")}
      >
        <img src={mouseSVG} alt="Selecionar..." />
      </div>
      <div
        className={`button-selection ${
          tool === "line" && "button-selection-selected"
        }`}
        onClick={() => setTool("line")}
      >
        <img src={lineSVG} alt="Linha" />
      </div>
      <div
        className={`button-selection ${
          tool === "rectangle" && "button-selection-selected"
        }`}
        onClick={() => setTool("rectangle")}
      >
        <img src={squareSVG} alt="Quadrado" />
      </div>
    </div>
  );
};

export default ToolBox;
