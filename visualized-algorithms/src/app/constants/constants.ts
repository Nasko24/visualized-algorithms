export const algorithms = [
  'Algorithm 1',
  'Algorithm 2'
];

export const maze1 = 'Maze 1';
export const maze2 = 'Maze 2';
export const mazes = [
  maze1,
  maze2
];

export const speedSlow = 250;
export const speedAverage = 150;
export const speedFast = 100;
export const speedSuperFast = 50;
export const speedUltraFast = 25;
export const speeds = [
  ['Slow', speedSlow],
  ['Average', speedAverage],
  ['Fast', speedFast],
  ['SuperFast', speedSuperFast],
  ['UltraFast', speedUltraFast]
];

export const tileStateNormal = 'normal';
export const tileStateVisited = 'visited';
export const tileStateRevisited = 'revisited';
export const tileStateWall = 'wall';
export const tileStatePath = 'path';

export const gridXSize = 62;
export const gridYSize = 24;
export const gridSize = gridXSize * gridYSize;

export interface StateChange {
  coordinateX: number;
  coordinateY: number;
  tileState: string;
}
