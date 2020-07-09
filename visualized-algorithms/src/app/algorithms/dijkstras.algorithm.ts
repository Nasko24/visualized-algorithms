import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {tileStateNormal} from '../constants/constants';

export class DijkstrasAlgorithm {
  gridStack: TileLocationAndState[];
  unvisitedTiles: TileLocationAndState[];
  visitedTiles: TileLocationAndState[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
  }

  applyDijkstrasAlgorithm(startTile: CoordinateSet, endTile: CoordinateSet): TileLocationAndState[] {
    this.unvisitedTiles = this.gridService.getAllTilesOfState(tileStateNormal);
    this.visitedTiles = [];

    // TODO: apply the algorithm logic and push visited tiles on this.gridStack in the order they are visited

    // TODO: apply the search for the shortest path

    // TODO: once shortest path between start and end tile is found, need to communicate that to gridService
    return this.gridStack;
  }
}
