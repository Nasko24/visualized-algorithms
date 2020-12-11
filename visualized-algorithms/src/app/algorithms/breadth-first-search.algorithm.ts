import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';
import {tileStateNormal, tileStatePath, tileStateVisited} from '../constants/constants';
import {not} from 'rxjs/internal-compatibility';

export interface TreeNode {
  parent: CoordinateSet;
  node: CoordinateSet;
}

export class BreadthFirstSearchAlgorithm {
  private gridStack: TileLocationAndState[];
  private visitedTiles: CoordinateSet[];
  private unvisitedTiles: CoordinateSet[];
  private availableNeighbors: CoordinateSet[];
  private neighborTree: TreeNode[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
    this.visitedTiles = [];
    this.unvisitedTiles = [];
    this.availableNeighbors = [];
    this.neighborTree = [];
  }

  applyBreadthFirstSearchAlgorithm(startNodeLocation: CoordinateSet, endNodeLocation: CoordinateSet) {
    this.unvisitedTiles = this.gridService.getAllTilesOfState(tileStateNormal);
    this.unvisitedTiles.push(endNodeLocation);

    const availableNeighbors: CoordinateSet[] = this.getTileNeighbors(startNodeLocation);
    this.addTilesToAvailableNeighbors(availableNeighbors);
    this.applyChildrenToTree(availableNeighbors, startNodeLocation);
    this.addTileToGridStack(startNodeLocation, tileStateVisited);
    this.addTileToVisitedTiles(startNodeLocation);

    this.neighborTree.push({parent: null, node: startNodeLocation});

    let end = false;
    let notFound = false;
    while (this.unvisitedTiles.length !== 0) {
      // loop through all available neighbors
      let newNeighbors: CoordinateSet[] = [];
      const len = this.availableNeighbors.length;
      if (len === 0) { notFound = true; break; }

      for (let i = 0; i < len; i++) {
        const neighbor = this.availableNeighbors.pop();
        if (this.gridService.coordinateSetsAreTheSame(neighbor, endNodeLocation)) {
          end = true;
          break;
        }

        const children: CoordinateSet[] = this.getTileNeighbors(neighbor);

        newNeighbors.push(...children);
        newNeighbors = this.removeDuplicates(newNeighbors);

        this.applyChildrenToTree(children, neighbor);

        this.removeTileFromUnvisitedTiles(neighbor);

        this.addTileToVisitedTiles(neighbor);

        this.addTileToGridStack(neighbor, tileStateVisited);
      }

      if (end || notFound) { break; }

      this.addTilesToAvailableNeighbors(newNeighbors);
    }

    if (!notFound) {
      this.calculateShortestPath(endNodeLocation);
    }

    return this.gridStack;
  }

  private addTileToVisitedTiles(tile: CoordinateSet) {
    this.visitedTiles.push(tile);
  }

  private addTilesToAvailableNeighbors(tiles: CoordinateSet[]) {
    this.availableNeighbors.push(...tiles);
  }

  private addTileToGridStack(tile: CoordinateSet, state: string = tileStateNormal) {
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(tile, state));
  }

  private getTileNeighbors(inputTile: CoordinateSet): CoordinateSet[] {
    // if the tile is NOT visited AND is NOT in the stack AND IS unvisited
    return this.gridService.getTileDirectNeighbors(inputTile).filter((tile) => {
      return !this.tileExistsInArray(tile, this.visitedTiles);
    }).filter((tile) => {
      return this.tileExistsInArray(tile, this.unvisitedTiles);
    });
  }

  private tileExistsInArray(inputTile: CoordinateSet, tileArray: CoordinateSet[]): boolean {
    for (const tile of tileArray) {
      if (this.gridService.coordinateSetsAreTheSame(tile, inputTile)) { return true; }
    }
    return false;
  }

  private removeTileFromUnvisitedTiles(currentTile: CoordinateSet) {
    this.unvisitedTiles = this.unvisitedTiles.filter((tile) => {
      return !(this.gridService.coordinateSetsAreTheSame(tile, currentTile));
    });
  }

  private removeDuplicates(list: CoordinateSet[]) {
    const newList: CoordinateSet[] = [];
    for (const tile of list) {
      if (this.tileExistsInArray(tile, newList)) {
        continue;
      } else {
        newList.push(tile);
      }
    }
    return newList;
  }

  private applyChildrenToTree(children: CoordinateSet[], parent: CoordinateSet) {
    for (const child of children) {
      const newNode: TreeNode = {
        parent,
        node: child
      };
      this.neighborTree.push(newNode);
    }
  }

  private calculateShortestPath(endNodeLocation: CoordinateSet) {
    const shortestPath: TileLocationAndState[] = [];
    let currentNode: CoordinateSet;

    // search for the endNode in the tree
    for (const node of this.neighborTree) {
      if (this.gridService.coordinateSetsAreTheSame(node.node, endNodeLocation)) {
        currentNode = node.parent;
        shortestPath.push(this.gridService.createTileLocationAndStateObject(currentNode, tileStatePath));
      }
    }

    // search up the tree until we find a null parent
    while (currentNode !== null) {
      for (const node of this.neighborTree) {
        // find the current node in the tree and take its parent as the current node
        if (this.gridService.coordinateSetsAreTheSame(node.node, currentNode)) {
          if (currentNode !== null) {
            shortestPath.push(this.gridService.createTileLocationAndStateObject(currentNode, tileStatePath));
            currentNode = node.parent;
            break;
          }
        }
      }
    }

    this.gridService.setShortestPathStateData(shortestPath.reverse());
  }
}
