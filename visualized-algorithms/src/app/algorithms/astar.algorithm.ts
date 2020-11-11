import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {tileStateNormal} from '../constants/constants';

export class AstarAlgorithm {
  private gridStack: TileLocationAndState[];
  private shortestPath: TileLocationAndState[];
  private unvisitedTiles: CoordinateSet[];
  private visitedTiles: CoordinateSet[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
    this.shortestPath = [];
    this.unvisitedTiles = [];
    this.visitedTiles = [];
  }

  applyAstarAlgorithm(startNodeLocation: CoordinateSet, endNodeLocation: CoordinateSet) {
    this.unvisitedTiles = this.gridService.getAllTilesOfState(tileStateNormal);
    this.unvisitedTiles.push(endNodeLocation);

    let currentTile: CoordinateSet = startNodeLocation;

    while (this.unvisitedTiles.length > 0) { }

    return this.gridStack;
  }
}
