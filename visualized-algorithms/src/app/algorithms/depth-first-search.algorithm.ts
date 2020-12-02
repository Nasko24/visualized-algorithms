import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {tileStateNormal, tileStatePath, tileStateVisited} from '../constants/constants';

export class DepthFirstSearchAlgorithm {
  private gridStack: TileLocationAndState[];
  private visitedTiles: CoordinateSet[];
  private unvisitedTiles: CoordinateSet[];
  private tileStack: CoordinateSet[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
    this.visitedTiles = [];
    this.unvisitedTiles = [];
    this.tileStack = [];
  }

  applyDepthFirstSearchAlgorithm(startNodeLocation: CoordinateSet, endNodeLocation: CoordinateSet) {
    this.unvisitedTiles = this.gridService.getAllTilesOfState(tileStateNormal);
    this.unvisitedTiles.push(endNodeLocation);
    let currentTile: CoordinateSet = startNodeLocation;

    let popped = false;
    let poppedTile = null;

    // while there are still unvisited tiles, keep running
    while (this.unvisitedTiles.length !== 0) {
      // get available neighbors
      const availableNeighbors: CoordinateSet[] = this.getTileNeighbors(currentTile);

      // take the first available neighbor if there are any
      // otherwise pop the last tile and continue
      if (availableNeighbors.length === 0) {
        currentTile = this.tileStack.pop();
        poppedTile = currentTile;
        popped = true;
        continue;
      }
      currentTile = availableNeighbors[0];

      // add current tile to the tile stack based on popped status
      if (popped) {
        this.addTileToTileStack(poppedTile);
        this.addTileToTileStack(currentTile);
        popped = false;
      } else {
        this.addTileToTileStack(currentTile);
      }

      // if the selected neighbor is the end node, break
      if (this.gridService.coordinateSetsAreTheSame(currentTile, endNodeLocation)) { break; }

      // add the selected neighbor to the stacks
      this.addTileToVisitedTiles(currentTile);
      this.addTileToGridStack(currentTile, tileStateVisited);

      // remove the selected neighbor from the unvisited tiles
      this.removeTileFromUnvisitedTiles(currentTile);
    }

    this.calculateShortestPath(this.tileStack);

    return this.gridStack;
  }

  private addTileToVisitedTiles(tile: CoordinateSet) {
    this.visitedTiles.push(tile);
  }

  private addTileToTileStack(tile: CoordinateSet) {
    this.tileStack.push(tile);
  }

  private addTileToGridStack(tile: CoordinateSet, state: string = tileStateNormal) {
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(tile, state));
  }

  private getTileNeighbors(inputTile: CoordinateSet): CoordinateSet[] {
    // if the tile is NOT visited AND is NOT in the stack AND IS unvisited
    return this.gridService.getTileDirectNeighbors(inputTile).filter((tile) => {
      return !this.tileExistsInArray(tile, this.visitedTiles);
    }).filter((tile) => {
      return this.tileExistsInArray(tile, this.unvisitedTiles);
    });
  }

  private tileExistsInArray(inputTile: CoordinateSet, tileArray: CoordinateSet[]): boolean {
    for (const tile of tileArray) {
      if (this.gridService.coordinateSetsAreTheSame(tile, inputTile)) { return true; }
    }
    return false;
  }

  private removeTileFromUnvisitedTiles(currentTile: CoordinateSet) {
    this.unvisitedTiles = this.unvisitedTiles.filter((tile) => {
      return !(this.gridService.coordinateSetsAreTheSame(tile, currentTile));
    });
  }

  private calculateShortestPath(tileStack: CoordinateSet[]) {
    const shortestPath: TileLocationAndState[] = [];

    for (const tile of tileStack) {
      shortestPath.push(this.gridService.createTileLocationAndStateObject(tile, tileStatePath));
    }

    this.gridService.setShortestPathStateData(shortestPath);
  }
}
