import {Injectable} from '@angular/core';
import {
  defaultEndNode,
  defaultStartNode,
  gridSize,
  gridXSize,
  gridYSize,
  speedFast,
  tileStateNormal, tileStateWall
} from '../constants/constants';
import {Subject} from 'rxjs';
import {CoordinateSet, Speed, TileLocationAndState} from '../constants/interfaces';

@Injectable({ providedIn: 'root' })
export class GridService {
  private gridCellCount = gridSize;
  private stateChangeSource = new Subject<TileLocationAndState>();
  private currentSpeed: Speed = speedFast;
  private tileStack: TileLocationAndState[];

  stateChange$ = this.stateChangeSource.asObservable();

  constructor() {
    this.tileStack = [];
  }

  getGridCellCount() {
    return this.gridCellCount;
  }

  emitStateChangeForLocation(data: TileLocationAndState) {
    this.stateChangeSource.next(data);
  }

  setCurrentSpeed(speed: Speed) {
    this.currentSpeed = speed;
    console.log('Current speed is set to: ' + speed.speedMS);
  }

  getCurrentSpeed(): Speed {
    return this.currentSpeed;
  }

  clearGrid() {
    for (let x = 0; x < gridXSize; x++) {
      for (let y = 0; y < gridYSize; y++) {
        const stateData: TileLocationAndState = {
          coordinateX: x,
          coordinateY: y,
          tileState: tileStateNormal};
        this.emitStateChangeForLocation(stateData);
      }
    }
    this.clearTileStack();
  }

  private clearTileStack() {
    this.tileStack = [];
  }

  getStartNodeLocation(): CoordinateSet {
    // TODO: service needs to know the actual start node location if its been moved
    return this.createCoordinateSet(defaultStartNode[0], defaultStartNode[1]);
  }

  getEndNodeLocation(): CoordinateSet {
    // TODO: service needs to know the actual end node location
    return this.createCoordinateSet(defaultEndNode[0], defaultEndNode[1]);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async applyStackAlgorithm() {
    // tslint:disable-next-line:no-shadowed-variable
    const count = this.tileStack.length;
    for (let i = 0; i < count; i++) {
      this.emitStateChangeForLocation(this.tileStack.pop());
      await this.sleep(this.getCurrentSpeed().speedMS);
    }
  }

  async applyStackMaze() {
    // tslint:disable-next-line:prefer-for-of
    for (const tile of this.tileStack) {
      this.emitStateChangeForLocation(tile);
      await this.sleep(25);
    }
  }

  public setGridStateData(tileStack: TileLocationAndState[]) {
    this.tileStack = tileStack;
  }

  public getGridStateData(): TileLocationAndState[] {
    return this.tileStack;
  }

  pushStateData(stateData: TileLocationAndState) {
    this.tileStack.push(stateData);
  }

  public createCoordinateSet(x: number, y: number): CoordinateSet {
    const set: CoordinateSet = {x, y};
    return set;
  }

  coordinateSetsAreTheSame(set1: CoordinateSet, set2: CoordinateSet): boolean {
    if (set1.x === set2.x && set1.y === set2.y) { return true; } else { return false; }
  }

  existsInTileSetArray(neighbor: CoordinateSet, array: CoordinateSet[]): boolean {
    for (const tile of array) {
      if (this.coordinateSetsAreTheSame(neighbor, tile)) {
        return true;
      }
    }
    return false;
  }

  createTileLocationAndStateObject(currentTile: CoordinateSet): TileLocationAndState {
    return { coordinateX: currentTile.x, coordinateY: currentTile.y, tileState: tileStateNormal};
  }

  getUpperNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    return [
      this.createCoordinateSet(currentTile.x, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y + 2),
      this.createCoordinateSet(currentTile.x, currentTile.y + 2),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y + 2),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y + 1)
    ];
  }

  getLowerNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    return [
      this.createCoordinateSet(currentTile.x, currentTile.y - 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y - 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y - 2),
      this.createCoordinateSet(currentTile.x, currentTile.y - 2),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y - 2),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y - 1)
    ];
  }

  getRightNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    return [
      this.createCoordinateSet(currentTile.x + 1, currentTile.y),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x + 2, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x + 2, currentTile.y),
      this.createCoordinateSet(currentTile.x + 2, currentTile.y - 1),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y - 1)
    ];
  }

  getLeftNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    return [
      this.createCoordinateSet(currentTile.x - 1, currentTile.y),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x - 2, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x - 2, currentTile.y),
      this.createCoordinateSet(currentTile.x - 2, currentTile.y - 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y - 1)
    ];
  }

  getTileAbove(tile: CoordinateSet): CoordinateSet {
    return this.createCoordinateSet(tile.x, tile.y + 1);
  }

  getTileBelow(tile: CoordinateSet): CoordinateSet {
    return this.createCoordinateSet(tile.x, tile.y - 1);
  }

  getTileRight(tile: CoordinateSet): CoordinateSet {
    return this.createCoordinateSet(tile.x + 1, tile.y);
  }

  getTileLeft(tile: CoordinateSet): CoordinateSet {
    return this.createCoordinateSet(tile.x - 1, tile.y);
  }

  setGridToAllWalls() {
    for (let x = 0; x < gridXSize; x++) {
      for (let y = 0; y < gridYSize; y++) {
        const stateData: TileLocationAndState = {
          coordinateX: x,
          coordinateY: y,
          tileState: tileStateWall};
        this.emitStateChangeForLocation(stateData);
      }
    }
  }
}
