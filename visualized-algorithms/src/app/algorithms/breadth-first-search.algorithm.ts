import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {tileStateNormal, tileStatePath, tileStateVisited} from '../constants/constants';

export class BreadthFirstSearchAlgorithm {
  private gridStack: TileLocationAndState[];
  private visitedTiles: CoordinateSet[];
  private unvisitedTiles: CoordinateSet[];
  private availableNeighbors: CoordinateSet[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
    this.visitedTiles = [];
    this.unvisitedTiles = [];
    this.availableNeighbors = [];
  }

  applyBreadthFirstSearchAlgorithm(startNodeLocation: CoordinateSet, endNodeLocation: CoordinateSet) {
    this.unvisitedTiles = this.gridService.getAllTilesOfState(tileStateNormal);
    this.unvisitedTiles.push(endNodeLocation);

    const availableNeighbors: CoordinateSet[] = this.getTileNeighbors(startNodeLocation);
    this.addTilesToAvailableNeighbors(availableNeighbors);
    this.addTileToGridStack(startNodeLocation, tileStateVisited);

    let end = false;
    while (this.unvisitedTiles.length !== 0) {
      // loop through all available neighbors
      let newNeighbors: CoordinateSet[] = [];
      const len = this.availableNeighbors.length;

      for (let i = 0; i < len; i++) {
        const neighbor = this.availableNeighbors.pop();
        if (this.gridService.coordinateSetsAreTheSame(neighbor, endNodeLocation)) {
          end = true;
          break;
        }

        const neighbors: CoordinateSet[] = this.getTileNeighbors(neighbor);

        newNeighbors.push(...neighbors);
        newNeighbors = this.removeDuplicates(newNeighbors);

        this.removeTileFromUnvisitedTiles(neighbor);

        this.addTileToVisitedTiles(neighbor);

        this.addTileToGridStack(neighbor, tileStateVisited);
      }

      this.addTilesToAvailableNeighbors(newNeighbors);

      if (end) { break; }
    }

    // this.calculateShortestPath();

    return this.gridStack;
  }

  private addTileToVisitedTiles(tile: CoordinateSet) {
    this.visitedTiles.push(tile);
  }

  private addTilesToAvailableNeighbors(tiles: CoordinateSet[]) {
    this.availableNeighbors.push(...tiles);
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

  private removeDuplicates(list: CoordinateSet[]) {
    const newList: CoordinateSet[] = [];
    for (const tile of list) {
      if (this.tileExistsInArray(tile, newList)) {
        continue;
      } else {
        newList.push(tile);
      }
    }
    return newList;
  }
}
