import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {tileStateWall} from '../constants/constants';

export class PrimsAlgorithmMaze {
  private gridStack: TileLocationAndState[];

constructor(public gridService: GridService) {
    this.gridStack = [];
  }

  generatePrimsAlgorithmMaze(): TileLocationAndState[] {
    // ALGORITHM START

    return this.gridStack;
  }
}
