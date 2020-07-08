import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';

export class DijkstrasAlgorithm {
  gridStack: TileLocationAndState[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
  }

  applyDijkstrasAlgorithm(startingTile: CoordinateSet, endingTile: CoordinateSet): TileLocationAndState[] {
    // TODO: call the getGridState method from gridService to get information about all tiles

    // TODO: filter out tiles that are walls

    // TODO: apply the algorithm logic and push visited tiles on this.gridStack in the order they are visited
    return this.gridStack;
  }
}
