import React from 'react';

import lineSVG from '../../assets/svg/line.svg';
import mouseSVG from '../../assets/svg/mouse.svg';
import squareSVG from '../../assets/svg/square.svg';
import { ToolType } from '../../constants/toolType';

interface IToolBoxProps {
  tool: string;
  setTool: React.Dispatch<React.SetStateAction<string>>;
}

const ToolBox: React.FC<IToolBoxProps> = ({ tool, setTool }) => {
  return (
    <div className="tool-box">
      <div
        className={`button-selection ${
          tool === ToolType.SELECTION && "button-selection-selected"
        }`}
        onClick={() => setTool(ToolType.SELECTION)}
      >
        <img src={mouseSVG} alt="Selecionar..." />
      </div>
      <div
        className={`button-selection ${
          tool === ToolType.LINE && "button-selection-selected"
        }`}
        onClick={() => setTool(ToolType.LINE)}
      >
        <img src={lineSVG} alt="Linha" />
      </div>
      <div
        className={`button-selection ${
          tool === ToolType.RECTANGLE && "button-selection-selected"
        }`}
        onClick={() => setTool(ToolType.RECTANGLE)}
      >
        <img src={squareSVG} alt="Quadrado" />
      </div>
    </div>
  );
};

export default ToolBox;
