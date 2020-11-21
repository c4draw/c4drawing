import { CursorModeEnum } from 'enums/CursorMode';

import { PointType } from './PointType';

export type CursorType = {
  position: PointType;
  mode: CursorModeEnum;
};
