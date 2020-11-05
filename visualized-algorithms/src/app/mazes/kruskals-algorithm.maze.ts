import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {tileStateWall} from '../constants/constants';

export class KruskalsAlgorithmMaze {
  private gridStack: TileLocationAndState[];
  private tileSets;
  private unavailableTiles: CoordinateSet[];

constructor(public gridService: GridService) {
    this.gridStack = [];
    this.tileSets = [];
    this.unavailableTiles = [];
  }

  generateKruskalsAlgorithmMaze(): TileLocationAndState[] {
    // ALGORITHM START
    while (true) {
      // find a random tile that is available (it CAN be part of the gridStack)
      const randomAvailableTile: CoordinateSet = this.findRandomAvailableTile();

      // find a random neighbor of the tile found above that IS NOT part of the gridStack
      // Requirements for a valid neighbor:
      // CANNOT: be in this.gridStack
      // CANNOT: have its diagonal neighbors on the opposite side be in this.gridStack
      const randomNeighbor: CoordinateSet = this.findRandomAvailableNeighbor(randomAvailableTile);

      // check if the random tile or its neighbor are part of any defined tile sets (this.tileSets())

      break;
    }

    return this.gridStack;
  }

  private findRandomAvailableTile() {
    const availableTiles: CoordinateSet[] = this.gridService.getAllTilesOfState(tileStateWall).filter((tile) => {
      this.tileIsAvailable(tile, this.unavailableTiles);
    });
    return availableTiles[Math.floor(Math.random() * availableTiles.length)];
  }

  private findRandomAvailableNeighbor(tile: CoordinateSet) {
    const neighbors: CoordinateSet[] = this.gridService.getTileDirectNeighbors(tile).filter((neighbor) => {
      if (this.tileIsAvailable(neighbor, this.unavailableTiles) && this.tileIsNotInGridStack(neighbor, this.gridStack)) {
        return true;
      } else { return false; }
    });
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  }

  private tileIsNotInGridStack(neighbor: CoordinateSet, gridStack: TileLocationAndState[]) {
    gridStack.forEach((tile) => {
      if (this.gridService.coordinateSetsAreTheSame(neighbor, this.gridService.getTileCoordinates(tile.tileIndex))) {
        return false;
      }
    });
    return true;
  }

  private tileIsAvailable(tile: CoordinateSet, unavailableTiles: CoordinateSet[]) {
    unavailableTiles.forEach((unavailableTile) => {
      if (this.gridService.coordinateSetsAreTheSame(tile, unavailableTile)) {
        return true;
      }
    });
    return false;
  }
}
