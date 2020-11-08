export interface Algorithm {
  name: string;
}

export interface Maze {
  name: string;
  startingLocation?: number[];
  rowsToProcess?: number;
}

export interface Speed {
  speed: string;
  speedMS: number;
}

export interface TileLocationAndState {
  coordinateX: number;
  coordinateY: number;
  tileState: string;
  tileWeight?: number;
  tileIndex?: number;
}

export interface CoordinateSet {
  x: number;
  y: number;
}
