import { CursorType } from '../Types/CursorType';
import { PointType } from '../Types/PointType';

export interface IElementProps {
  position?: PointType;
  cursor: CursorType;
  setCursor: React.Dispatch<React.SetStateAction<CursorType>>;
  showTextInput: () => void;
}
