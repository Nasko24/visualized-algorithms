import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {infinity, tileStateNormal} from '../constants/constants';

export class DijkstrasAlgorithm {
  gridStack: TileLocationAndState[];
  unvisitedTiles: CoordinateSet[];
  visitedTiles: CoordinateSet[];
  shortestPath: TileLocationAndState[];
  nodeMap: Map<CoordinateSet, [number, CoordinateSet]>;

  constructor(public gridService: GridService) {
    this.gridStack = [];
  }

  applyDijkstrasAlgorithm(startTile: CoordinateSet, endTile: CoordinateSet): TileLocationAndState[] {
    this.unvisitedTiles = this.gridService.getAllTilesOfState(tileStateNormal);
    this.visitedTiles = [];
    this.shortestPath = [];
    this.nodeMap = this.generateMap(startTile, endTile, this.unvisitedTiles);

    // TODO: apply the algorithm logic and push visited tiles on this.gridStack in the order they are visited

    const currentTile: CoordinateSet = startTile;
    // continue running loop until all tiles have been visited or shortest path has been found
    while (this.unvisitedTiles.length > 0 && this.shortestPath.length === 0) {
      const unvisitedNeighbors: CoordinateSet[] = this.getUnvisitedNeighbors(currentTile);

      for (const neighbor of unvisitedNeighbors) {
        const neighborWeight = this.gridService.getTileWeight(neighbor);
      }
    }

    // TODO: apply the search for the shortest path

    // TODO: once shortest path between start and end tile is found, need to communicate that to gridService
    return this.gridStack;
  }

  private getUnvisitedNeighbors(tile: CoordinateSet): CoordinateSet[] {
    const neighbors: CoordinateSet[] = this.gridService.getTileDirectNeighbors(tile);
    for (const item of neighbors) {
      if (!this.gridService.existsInTileSetArray(item, this.visitedTiles)) { neighbors.push(item); }
    }
    return neighbors;
  }

  private generateMap(startTile: CoordinateSet, endTile: CoordinateSet, unvisitedTiles: CoordinateSet[]):
    Map<CoordinateSet, [number, CoordinateSet]> {
    const nodeMap = new Map();

    nodeMap.set(startTile, [0, null]);
    for (const tile of unvisitedTiles) { nodeMap.set(tile, [infinity, null]); }
    nodeMap.set(endTile, [infinity, null]);

    return nodeMap;
  }
}
