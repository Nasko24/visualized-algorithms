import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';

export class KruskalsAlgorithmMaze {
  private gridStack: TileLocationAndState[];
  private tileSets;
  private availableTiles: CoordinateSet[];

constructor(public gridService: GridService) {
    this.gridStack = [];
    this.tileSets = [];
    this.availableTiles = [];
  }

  generateKruskalsAlgorithmMaze(): TileLocationAndState[] {
    // ALGORITHM START
    while (true) {
      // find a random tile that is available (it CAN be part of the gridStack)

      // find a random neighbor of the tile found above that IS NOT part of the gridStack
      // Requirements for a valid neighbor:
      // CANNOT: be in this.gridStack
      // CANNOT: have its diagonal neighbors on the opposite side be in this.gridStack
      //

      break;
    }

    return this.gridStack;
  }

}
