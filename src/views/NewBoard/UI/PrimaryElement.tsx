import { CursorModeEnum } from 'enums/CursorMode';
import React from 'react';
import { Rect } from 'react-konva';

import { ColorPalete } from '../Enums/ColorPallete';
import { IElementProps } from '../Interfaces/ElementProps';
import { KovaMouseEvent } from '../Types/KonvaMouseEvent';
import EditableTextElement from './EditableTextElement';
import GroupElement from './GroupElement';

const PrimaryElement: React.FC<IElementProps> = ({
  cursor,
  setCursor,
  showTextInput,
  position,
}) => {
  function handleTextMouseEnter(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Text });
  }

  function handleTextMouseLeave(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Default });
  }

  return (
    <GroupElement
      cursor={cursor}
      setCursor={setCursor}
      props={{ x: position?.x, y: position?.y, draggable: true }}
    >
      <Rect
        height={175}
        width={300}
        fill={ColorPalete.Primary}
        cornerRadius={10}
      />
      <EditableTextElement
        cursor={cursor}
        setCursor={setCursor}
        showTextInput={showTextInput}
        props={{
          fontStyle: "bold",
          fontSize: 20,
          y: 30,
          width: 300,
          fill: ColorPalete.Text,
          text: "Title text",
        }}
      />
      <EditableTextElement
        cursor={cursor}
        setCursor={setCursor}
        showTextInput={showTextInput}
        props={{
          fontSize: 16,
          y: 30 + 30,
          width: 300,
          fill: ColorPalete.Text,
          text: "[Tipo de Ator]",
        }}
      />
      <EditableTextElement
        cursor={cursor}
        setCursor={setCursor}
        showTextInput={showTextInput}
        props={{
          fontSize: 16,
          y: 30 + 50,
          width: 300,
          fill: ColorPalete.Text,
          text: "This is a secondary text to show how this element works.",
        }}
      />
    </GroupElement>
  );
};

export default PrimaryElement;
