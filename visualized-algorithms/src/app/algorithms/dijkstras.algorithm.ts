import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {infinity, tileStateNormal} from '../constants/constants';

export class DijkstrasAlgorithm {
  gridStack: TileLocationAndState[];
  unvisitedTiles: CoordinateSet[];
  visitedTiles: CoordinateSet[];
  shortestPath: TileLocationAndState[];
  nodeMap: Map<number, [number, CoordinateSet]>;

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
        const travelCost: number = this.gridService.getTileWeight(neighbor);
        const previousNode: CoordinateSet = currentTile;

        // if previous node is the start node
        if (this.gridService.coordinateSetsAreTheSame(neighbor, startTile)) {
          // if the calculated distance is less than the known distance
          const neighborIndex: number = this.gridService.getTileIndex(neighbor);
          if (this.nodeMap.get(neighborIndex)[0] > travelCost) {this.nodeMap.set(neighborIndex, [travelCost, previousNode]); }
        // if previous node is not the start node
        } else {}
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
    Map<number, [number, CoordinateSet]> {
    const nodeMap = new Map();

    nodeMap.set(this.gridService.getTileIndex(startTile), [0, null]);
    for (const tile of unvisitedTiles) {
      nodeMap.set(this.gridService.getTileIndex(tile), [infinity, null]);
    }
    nodeMap.set(this.gridService.getTileIndex(endTile), [infinity, null]);

    return nodeMap;
  }
}
