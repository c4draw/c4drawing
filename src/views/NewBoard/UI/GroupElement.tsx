import { CursorModeEnum } from 'enums/CursorMode';
import React from 'react';
import { Group } from 'react-konva';

import { CursorType } from '../Types/CursorType';
import { KovaMouseEvent } from '../Types/KonvaMouseEvent';

type GroupProps = React.ComponentProps<typeof Group>;

interface IGroupElementProps {
  cursor: CursorType;
  setCursor: React.Dispatch<React.SetStateAction<CursorType>>;
  props?: GroupProps;
}

const GroupElement: React.FC<IGroupElementProps> = ({
  cursor,
  setCursor,
  children,
  props,
}) => {
  function handleMouseEnter(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Grab });
  }

  function handleMouseDown(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Grabbing });
  }

  function handleMouseLeave(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Default });
  }

  function handleUserDragStart(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Grabbing });
  }

  function handleUserDragMove(event: KovaMouseEvent) {}

  function handleUserDragEnd(event: KovaMouseEvent) {
    setCursor({ ...cursor, mode: CursorModeEnum.Grab });
  }

  return (
    <Group
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onDragStart={handleUserDragStart}
      onDragMove={handleUserDragMove}
      onDragEnd={handleUserDragEnd}
    >
      {children}
    </Group>
  );
};

export default GroupElement;
