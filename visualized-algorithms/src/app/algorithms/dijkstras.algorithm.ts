import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {infinity, tileStateNormal, tileStateVisited} from '../constants/constants';

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

    console.log('Starting algorithm...');

    // TODO: apply the algorithm logic and push visited tiles on this.gridStack in the order they are visited
    let currentTile: CoordinateSet = startTile;
    // continue running loop until all tiles have been visited or shortest path has been found
    let count = 0;
    const limit = 200;
    while (this.unvisitedTiles.length > 0 && this.shortestPath.length === 0 && count < limit) {
      count++;

      const unvisitedNeighbors: CoordinateSet[] = this.getUnvisitedNeighbors(currentTile);

      console.log('Current tile ' + JSON.stringify(currentTile));

      for (const neighbor of unvisitedNeighbors) {
        const previousNode: CoordinateSet = currentTile;
        const neighborDistanceFromStart: number = this.nodeMap.get(this.gridService.getTileIndex(currentTile))[0]
          + this.gridService.getTileWeight(neighbor);

        if (neighborDistanceFromStart < this.nodeMap.get(this.gridService.getTileIndex(neighbor))[0]) {
          this.setShortestDistanceAndPreviousNode(neighbor, neighborDistanceFromStart, previousNode);
        }
      }

      this.removeNodeFromUnvisitedTiles(currentTile);
      this.addNodeToVisitedTiles(currentTile);
      currentTile = this.getUnvisitedTileWithShortestDistanceFromStart();
      console.log('Switching current tile to: ' + JSON.stringify(currentTile));

      this.gridStack.push(this.gridService.createTileLocationAndStateObject(currentTile, tileStateVisited));
    }

    // for (const entry of this.nodeMap.entries()) {
    //   console.log('Node Map entry: ' + JSON.stringify(entry));
    // }

    // TODO: apply the search for the shortest path

    // TODO: once shortest path between start and end tile is found, need to communicate that to gridService
    return this.gridStack;
  }

  private getUnvisitedNeighbors(tile: CoordinateSet): CoordinateSet[] {
    const neighbors: CoordinateSet[] = this.gridService.getTileDirectNeighbors(tile);
    const unvisitedNeighbors: CoordinateSet[] = [];
    for (const item of neighbors) {
      if (!this.gridService.existsInTileSetArray(item, this.visitedTiles)) { unvisitedNeighbors.push(item); }
    }
    return unvisitedNeighbors;
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

  private setShortestDistanceAndPreviousNode(neighbor: CoordinateSet, distance: number, previousNode: CoordinateSet) {
    this.nodeMap.set(this.gridService.getTileIndex(neighbor), [distance, previousNode]);
  }

  private getUnvisitedTileWithShortestDistanceFromStart(): CoordinateSet {
    let smallest: number = infinity;
    let nodeCoordinates: CoordinateSet = null;
    for (const [key, value] of this.nodeMap) {
      if (value[0] < smallest && this.gridService.existsInTileSetArray(this.gridService.getTileCoordinates(key), this.unvisitedTiles)) {
        // console.log('Conditions met for this node: ' + JSON.stringify(value[1]));
        smallest = value[0];
        nodeCoordinates = this.gridService.getTileCoordinates(key);
      }
    }
    return nodeCoordinates;
  }

  private addNodeToVisitedTiles(currentTile: CoordinateSet) {
    this.visitedTiles.push(currentTile);
  }

  private removeNodeFromUnvisitedTiles(currentTile: CoordinateSet) {
    this.unvisitedTiles = this.unvisitedTiles.filter(tile => !this.gridService.coordinateSetsAreTheSame(tile, currentTile));
  }
}
