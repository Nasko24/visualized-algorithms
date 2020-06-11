export interface Algorithm {
  name: string;
}

export interface Speed {
  speed: string;
  speedMS: number;
}

export interface TileLocationAndState {
  coordinateX: number;
  coordinateY: number;
  tileState: string;
}
