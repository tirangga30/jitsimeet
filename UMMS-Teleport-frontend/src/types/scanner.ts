interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface IPoint {
  x: number;
  y: number;
}

export interface IDetectedBarcode {
  boundingBox: IBoundingBox;
  cornerPoints: IPoint[];
  format: string;
  rawValue: string;
}
