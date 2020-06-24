import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {gridXSize, gridYSize} from '../constants/constants';
import {GridService} from '../grid/grid.service';

export class RecursiveBacktrackerMaze {
  currentTile: CoordinateSet;
  gridStack: TileLocationAndState[];
  localStack: CoordinateSet[];
  visitedTiles: CoordinateSet[];
  movedUp: boolean;
  movedDown: boolean;
  movedRight: boolean;
  movedLeft: boolean;

  constructor(public gridService: GridService) {
    this.currentTile = null;
    this.gridStack = [];
    this.localStack = [];
    this.visitedTiles = [];
    this.movedUp = false;
    this.movedDown = false;
    this.movedRight = false;
    this.movedLeft = false;
  }

  generateMaze(startingTile: CoordinateSet): TileLocationAndState[] {

    // start out by putting start node on the visitedTiles stack
    this.visitedTiles.push(startingTile);
    this.currentTile = startingTile;
    // push the current tile to the local stack
    this.localStack.push(this.currentTile);
    // create TileLocationAndState object based on currentTile object
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(this.currentTile));

    // while the visited tile stack is not empty, keep going
    const maxIterations = 200;
    let count = 0;
    while (this.localStack.length !== 0 && count < maxIterations) {
      count++;

      // get random unvisited neighbor
      // if the unvisited neighbor is null (meaning that there are no unvisited neighbors for the current tile)
      // pop the last tile from the local stack and mark as current tile (going backwards to trace another path)
      const unvisitedNeighbors: CoordinateSet[] = this.getUnvisitedNeighbors(this.currentTile);
      let randomUnvisitedNeighbor = null;
      if (unvisitedNeighbors[0].override) { randomUnvisitedNeighbor = unvisitedNeighbors[0];
      } else { randomUnvisitedNeighbor = this.selectRandomUnvisitedNeighbor(unvisitedNeighbors); }

      if (randomUnvisitedNeighbor === null) {
        this.currentTile = this.localStack.pop();
        continue;
      }

      // set the non-null random neighbor to the current tile
      this.currentTile = randomUnvisitedNeighbor;
      // mark the random unvisited neighbor as VISITED
      this.visitedTiles.push(randomUnvisitedNeighbor);
      // push the current tile to the local stack (keep track of path)
      this.localStack.push(this.currentTile);
      // push the current tile to the gridStack
      this.gridStack.push(this.gridService.createTileLocationAndStateObject(this.currentTile));
    }

    return this.gridStack;
  }

  // TODO: make a unit test for this method
  private getUnvisitedNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    const unvisitedNeighbors: CoordinateSet[] = [];

    // observe if neighbors are unvisited
    if (this.neighborsNotVisited(this.gridService.getUpperNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getTileAbove(currentTile));
      if (this.movedUp) { this.movedUp = false; return [this.gridService.getTileAboveWithOverride(currentTile)]; }
    } else if (this.movedUp) { this.movedUp = false; return null; }
    if (this.neighborsNotVisited(this.gridService.getLowerNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getTileBelow(currentTile));
      if (this.movedDown) { this.movedDown = false; return [this.gridService.getTileBelow(currentTile)]; }
    } else if (this.movedDown) { this.movedDown = false; return null; }
    if (this.neighborsNotVisited(this.gridService.getRightNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getTileRight(currentTile));
      if (this.movedRight) { this.movedRight = false; return [this.gridService.getTileRight(currentTile)]; }
    } else if (this.movedRight) { this.movedRight = false; return null; }
    if (this.neighborsNotVisited(this.gridService.getLeftNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getTileLeft(currentTile));
      if (this.movedLeft) { this.movedLeft = false; return [this.gridService.getTileLeft(currentTile)]; }
    } else if (this.movedLeft) { this.movedLeft = false; return null; }

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
      const randomNeighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
      if (this.gridService.coordinateSetsAreTheSame(this.gridService.getTileAbove(this.currentTile), randomNeighbor)) {
        this.movedUp = true;
      } else if (this.gridService.coordinateSetsAreTheSame(this.gridService.getTileBelow(this.currentTile), randomNeighbor)) {
        this.movedDown = true;
      } else if (this.gridService.coordinateSetsAreTheSame(this.gridService.getTileRight(this.currentTile), randomNeighbor)) {
        this.movedRight = true;
      } else if (this.gridService.coordinateSetsAreTheSame(this.gridService.getTileLeft(this.currentTile), randomNeighbor)) {
        this.movedLeft = true; }
      return randomNeighbor;
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
