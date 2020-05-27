export interface Algorithm {
  name: string;
}
export const dijkstrasAlgorithm: Algorithm = { name: 'Dijkstra\'s Algorithm' };
export const aStarAlgorithm: Algorithm = { name: 'A* Search' };
export const dStarAlgorithm: Algorithm = { name: 'D* Search' };
export const depthFirstSearchAlgorithm: Algorithm = { name: 'Depth-first Search' };
export const breadthFirstSearchAlgorithm: Algorithm = { name: 'Breadth-first Search' };
export const greedyAlgorithm: Algorithm = { name: 'Greedy Algorithm' };
export const swarmAlgorithm: Algorithm = { name: 'Swarm Algorithm' };
export const convergentSwarmAlgorithm: Algorithm = { name: 'Convergent Swarm' };
export const biderectionalSwarmAlgorithm: Algorithm = { name: 'Bidirectional Swarm' };
export const algorithms: Algorithm[] = [
  dijkstrasAlgorithm,
  aStarAlgorithm,
  dStarAlgorithm,
  depthFirstSearchAlgorithm,
  breadthFirstSearchAlgorithm,
  greedyAlgorithm,
  swarmAlgorithm,
  convergentSwarmAlgorithm,
  biderectionalSwarmAlgorithm
];

export const maze1 = 'Maze 1';
export const maze2 = 'Maze 2';
export const mazes = [
  maze1,
  maze2
];

export interface Speed {
  speed: string;
  speedMS: number;
}
export const speedSlow: Speed = { speed: 'Slow', speedMS: 200 };
export const speedAverage: Speed = { speed: 'Average', speedMS: 150 };
export const speedFast: Speed = { speed: 'Fast', speedMS: 100 };
export const speedSuperFast: Speed = { speed: 'SuperFast', speedMS: 50 };
export const speedUltraFast: Speed = { speed: 'UltraFast', speedMS: 25 };
export const speeds: Speed[] = [
  speedSlow,
  speedAverage,
  speedFast,
  speedSuperFast,
  speedUltraFast
];

export const tileStateNormal = 'normal';
export const tileStateVisited = 'visited';
export const tileStateRevisited = 'revisited';
export const tileStateWall = 'wall';
export const tileStatePath = 'path';

export const gridXSize = 62;
export const gridYSize = 24;
export const gridSize = gridXSize * gridYSize;

export interface TileLocationAndState {
  coordinateX: number;
  coordinateY: number;
  tileState: string;
}
