import { CursorModeEnum } from 'enums/CursorMode';
import React from 'react';
import { Text } from 'react-konva';

import { IElementProps } from '../Interfaces/ElementProps';
import { KovaMouseEvent } from '../Types/KonvaMouseEvent';

interface IEditableTextProps extends IElementProps {
  props?: React.ComponentProps<typeof Text>;
}

const EditableTextElement: React.FC<IEditableTextProps> = ({
  cursor,
  setCursor,
  showTextInput,
  props,
}) => {
  function handleMouseEnter(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Text });
  }

  function handleMouseLeave(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Grab });
  }

  function handleonDblClick(event: KovaMouseEvent) {
    showTextInput();
  }

  return (
    <Text
      text="Test Text"
      fontFamily="Neucha"
      fontSize={20}
      fill="#333"
      align="center"
      x={0}
      y={0}
      width={300}
      padding={8}
      onDblClick={handleonDblClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  );
};

export default EditableTextElement;
