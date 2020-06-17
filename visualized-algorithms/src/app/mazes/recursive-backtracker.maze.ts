import Stack from 'ts-data.stack';
import {TileLocationAndState} from '../constants/interfaces';
import {gridXSize, gridYSize, tileStateWall} from '../constants/constants';

export class RecursiveBacktrackerMaze {
  private startNode: number[];
  private endNode: number[];
  private startLocation: number[];
  private gridStack: Stack<TileLocationAndState>;
  private localStack: number[][];
  private visitedTiles: number[][];

  constructor(startNode: number[], endNode: number[], startingLocation: number[]) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.startLocation = startingLocation;
    this.gridStack = new Stack<TileLocationAndState>();
    this.localStack = new Array<number[]>();
    this.visitedTiles = new Array<number[]>();
  }

  generateMaze(): Stack<TileLocationAndState> {

    // start out by putting start node on the stack
    this.visitedTiles.push(this.startLocation);
    let currentTile = this.startLocation;

    // while the visited tile stack is not empty, keep going
    while (this.visitedTiles.length !== 0) {
      // get random unvisited neighbor
      const randomUnvisitedNeighbor = this.selectRandomUnvisitedNeighbor(this.getUnvisitedNeighbors(currentTile));
      if (randomUnvisitedNeighbor == null) {
        // TODO: pop the last tile from the local stack and set that as the currentTile
        continue;
      }
      currentTile = randomUnvisitedNeighbor;

      // mark the random unvisited neighbor as VISITED
      this.visitedTiles.push(randomUnvisitedNeighbor);
    }

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

  private getUnvisitedNeighbors(currentTile: number[]): number[][] {
    const neighbors = new Array<number[]>();
    const unvisitedNeighbors = new Array<number[]>();

    neighbors.push([currentTile[0], currentTile[1] + 1]);
    neighbors.push([currentTile[0], currentTile[1] - 1]);
    neighbors.push([currentTile[0] - 1, currentTile[1]]);
    neighbors.push([currentTile[0] + 1, currentTile[1]]);

    neighbors.forEach(value => {
      if (value[0] >= 0 && value[0] < gridXSize && value[1] >= 0 && value[1] < gridYSize && !this.visitedTiles.includes(value)) {
        unvisitedNeighbors.push(value);
      }
    });

    if (unvisitedNeighbors.length === 0) {
      return null;
    } else {
      return unvisitedNeighbors;
    }
  }

  private selectRandomUnvisitedNeighbor(unvisitedNeighbors: number[][]): number[] {
    return unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
  }
}
