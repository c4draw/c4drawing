import { Coords } from 'interfaces/Coords';

import { PositionType } from './PositionType';
import { ShapeType } from './ShapeType';

export type DrawableElement = {
  id: number;
  shape: ShapeType;
  coordinates: Coords;
  isSelected?: boolean;
  position?: PositionType;
};
