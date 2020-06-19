import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {gridXSize, gridYSize} from '../constants/constants';
import {GridService} from '../grid/grid.service';

export class RecursiveBacktrackerMaze {
  gridStack: TileLocationAndState[];
  localStack: CoordinateSet[];
  visitedTiles: CoordinateSet[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
    this.localStack = [];
    this.visitedTiles = [];
  }

  generateMaze(startingTile: CoordinateSet): TileLocationAndState[] {

    // start out by putting start node on the visitedTiles stack
    this.visitedTiles.push(startingTile);
    let currentTile = startingTile;
    // push the current tile to the local stack
    this.localStack.push(currentTile);
    // create TileLocationAndState object based on currentTile object
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(currentTile));

    // while the visited tile stack is not empty, keep going
    const maxIterations = 1500;
    let count = 0;
    while (this.localStack.length !== 0 && count < maxIterations) {
      count++;

      // get random unvisited neighbor
      // if the unvisited neighbor is null (meaning that there are no unvisited neighbors for the current tile)
      // pop the last tile from the local stack and mark as current tile (going backwards to trace another path)
      const randomUnvisitedNeighbor: CoordinateSet = this.selectRandomUnvisitedNeighbor(this.getUnvisitedNeighbors(currentTile));

      if (randomUnvisitedNeighbor === null) {
        currentTile = this.localStack.pop();
        continue;
      }

      // set the non-null random neighbor to the current tile
      currentTile = randomUnvisitedNeighbor;
      // mark the random unvisited neighbor as VISITED
      this.visitedTiles.push(randomUnvisitedNeighbor);
      // push the current tile to the local stack (keep track of path)
      this.localStack.push(currentTile);
      // push the current tile to the gridStack
      this.gridStack.push(this.gridService.createTileLocationAndStateObject(currentTile));
    }

    return this.gridStack;
  }

  // TODO: make a unit test for this method
  private getUnvisitedNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    // const neighbors: CoordinateSet[] = [];
    const unvisitedNeighbors: CoordinateSet[] = [];

    // if upper neighbor is open
    if (this.neighborsNotVisited(this.gridService.getUpperNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getUpperNeighbors(currentTile)[0]);
    }
    if (this.neighborsNotVisited(this.gridService.getLowerNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getLowerNeighbors(currentTile)[0]);
    }
    if (this.neighborsNotVisited(this.gridService.getRightNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getRightNeighbors(currentTile)[0]);
    }
    if (this.neighborsNotVisited(this.gridService.getLeftNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getLeftNeighbors(currentTile)[0]);
    }

    if (unvisitedNeighbors.length === 0) {
      return null;
    } else {
      return unvisitedNeighbors;
    }
  }

  private selectRandomUnvisitedNeighbor(unvisitedNeighbors: CoordinateSet[]): CoordinateSet {
    if (unvisitedNeighbors == null) {
      return null;
    } else {
      return unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
    }
  }

  private neighborsNotVisited(neighbors: CoordinateSet[]): boolean {
    for (const neighbor of neighbors) {
      if (neighbor.x < 0 || neighbor.x >= gridXSize || neighbor.y < 0 || neighbor.y >= gridYSize
        || this.gridService.existsInTileSetArray(neighbor, this.visitedTiles)) { return false; }
    }
    return true;
  }
}
