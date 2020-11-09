import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {infinity, tileStateNormal, tileStatePath, tileStateVisited} from '../constants/constants';

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
    this.unvisitedTiles.push(endTile);
    this.visitedTiles = [];
    this.shortestPath = [];
    this.nodeMap = this.generateMap(startTile, endTile, this.unvisitedTiles);

    let currentTile: CoordinateSet = startTile;
    // continue running loop until all tiles have been visited
    while (this.unvisitedTiles.length > 0) {

      const unvisitedNeighbors: CoordinateSet[] = this.getUnvisitedNeighbors(currentTile);

      for (const neighbor of unvisitedNeighbors) {
        const previousNode: CoordinateSet = currentTile;
        const neighborDistanceFromStart: number = this.nodeMap.get(this.gridService.getTileIndex(currentTile))[0]
          + this.gridService.getTileWeight(neighbor);

        if (neighborDistanceFromStart < this.nodeMap.get(this.gridService.getTileIndex(neighbor))[0]) {
          this.setShortestDistanceAndPreviousNode(neighbor, neighborDistanceFromStart, previousNode);
        }
      }

      // remove current tile from unvisited tiles and add to visited tiles
      this.removeNodeFromUnvisitedTiles(currentTile);
      this.addNodeToVisitedTiles(currentTile);

      // if the current tile is the end tile, break the loop
      if (this.gridService.coordinateSetsAreTheSame(currentTile, endTile)) {
        break;
      }

      // get the next unvisited tile with shortest distance from start
      currentTile = this.getUnvisitedTileWithShortestDistanceFromStart();

      // push the current tile to the gridStack
      this.gridStack.push(this.gridService.createTileLocationAndStateObject(currentTile, tileStateVisited));
    }

    this.calculateShortestPath(startTile, endTile);

    return this.gridStack;
  }

  private getUnvisitedNeighbors(tile: CoordinateSet): CoordinateSet[] {
    const neighbors: CoordinateSet[] = this.gridService.getTileDirectNeighbors(tile);
    const unvisitedNeighbors: CoordinateSet[] = [];
    for (const item of neighbors) {
      if (this.gridService.existsInTileSetArray(item, this.unvisitedTiles)) { unvisitedNeighbors.push(item); }
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

  private calculateShortestPath(startTile: CoordinateSet, endTile: CoordinateSet) {
    let currentTile: CoordinateSet = endTile;
    while (!this.gridService.coordinateSetsAreTheSame(currentTile, startTile)) {
      if (!this.gridService.coordinateSetsAreTheSame(currentTile, endTile)) {
        this.shortestPath.push(this.gridService.createTileLocationAndStateObject(currentTile, tileStatePath));
      }
      const currentTileIndex: number = this.gridService.getTileIndex(currentTile);
      const previousTile: CoordinateSet = this.nodeMap.get(currentTileIndex)[1];
      currentTile = previousTile;
    }
    this.gridService.setShortestPathStateData(this.shortestPath.reverse());
  }
}
