import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {infinity, tileStateNormal, tileStatePath, tileStateVisited} from '../constants/constants';

export class AstarAlgorithm {
  private gridStack: TileLocationAndState[];
  private shortestPath: TileLocationAndState[];
  private unvisitedTiles: CoordinateSet[];
  private visitedTiles: CoordinateSet[];
  private availableTiles: CoordinateSet[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
    this.shortestPath = [];
    this.unvisitedTiles = [];
    this.visitedTiles = [];
    this.availableTiles = [];
  }

  applyAstarAlgorithm(startNodeLocation: CoordinateSet, endNodeLocation: CoordinateSet) {
    this.unvisitedTiles = this.gridService.getAllTilesOfState(tileStateNormal);
    this.unvisitedTiles.push(endNodeLocation);

    let currentTile: CoordinateSet = startNodeLocation;
    this.addTileToGridStack(currentTile, tileStateVisited);
    this.addToVisitedTiles(currentTile);
    this.removeFromUnvisitedTiles(currentTile);

    while (this.unvisitedTiles.length > 0) {
      // get the available neighbors of the current tile
      const availableNeighbors: CoordinateSet[] = this.gridService.getTileDirectNeighbors(currentTile).filter((tile) => {
        if (this.isVisited(tile)) { return false; } else { return true; }
      }).filter((tile) => {
        if (this.isUnvisited(tile)) { return true; } else { return false; }
      });

      // add available neighbors to available tiles
      this.availableTiles.push(...availableNeighbors);

      // loop through available neighbors and pick the tile with
      // shortest distance between itself and the end tile
      const closestTile: CoordinateSet = this.getLeastCostlyTile(this.availableTiles, startNodeLocation, endNodeLocation);
      if (closestTile === null) {
        console.log('Closest tile has come up to be null...');
        console.log('Terminating algorithm execution...');
        break;
      } else if (this.gridService.coordinateSetsAreTheSame(closestTile, endNodeLocation)) {
        break;
      }

      // remove closest tile from available tiles
      this.removeFromAvailableTiles(closestTile);

      // remove closest tile from the unvisited tiles
      this.removeFromUnvisitedTiles(closestTile);

      // add closest tile to visited tiles
      this.addToVisitedTiles(closestTile);

      // set closest tile as the new current tile
      currentTile = closestTile;

      // add current tile to grid stack
      this.addTileToGridStack(currentTile, tileStateVisited);
    }

    this.calculateShortestPath(startNodeLocation, endNodeLocation);

    return this.gridStack;
  }

  private addTileToGridStack(tile: CoordinateSet, state: string = tileStateNormal) {
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(tile, state));
  }

  private getLeastCostlyTile(availableTiles: CoordinateSet[], startNodeLocation: CoordinateSet, endNodeLocation: CoordinateSet) {
    let lowestCost: number = infinity;
    let lowestCostTile: CoordinateSet = null;
    availableTiles.forEach((tile) => {
      const cost: number = (this.gridService.getDistanceBetweenTiles(tile, startNodeLocation)
        + this.gridService.getDistanceBetweenTiles(tile, endNodeLocation));
      if (cost < lowestCost) {
        lowestCost = cost;
        lowestCostTile = tile;
      }
    });
    return lowestCostTile;
  }

  private removeFromUnvisitedTiles(currentTile: CoordinateSet) {
    this.unvisitedTiles = this.unvisitedTiles.filter((tile) => {
      if (this.gridService.coordinateSetsAreTheSame(tile, currentTile)) {
        return false;
      } else {
        return true;
      }
    });
  }

  private addToVisitedTiles(tile: CoordinateSet) {
    this.visitedTiles.push(tile);
  }

  private isVisited(tile: CoordinateSet) {
    for (const visitedTile of this.visitedTiles) {
      if (this.gridService.coordinateSetsAreTheSame(tile, visitedTile)) {
        return true;
      }
    }
    return false;
  }

  private removeFromAvailableTiles(currentTile: CoordinateSet) {
    this.availableTiles = this.availableTiles.filter((tile) => {
      if (this.gridService.coordinateSetsAreTheSame(tile, currentTile)) {
        return false;
      } else {
        return true;
      }
    });
  }

  private isUnvisited(tile: CoordinateSet) {
    for (const unvisitedTile of this.unvisitedTiles) {
      if (this.gridService.coordinateSetsAreTheSame(tile, unvisitedTile)) {
        return true;
      }
    }
    return false;
  }

  private calculateShortestPath(startNodeLocation: CoordinateSet, endNodeLocation: CoordinateSet) {
    const shortestPath: TileLocationAndState[] = [];
    let currentTile: CoordinateSet = endNodeLocation;

    const tracedTiles: CoordinateSet[] = [];
    let popped = false;

    while (true) {
      // this will return an empty array if no tiles are available as neighbors
      const visitedNeighborsOfCurrentTile: CoordinateSet[] = this.gridService.getTileDirectNeighbors(currentTile).filter((tile) => {
        if (this.isVisited(tile)) { return true; } else { return false; }
      }).filter((tile) => {
        if (this.tileExistsInList(tile, tracedTiles)) { return false; } else { return true; }
      });

      // this will yield null if the passed array is empty
      const leastCostlyNeighbor: CoordinateSet = this.getLeastCostlyTile(visitedNeighborsOfCurrentTile, startNodeLocation, endNodeLocation);

      // if least costly neighbor is null, we will pop the last
      // tile from the gridStack and make that the new current tile
      // and continue the loop
      if (leastCostlyNeighbor === null) {
        const poppedTile = shortestPath.pop();
        popped = true;

        console.log('Popping tile: ' + JSON.stringify(poppedTile));

        currentTile = this.gridService.createCoordinateSet(poppedTile.coordinateX, poppedTile.coordinateY);
        continue;
      }
      if (this.gridService.coordinateSetsAreTheSame(leastCostlyNeighbor, startNodeLocation)) {
        break;
      }

      if (popped) {
        shortestPath.push(this.gridService.createTileLocationAndStateObject(currentTile, tileStatePath));
        shortestPath.push(this.gridService.createTileLocationAndStateObject(leastCostlyNeighbor, tileStatePath));
        popped = false;
      } else {
        shortestPath.push(this.gridService.createTileLocationAndStateObject(leastCostlyNeighbor, tileStatePath));
      }

      tracedTiles.push(leastCostlyNeighbor);
      currentTile = leastCostlyNeighbor;
    }
    this.gridService.setShortestPathStateData(shortestPath.reverse());
  }

  private tileExistsInList(inputTile: CoordinateSet, listOfTiles: CoordinateSet[]): boolean {
    for (const tile of listOfTiles) {
      if (this.gridService.coordinateSetsAreTheSame(tile, inputTile)) {
        return true;
      }
    }
    return false;
  }
}
