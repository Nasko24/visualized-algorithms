import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';

export class DijkstrasAlgorithm {
  gridStack: TileLocationAndState[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
  }

  applyDijkstrasAlgorithm(startingTile: CoordinateSet, endingTile: CoordinateSet): TileLocationAndState[] {
    return this.gridStack;
  }
}
