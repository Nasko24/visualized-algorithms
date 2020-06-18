import {TileLocationAndState} from '../constants/interfaces';
import {gridXSize, gridYSize, tileStateVisited, tileStateWall} from '../constants/constants';

export class RecursiveBacktrackerMaze {
  private startNode: number[];
  private endNode: number[];
  private startLocation: number[];
  private gridStack: TileLocationAndState[];
  private localStack: number[][];
  private visitedTiles: number[][];

  constructor(startNode: number[], endNode: number[], startingLocation: number[]) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.startLocation = startingLocation;
    this.gridStack = [];
    this.localStack = new Array<number[]>();
    this.visitedTiles = new Array<number[]>();
  }

  generateMaze(): TileLocationAndState[] {

    // start out by putting start node on the visitedTiles stack
    this.visitedTiles.push(this.startLocation);
    let currentTile = this.startLocation;
    // push the current tile to the local stack
    this.localStack.push(currentTile);
    // create TileLocationAndState object based on currentTile object
    this.gridStack.push(this.createTileLocationAndStateObject(currentTile));

    // while the visited tile stack is not empty, keep going
    const maxIterations = 10;
    let count = 0;
    while (this.localStack.length !== 0 && count < maxIterations) {
      count++;

      // get random unvisited neighbor
      // if the unvisited neighbor is null (meaning that there are no unvisited neighbors for the current tile)
      // pop the last tile from the local stack and mark as current tile (going backwards to trace another path)
      let randomUnvisitedNeighbor: number[];
      randomUnvisitedNeighbor = this.selectRandomUnvisitedNeighbor(this.getUnvisitedNeighbors(currentTile));

      if (randomUnvisitedNeighbor === null) {
        currentTile = this.localStack.pop();
        continue;
      }

      // set the non-null random neighbor to the current tile
      currentTile = randomUnvisitedNeighbor;
      // mark the random unvisited neighbor as VISITED
      this.visitedTiles.push(randomUnvisitedNeighbor);
      // push the current tile to the local stack (keep track of path)
      this.localStack.push(currentTile);
      // push the current tile to the gridStack
      this.gridStack.push(this.createTileLocationAndStateObject(currentTile));
    }

    console.log(this.visitedTiles);
    console.log(this.localStack);
    // for (let i = 0; i < 62; i++) {
    //   const stateData: TileLocationAndState = {
    //     coordinateX: i,
    //     coordinateY: 0,
    //     tileState: tileStateWall
    //   };
    //   const stateData2: TileLocationAndState = {
    //     coordinateX: i,
    //     coordinateY: 23,
    //     tileState: tileStateWall
    //   };
    //   this.gridStack.push(stateData);
    //   this.gridStack.push(stateData2);
    // }
    // for (let i = 0; i < 24; i++) {
    //   const stateData: TileLocationAndState = {
    //     coordinateX: 0,
    //     coordinateY: i,
    //     tileState: tileStateWall
    //   };
    //   const stateData2: TileLocationAndState = {
    //     coordinateX: 61,
    //     coordinateY: i,
    //     tileState: tileStateWall
    //   };
    //   this.gridStack.push(stateData);
    //   this.gridStack.push(stateData2);
    // }

    return this.gridStack;
  }

  // TODO: make a unit test for this method
  private getUnvisitedNeighbors(currentTile: number[]): number[][] {
    const neighbors = new Array<number[]>();
    const unvisitedNeighbors = new Array<number[]>();

    // upper, lower, left, and right neighbor coordinates
    neighbors.push([currentTile[0], (currentTile[1] + 1)]);
    neighbors.push([currentTile[0], (currentTile[1] - 1)]);
    neighbors.push([(currentTile[0] - 1), currentTile[1]]);
    neighbors.push([(currentTile[0] + 1), currentTile[1]]);

    neighbors.forEach(value => {
      if (value[0] >= 0 && value[0] < gridXSize && value[1] >= 0 && value[1] < gridYSize) {
        if (this.visitedTiles.indexOf(value) === -1) {
          unvisitedNeighbors.push(value);
        }
      }
    });

    if (unvisitedNeighbors.length === 0) {
      return null;
    } else {
      return unvisitedNeighbors;
    }
  }

  private selectRandomUnvisitedNeighbor(unvisitedNeighbors: number[][]): number[] {
    if (unvisitedNeighbors == null) {
      return null;
    } else {
      return unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
    }
  }

  private createTileLocationAndStateObject(currentTile: number[]): TileLocationAndState {
    return { coordinateX: currentTile[0], coordinateY: currentTile[1], tileState: tileStateWall};
  }

  private existsInVisitedTiles(value: number[]): boolean {
    this.visitedTiles.forEach( item => {
      if (this.arraysAreEqual(item, value)) {
        return true;
      }
    });
    return false;
  }

  private arraysAreEqual(array1: number[], array2: number[])  {
    if (array1 === array2) { return true; }
    if (array1.length !== array2.length) { return false; }
    if (array1 == null || array2 == null) { return false; }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) { return false; }
    }
    return true;
  }
}
