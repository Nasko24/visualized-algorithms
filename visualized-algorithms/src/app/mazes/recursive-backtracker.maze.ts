import Stack from 'ts-data.stack';

export class RecursiveBacktrackerMaze {
  private startNode: number[];
  private endNode: number[];
  private startLocation: number[];
  private gridStack: Stack<number[]>;

  constructor(startNode: number[], endNode: number[], startingLocation: number[]) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.startLocation = startingLocation;
  }

  generateMaze(): Stack<number[]> {
    this.gridStack.push([0, 1]);
    return this.gridStack;
  }
}
