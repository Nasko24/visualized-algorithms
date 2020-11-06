import {Speed, Algorithm, Maze} from './interfaces';

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
  // aStarAlgorithm,
  // dStarAlgorithm,
  // depthFirstSearchAlgorithm,
  // breadthFirstSearchAlgorithm,
  // greedyAlgorithm,
  // swarmAlgorithm,
  // convergentSwarmAlgorithm,
  // biderectionalSwarmAlgorithm
];

export const recursiveBacktracker: Maze = { name: 'Recursive Backtracker', startingLocation: [1, 1] };
export const primsAlgorithm: Maze = { name: 'Prim\'s Algorithm' };
export const mazes: Maze[] = [
  recursiveBacktracker,
  primsAlgorithm
];

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
export const infinity = 1073741824;

export const defaultStartNode = [13, 12];
export const defaultEndNode = [48, 12];

export const startNodeName = 'starting_node';
export const endNodeName = 'ending_node';

export const emptyString = '';
