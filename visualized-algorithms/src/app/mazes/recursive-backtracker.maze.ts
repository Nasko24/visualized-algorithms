import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {defaultEndNode, defaultStartNode, gridXSize, gridYSize} from '../constants/constants';
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

    // this.visitedTiles.push(this.gridService.createCoordinateSet(defaultStartNode[0], defaultStartNode[1]));
    // this.visitedTiles.push(this.gridService.createCoordinateSet(defaultEndNode[0], defaultEndNode[1]));
    this.applyTileToStacks(startingTile);

    // while the visited tile stack is not empty, keep going
    const maxIterations = 1500;
    let count = 0;
    while (this.localStack.length !== 0 && count < maxIterations) {
      count++;

      // get random unvisited neighbor
      // if the unvisited neighbor is null (meaning that there are no unvisited neighbors for the current tile)
      // pop the last tile from the local stack and mark as current tile (going backwards to trace another path)
      if (this.movedUp) {
        if (this.neighborsNotVisited(this.gridService.getUpperNeighbors(this.gridService.getTileAbove(this.currentTile)))) {
          this.applyTileToStacks(this.gridService.getTileAbove(this.currentTile));
        } else { this.currentTile = this.localStack.pop(); }
        this.movedUp = false;
        continue;
      } else if (this.movedDown) {
        if (this.neighborsNotVisited(this.gridService.getLowerNeighbors(this.gridService.getTileBelow(this.currentTile)))) {
          this.applyTileToStacks(this.gridService.getTileBelow(this.currentTile));
        } else { this.currentTile = this.localStack.pop(); }
        this.movedDown = false;
        continue;
      } else if (this.movedRight) {
        if (this.neighborsNotVisited(this.gridService.getRightNeighbors(this.gridService.getTileRight(this.currentTile)))) {
          this.applyTileToStacks(this.gridService.getTileRight(this.currentTile));
        } else { this.currentTile = this.localStack.pop(); }
        this.movedRight = false;
        continue;
      } else if (this.movedLeft) {
        if (this.neighborsNotVisited(this.gridService.getLeftNeighbors(this.gridService.getTileLeft(this.currentTile)))) {
          this.applyTileToStacks(this.gridService.getTileLeft(this.currentTile));
        } else { this.currentTile = this.localStack.pop(); }
        this.movedLeft = false;
        continue;
      }
      const unvisitedNeighbors: CoordinateSet[] = this.getUnvisitedNeighbors(this.currentTile);
      if (unvisitedNeighbors === null) { this.currentTile = this.localStack.pop(); continue; }
      const randomUnvisitedNeighbor = this.selectRandomUnvisitedNeighbor(unvisitedNeighbors);

      this.applyTileToStacks(randomUnvisitedNeighbor);
    }

    return this.gridStack;
  }

  // TODO: make a unit test for this method
  private getUnvisitedNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    const unvisitedNeighbors: CoordinateSet[] = [];

    // observe if neighbors are unvisited
    if (this.neighborsNotVisited(this.gridService.getUpperNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getTileAbove(currentTile));
    }
    if (this.neighborsNotVisited(this.gridService.getLowerNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getTileBelow(currentTile));
    }
    if (this.neighborsNotVisited(this.gridService.getRightNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getTileRight(currentTile));
    }
    if (this.neighborsNotVisited(this.gridService.getLeftNeighbors(currentTile))) {
      unvisitedNeighbors.push(this.gridService.getTileLeft(currentTile));
    }

    if (unvisitedNeighbors.length === 0) {
      return null;
    } else {
      return unvisitedNeighbors;
    }
  }

  private selectRandomUnvisitedNeighbor(unvisitedNeighbors: CoordinateSet[]): CoordinateSet {
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

  private neighborsNotVisited(neighbors: CoordinateSet[]): boolean {
    for (const neighbor of neighbors) {
      if (neighbor.x < -1 || neighbor.x > gridXSize || neighbor.y < -1 || neighbor.y > gridYSize
        || this.gridService.existsInTileSetArray(neighbor, this.visitedTiles)) { return false; }
    }
    return true;
  }

  private applyTileToStacks(tile: CoordinateSet) {
    // set the non-null tile to the current tile
    this.currentTile = tile;
    // mark the tile as VISITED
    this.visitedTiles.push(this.currentTile);
    // push the current tile to the local stack (keep track of path)
    this.localStack.push(this.currentTile);
    // push the current tile to the gridStack (passed into grid service for applying to visual grid)
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(this.currentTile));
  }
}
