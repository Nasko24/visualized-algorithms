import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';

export class SidewinderMaze {
  private gridStack: TileLocationAndState[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
  }

  generateSidewinderMaze(startingTile: CoordinateSet) {
    return this.gridStack;
  }
}
